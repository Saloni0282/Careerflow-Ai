import * as applicationService from '../services/applicationService.js';
import { asyncHandler, createHttpError } from '../middleware/errorMiddleware.js';

export const getUserApplications = asyncHandler(async (req, res) => {
  const applications = await applicationService.getApplicationsByUser(req.user.id);
  res.json(applications);
}, 'Application Tracker Error');

export const applyForJob = asyncHandler(async (req, res) => {
  const application = await applicationService.createApplication({
    userId: req.user.id,
    jobId: req.body.jobId
  });
  res.status(201).json(application);
}, 'Application Tracker Error');

export const updateApplication = asyncHandler(async (req, res) => {
  const payload = {
    applicationStatus: req.body.applicationStatus,
    notes: req.body.notes,
    interviewFeedback: req.body.interviewFeedback,
    recruiterFeedback: req.body.recruiterFeedback,
    nextSteps: req.body.nextSteps
  };

  const updated = await applicationService.updateApplication(
    req.params.id,
    req.user.id,
    payload
  );

  if (!updated) {
    throw createHttpError(404, 'Application not found', 'Application Tracker Error');
  }

  res.json(updated);
}, 'Application Tracker Error');

export const deleteApplication = asyncHandler(async (req, res) => {
  const deleted = await applicationService.deleteApplication(req.params.id, req.user.id);

  if (!deleted) {
    throw createHttpError(404, 'Application not found', 'Application Tracker Error');
  }

  res.json({ message: 'Application removed' });
}, 'Application Tracker Error');
