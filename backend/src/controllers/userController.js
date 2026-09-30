import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signAccessToken, signRefreshToken } from '../utils/tokens.js';
import { AVATAR_DIR } from '../middleware/upload.js';
import { validatePassword, cleanName, NAME_MESSAGE, isCountryCode, isCurrencyCode } from '../utils/validators.js';

// Must match the dictionaries shipped in frontend/src/i18n/locales.
const APP_LANGUAGES = ['en', 'fr', 'es', 'ar', 'hi', 'ur'];

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
  authProvider: user.authProvider,
  currency: user.currency,
  language: user.language,
  country: user.country,
  avatarUrl: user.avatarUrl,
  onboardingCompleted: user.onboardingCompleted,
});

export const updateProfile = async (req, res, next) => {
  try {
    const { name, country, currency, language, completeOnboarding } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Please sign in again.' });
    }

    if (name !== undefined) {
      if (typeof name === 'string' && !name.trim()) {
        return res.status(400).json({ success: false, message: 'Your name cannot be empty.' });
      }
      const cleaned = cleanName(name);
      if (!cleaned) {
        return res.status(400).json({ success: false, message: NAME_MESSAGE });
      }
      user.name = cleaned;
    }

    if (country !== undefined) {
      if (!isCountryCode(country)) {
        return res.status(400).json({ success: false, message: 'That selection is not valid.' });
      }
      user.country = country;
    }

    if (currency !== undefined) {
      if (!isCurrencyCode(currency)) {
        return res.status(400).json({ success: false, message: 'That selection is not valid.' });
      }
      user.currency = currency;
    }

    if (language !== undefined) {
      if (typeof language !== 'string') {
        return res.status(400).json({ success: false, message: 'That language is not supported.' });
      }
      if (!APP_LANGUAGES.includes(language)) {
        return res.status(400).json({ success: false, message: 'That language is not supported.' });
      }
      user.language = language;
    }
    if (completeOnboarding) user.onboardingCompleted = true;

    await user.save();

    res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Enter your current password and a new password.',
      });
    }

    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({ success: false, message: 'Enter your current password and a new password.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Please sign in again.' });
    }

    const passwordError = validatePassword(newPassword, { email: user.email, name: user.name });
    if (passwordError) {
      return res.status(400).json({ success: false, message: passwordError });
    }

    if (!user.passwordHash) {
      return res.status(400).json({
        success: false,
        message: 'This account signs in with Google and does not have a password to change.',
      });
    }

    const matches = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!matches) {
      return res.status(400).json({ success: false, message: 'Your current password is not right.' });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save();

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
    res.json({ success: true, accessToken, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const changeAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Choose an image to upload.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Please sign in again.' });
    }

    if (user.avatarUrl && user.avatarUrl.startsWith('/uploads/avatars/')) {
      const previousPath = path.join(AVATAR_DIR, path.basename(user.avatarUrl));
      fs.unlink(previousPath, () => {});
    }

    user.avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await user.save();

    res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};
