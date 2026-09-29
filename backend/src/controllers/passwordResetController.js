import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { signResetToken, verifyResetToken } from '../utils/tokens.js';
import { checkEmail, parseEmail, EMAIL_MESSAGES } from '../utils/emailValidation.js';
import { sendMail } from '../utils/mailer.js';
import { otpEmail, googleAccountEmail, passwordChangedEmail } from '../utils/mailTemplates.js';

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 10;
const OTP_TTL_MS = OTP_TTL_MINUTES * 60 * 1000;
const RESEND_COOLDOWN_SECONDS = 60;
const RESEND_COOLDOWN_MS = RESEND_COOLDOWN_SECONDS * 1000;
const MAX_SENDS_PER_HOUR = 5;
const MAX_ATTEMPTS = 5;
const HOUR_MS = 60 * 60 * 1000;
const RESET_SESSION_MS = 10 * 60 * 1000;

const REFRESH_COOKIE_NAME = 'vaultrix_refresh';
const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
};

const MESSAGES = {
  wait: 'Please wait a moment before requesting another code.',
  hourly: 'Too many code requests. Please try again in an hour.',
  wrong: 'That code is not right. Check it and try again.',
  expired: 'That code has expired. Request a new one.',
  tooMany: 'Too many wrong codes. Request a new one.',
  session: 'Your reset session has expired. Please start again.',
  passwordRequired: 'Enter a new password to continue.',
  passwordShort: 'New password needs to be at least 8 characters.',
};

const fail = (res, status, message) => res.status(status).json({ success: false, message });

const generateCode = () => String(crypto.randomInt(0, 10 ** OTP_LENGTH)).padStart(OTP_LENGTH, '0');

const sendInBackground = (message, to) => {
  sendMail({ to, ...message }).catch((error) => {
    console.error('Could not send email:', error.message);
  });
};

export const validateEmailAddress = async (req, res, next) => {
  try {
    const result = await checkEmail(req.body?.email);
    res.json({ success: true, valid: result.ok, reason: result.ok ? null : result.reason });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const parsed = parseEmail(req.body?.email);
    if (!parsed) return fail(res, 400, EMAIL_MESSAGES.format);

    const { email } = parsed;
    const now = Date.now();

    const existing = await PasswordReset.findOne({ email });
    const inWindow = Boolean(existing) && now - existing.windowStartedAt.getTime() < HOUR_MS;

    if (existing && now - existing.lastSentAt.getTime() < RESEND_COOLDOWN_MS) {
      return fail(res, 429, MESSAGES.wait);
    }

    if (inWindow && existing.sendCount >= MAX_SENDS_PER_HOUR) {
      return fail(res, 429, MESSAGES.hourly);
    }

    const user = await User.findOne({ email });
    const canUseCode = Boolean(user?.passwordHash);

    const code = generateCode();
    const otpHash = await bcrypt.hash(canUseCode ? code : crypto.randomBytes(12).toString('hex'), 10);

    await PasswordReset.findOneAndUpdate(
      { email },
      {
        $set: {
          userId: canUseCode ? user._id : null,
          otpHash,
          otpExpiresAt: new Date(now + OTP_TTL_MS),
          attempts: 0,
          verified: false,
          resetNonce: null,
          resetExpiresAt: null,
          lastSentAt: new Date(now),
          windowStartedAt: inWindow ? existing.windowStartedAt : new Date(now),
          sendCount: inWindow ? existing.sendCount + 1 : 1,
          expiresAt: new Date(now + HOUR_MS),
        },
      },
      { upsert: true }
    );

    if (user && canUseCode) {
      sendInBackground(otpEmail({ name: user.name, code, minutes: OTP_TTL_MINUTES }), email);
    } else if (user) {
      sendInBackground(googleAccountEmail({ name: user.name }), email);
    }

    res.json({
      success: true,
      cooldownSeconds: RESEND_COOLDOWN_SECONDS,
      expiresInMinutes: OTP_TTL_MINUTES,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyResetCode = async (req, res, next) => {
  try {
    const parsed = parseEmail(req.body?.email);
    const code = String(req.body?.code ?? '').trim();

    if (!parsed || !new RegExp(`^\\d{${OTP_LENGTH}}$`).test(code)) {
      return fail(res, 400, MESSAGES.wrong);
    }

    const { email } = parsed;
    const now = new Date();

    const record = await PasswordReset.findOneAndUpdate(
      { email, attempts: { $lt: MAX_ATTEMPTS }, otpExpiresAt: { $gt: now } },
      { $inc: { attempts: 1 } },
      { new: true }
    );

    if (!record) {
      const stale = await PasswordReset.findOne({ email });
      if (!stale) return fail(res, 400, MESSAGES.wrong);
      if (stale.otpExpiresAt <= now) return fail(res, 400, MESSAGES.expired);
      return fail(res, 400, MESSAGES.tooMany);
    }

    const matches = await bcrypt.compare(code, record.otpHash);

    if (!matches || !record.userId) {
      return fail(res, 400, record.attempts >= MAX_ATTEMPTS ? MESSAGES.tooMany : MESSAGES.wrong);
    }

    const nonce = crypto.randomBytes(16).toString('hex');

    record.verified = true;
    record.resetNonce = nonce;
    record.resetExpiresAt = new Date(Date.now() + RESET_SESSION_MS);
    record.otpExpiresAt = new Date();
    await record.save();

    const resetToken = signResetToken({ sub: String(record.userId), nonce });

    res.json({ success: true, resetToken });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body || {};

    if (!resetToken || !newPassword) return fail(res, 400, MESSAGES.passwordRequired);
    if (typeof newPassword !== 'string' || newPassword.length < 8) return fail(res, 400, MESSAGES.passwordShort);

    let payload;
    try {
      payload = verifyResetToken(resetToken);
    } catch (error) {
      return fail(res, 400, MESSAGES.session);
    }

    const record = await PasswordReset.findOne({
      userId: payload.sub,
      resetNonce: payload.nonce,
      verified: true,
      resetExpiresAt: { $gt: new Date() },
    });

    const user = record ? await User.findById(payload.sub) : null;

    if (!record || !user) return fail(res, 400, MESSAGES.session);

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    await PasswordReset.deleteMany({ email: record.email });

    res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
    sendInBackground(passwordChangedEmail({ name: user.name }), user.email);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
