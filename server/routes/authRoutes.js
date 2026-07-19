import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { uploadResume as resumeUpload } from '../middleware/uploadMiddleware.js';
import {
  googleLogin,
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  updatePassword,
  uploadResume,
  deleteResume,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/profile/password', protect, updatePassword);
router.post('/profile/resume', protect, resumeUpload, uploadResume);
router.delete('/profile/resume', protect, deleteResume);

export default router;
