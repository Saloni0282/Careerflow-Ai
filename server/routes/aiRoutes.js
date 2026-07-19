import express from 'express';
import protect, { optionalAuth } from '../middleware/authMiddleware.js';
import {
  analyzeResumeAts,
  generateCoverLetter,
  generateCoverLetterFromSavedResume
} from '../controllers/aiController.js';
import { generateInterviewPrep } from '../controllers/aiController.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/cover-letter', uploadResume, generateCoverLetter);
router.post('/cover-letter/saved', protect, generateCoverLetterFromSavedResume);
router.post('/ats-checker', optionalAuth, uploadResume, analyzeResumeAts);
router.post('/interview-prep', optionalAuth, generateInterviewPrep);

export default router;
