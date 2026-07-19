import Application from '../models/Application.js';

export const getApplicationsByUser = async (userId) => {
  return Application.find({ userId }).populate('jobId').sort({ appliedDate: -1 });
};

export const createApplication = async ({ userId, jobId }) => {
  const existing = await Application.findOne({ userId, jobId });
  if (existing) {
    return existing.populate('jobId');
  }

  const created = await Application.create({ userId, jobId });
  return Application.findById(created._id).populate('jobId');
};

export const updateApplicationStatus = async (applicationId, userId, status) => {
  return Application.findOneAndUpdate(
    { _id: applicationId, userId },
    { $set: status },
    { new: true }
  ).populate('jobId');
};

export const updateApplication = async (applicationId, userId, payload) => {
  // payload may contain applicationStatus, notes, interviewFeedback, recruiterFeedback, nextSteps
  return Application.findOneAndUpdate(
    { _id: applicationId, userId },
    { $set: payload },
    { new: true }
  ).populate('jobId');
};

export const deleteApplication = async (applicationId, userId) => {
  return Application.findOneAndDelete({ _id: applicationId, userId });
};
