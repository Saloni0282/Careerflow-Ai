import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    logo: { type: String, default: '' },
    category: { type: String, default: '' },
    location: { type: String, default: 'Remote' },
    workMode: { type: String, enum: ['Remote', 'Onsite', 'Hybrid'], default: 'Remote' },
    experienceLevel: { type: String, enum: ['Internship', 'Entry', 'Junior', 'Mid', 'Senior', 'Lead'], default: 'Mid' },
    employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'], default: 'Full-time' },
    salary: { type: String, default: 'Competitive' },
    source: {
      type: String,
      enum: ['LinkedIn', 'Naukri', 'Indeed', 'Company Website', 'Referral', 'Other'],
      default: 'Other'
    },
    jobUrl: { type: String, default: '' },
    appliedDate: { type: Date, default: Date.now },
    applicationStatus: {
      type: String,
      enum: ['Applied', 'Interview Scheduled', 'Interviewing', 'Rejected', 'Offer Received', 'Joined', 'Withdrawn'],
      default: 'Applied'
    },
    notes: { type: String, default: '' },
    skills: { type: [String], default: [] },
    postedDate: { type: Date, default: Date.now },
    description: { type: String, default: '' },
    responsibilities: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);
export default Job;
