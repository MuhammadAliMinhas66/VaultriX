import { Router } from 'express';
import { updateProfile, changePassword, changeAvatar } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';

const router = Router();

router.patch('/me', authenticate, updateProfile);
router.post('/me/password', authenticate, changePassword);
router.post('/me/avatar', authenticate, uploadAvatar, changeAvatar);

export default router;
