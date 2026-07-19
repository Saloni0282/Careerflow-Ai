import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { asyncHandler, createHttpError } from '../middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '..', 'uploads', 'resumes');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'careerflow-secret', {
    expiresIn: '7d'
  });
};

const serializeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  authProvider: user.authProvider,
  role: user.role,
  headline: user.headline,
  location: user.location,
  bio: user.bio,
  resumeUrl: user.resumeUrl,
  resumeFileName: user.resumeFileName,
  resumeUploadedAt: user.resumeUploadedAt
});

const buildResetUrl = (token) => {
  const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  return `${baseUrl}/reset-password?token=${token}`;
};

const sendResetNotification = async (email, url) => {
  console.log(`\n[Password Reset] Send reset link to ${email}: ${url}\n`);
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(400, 'Email already registered', 'Auth Error');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    user: serializeUser(user),
    token: generateToken(user._id)
  });
}, 'Auth Error');

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Invalid credentials', 'Auth Error');
  }

  res.json({
    user: serializeUser(user),
    token: generateToken(user._id)
  });
}, 'Auth Error');

export const googleLogin = asyncHandler(async (req, res) => {
  const credential = req.body?.credential;
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw createHttpError(500, 'Google authentication is not configured', 'Auth Error');
  }

  if (!credential) {
    throw createHttpError(400, 'Google credential is required', 'Auth Error');
  }

  const googleClient = new OAuth2Client(clientId);
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: clientId
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw createHttpError(401, 'Unable to verify Google account', 'Auth Error');
  }

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      name: payload.name || payload.email.split('@')[0],
      email: payload.email,
      avatar: payload.picture || '',
      googleId: payload.sub,
      authProvider: 'google'
    });
  } else {
    user.name = user.name || payload.name || payload.email.split('@')[0];
    user.avatar = payload.picture || user.avatar;
    user.googleId = user.googleId || payload.sub;
    user.authProvider = user.authProvider || 'google';
    await user.save();
  }

  res.json({
    user: serializeUser(user),
    token: generateToken(user._id)
  });
}, 'Auth Error');

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: serializeUser(req.user) });
}, 'Auth Error');

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, headline, location, bio, avatar } = req.body;

  if (!name) {
    throw createHttpError(400, 'Name is required', 'Auth Error');
  }

  const updated = await User.findByIdAndUpdate(
    req.user.id,
    {
      name,
      headline: headline || '',
      location: location || '',
      bio: bio || '',
      avatar: avatar || req.user.avatar
    },
    { new: true }
  );

  res.json({ user: serializeUser(updated) });
}, 'Auth Error');

export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    throw createHttpError(400, 'New password must be at least 8 characters', 'Auth Error');
  }

  const user = await User.findById(req.user.id);

  if (user.password) {
    if (!currentPassword || !(await bcrypt.compare(currentPassword, user.password))) {
      throw createHttpError(401, 'Current password is incorrect', 'Auth Error');
    }
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: 'Password updated successfully' });
}, 'Auth Error');

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, 'Resume file is required', 'Auth Error');
  }

  await fs.mkdir(uploadsPath, { recursive: true });

  const fileName = `${crypto.randomBytes(8).toString('hex')}-${req.file.originalname}`;
  const filePath = path.join(uploadsPath, fileName);
  await fs.writeFile(filePath, req.file.buffer);

  const resumeUrl = `/uploads/resumes/${fileName}`;

  const updated = await User.findByIdAndUpdate(
    req.user.id,
    {
      resumeUrl,
      resumeFileName: req.file.originalname,
      resumeUploadedAt: new Date()
    },
    { new: true }
  );

  res.json({ user: serializeUser(updated) });
}, 'Auth Error');

export const deleteResume = asyncHandler(async (req, res) => {
  if (!req.user.resumeUrl) {
    throw createHttpError(400, 'No saved resume to delete', 'Auth Error');
  }

  const fileName = path.basename(req.user.resumeUrl);
  const filePath = path.join(uploadsPath, fileName);

  await fs.unlink(filePath).catch(() => null);

  const updated = await User.findByIdAndUpdate(
    req.user.id,
    {
      resumeUrl: '',
      resumeFileName: '',
      resumeUploadedAt: undefined
    },
    { new: true }
  );

  res.json({ user: serializeUser(updated) });
}, 'Auth Error');

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: 'If that account exists, a reset link has been sent.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = buildResetUrl(token);
  await sendResetNotification(user.email, resetUrl);

  res.json({ message: 'If that account exists, a reset link has been sent.' });
}, 'Auth Error');

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    throw createHttpError(400, 'Token and new password are required', 'Auth Error');
  }

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw createHttpError(400, 'Invalid or expired reset token', 'Auth Error');
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successfully' });
}, 'Auth Error');
