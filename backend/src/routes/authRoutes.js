import { Router } from 'express';
import { signup, login, logout, googleAuth, googleCallback, refresh, me } from '../controllers/authController.js';
import {
  validateEmailAddress,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from '../controllers/passwordResetController.js';
import { authenticate } from '../middleware/auth.js';
import {
  loginLimiter,
  signupLimiter,
  googleLimiter,
  refreshLimiter,
  forgotLimiter,
  verifyCodeLimiter,
  resetLimiter,
  emailCheckLimiter,
} from '../middleware/rateLimiters.js';
import { verifyCaptcha } from '../middleware/captcha.js';

const router = Router();

router.post('/signup', signupLimiter, verifyCaptcha, signup);
router.post('/login', loginLimiter, verifyCaptcha, login);
router.post('/logout', logout);
router.post('/google', googleLimiter, googleAuth);
router.post('/google/callback', googleLimiter, googleCallback);
router.post('/refresh', refreshLimiter, refresh);
router.get('/me', authenticate, me);
router.post('/validate-email', emailCheckLimiter, validateEmailAddress);
router.post('/forgot-password', forgotLimiter, forgotPassword);
router.post('/verify-reset-code', verifyCodeLimiter, verifyResetCode);
router.post('/reset-password', resetLimiter, resetPassword);

export default router;
