import rateLimit from 'express-rate-limit';

const build = (windowMs, max) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many attempts. Please wait a moment and try again.' },
  });

export const forgotLimiter = build(60 * 60 * 1000, 15);
export const verifyCodeLimiter = build(15 * 60 * 1000, 30);
export const resetLimiter = build(15 * 60 * 1000, 15);
export const emailCheckLimiter = build(5 * 60 * 1000, 80);
