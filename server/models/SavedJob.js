import mongoose from 'mongoose';

const savedJobSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    status: { type: String, default: 'open' },
    location: { type: String },
    notes: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

const SavedJob = mongoose.models.SavedJob || mongoose.model('SavedJob', savedJobSchema);
export default SavedJob;
