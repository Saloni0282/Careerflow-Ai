import SavedJob from '../models/SavedJob.js';
import { asyncHandler, createHttpError } from '../middleware/errorMiddleware.js';

export const getSavedJobs = asyncHandler(async (req, res) => {
  const savedJobs = await SavedJob.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(savedJobs);
}, 'Saved Jobs Error');

export const addSavedJob = asyncHandler(async (req, res) => {
  const { jobId, title, company, status, location, notes } = req.body;
  const existing = await SavedJob.findOne({ jobId, user: req.user.id });

  if (existing) {
    throw createHttpError(400, 'Job already saved', 'Saved Jobs Error');
  }

  const savedJob = await SavedJob.create({
    jobId,
    title,
    company,
    status,
    location,
    notes,
    user: req.user.id
  });

  res.status(201).json(savedJob);
}, 'Saved Jobs Error');

export const removeSavedJob = asyncHandler(async (req, res) => {
  const removed = await SavedJob.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!removed) {
    throw createHttpError(404, 'Saved job not found', 'Saved Jobs Error');
  }

  res.json({ message: 'Saved job removed' });
}, 'Saved Jobs Error');
