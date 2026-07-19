import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    appliedDate: { type: Date, default: Date.now },
    applicationStatus: {
      type: String,
      enum: ['Applied', 'Interview Scheduled', 'Interviewing', 'Rejected', 'Offer Received', 'Joined', 'Withdrawn'],
      default: 'Applied'
    },
    notes: { type: String, default: '' },
    interviewFeedback: { type: String, default: '' },
    recruiterFeedback: { type: String, default: '' },
    nextSteps: { type: String, default: '' }
  },
  { timestamps: true }
);

const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
export default Application;
