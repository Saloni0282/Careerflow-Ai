import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: { type: String, default: '' },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId: { type: String, default: '' },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },

    headline: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    resumeFileName: { type: String, default: '' },
    resumeUploadedAt: { type: Date },

    resetPasswordToken: { type: String, default: '' },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
