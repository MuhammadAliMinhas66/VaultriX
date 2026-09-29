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
  forgotLimiter,
  verifyCodeLimiter,
  resetLimiter,
  emailCheckLimiter,
} from '../middleware/rateLimiters.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/google', googleAuth);
router.post('/google/callback', googleCallback);
router.post('/refresh', refresh);
router.get('/me', authenticate, me);
router.post('/validate-email', emailCheckLimiter, validateEmailAddress);
router.post('/forgot-password', forgotLimiter, forgotPassword);
router.post('/verify-reset-code', verifyCodeLimiter, verifyResetCode);
router.post('/reset-password', resetLimiter, resetPassword);

export default router;
