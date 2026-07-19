import express from 'express';
import { getSavedJobs, addSavedJob, removeSavedJob } from '../controllers/savedController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.route('/').get(getSavedJobs).post(addSavedJob);
router.route('/:id').delete(removeSavedJob);

export default router;
