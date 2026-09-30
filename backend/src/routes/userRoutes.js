import { Router } from 'express';
import { updateProfile, changePassword, changeAvatar } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';
import { passwordChangeLimiter } from '../middleware/rateLimiters.js';

const router = Router();

router.patch('/me', authenticate, updateProfile);
router.post('/me/password', authenticate, passwordChangeLimiter, changePassword);
router.post('/me/avatar', authenticate, uploadAvatar, changeAvatar);

export default router;
