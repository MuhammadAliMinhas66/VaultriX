import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const REFRESH_COOKIE_NAME = 'vaultrix_refresh';

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  plan: user.plan,
  currency: user.currency,
  language: user.language,
  country: user.country,
});

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, currency, country } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are all required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password needs to be at least 8 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const organization = await Organization.create({ name: `${name}'s workspace` });

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      orgId: organization._id,
      name,
      email: email.toLowerCase(),
      passwordHash,
      currency: currency || 'PKR',
      country: country || '',
      role: 'owner',
    });

    organization.ownerId = user._id;
    await organization.save();

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
    res.status(201).json({ success: true, accessToken, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Enter your email and password to continue.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'That email or password is not right.' });
    }

    if (!user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: 'This account was created with Google. Use the Google sign-in button instead.',
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'That email or password is not right.' });
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
    res.json({ success: true, accessToken, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
  res.json({ success: true });
};

export const refresh = async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Please sign in to continue.' });
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub);

    if (!user || (user.tokenVersion || 0) !== payload.tokenVersion) {
      res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
      return res.status(401).json({ success: false, message: 'Please sign in again.' });
    }

    const accessToken = signAccessToken(user);
    const newRefreshToken = signRefreshToken(user);

    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, refreshCookieOptions);
    res.json({ success: true, accessToken, user: publicUser(user) });
  } catch (error) {
    res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
    res.status(401).json({ success: false, message: 'Please sign in again.' });
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Please sign in again.' });
    }

    res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ success: false, message: 'Google sign-in did not send back a token.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      return res.status(400).json({ success: false, message: 'Could not read your Google account details.' });
    }

    let user = await User.findOne({ email: payload.email.toLowerCase() });

    if (!user) {
      const organization = await Organization.create({ name: `${payload.name || payload.email}'s workspace` });

      user = await User.create({
        orgId: organization._id,
        name: payload.name || payload.email,
        email: payload.email.toLowerCase(),
        authProvider: 'google',
        googleId: payload.sub,
        currency: 'PKR',
        role: 'owner',
      });

      organization.ownerId = user._id;
      await organization.save();
    } else if (user.authProvider !== 'google') {
      user.authProvider = 'google';
      user.googleId = payload.sub;
      await user.save();
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
    res.json({ success: true, accessToken, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};
