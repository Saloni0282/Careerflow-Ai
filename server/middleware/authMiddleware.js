import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createHttpError } from './errorMiddleware.js';

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Not authorized', 'Auth Error'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'careerflow-secret');
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return next(createHttpError(401, 'Token invalid', 'Auth Error'));
    }

    next();
  } catch (error) {
    error.statusCode = 401;
    error.context = 'Auth Error';
    error.isOperational = true;
    error.message = 'Token failed';
    next(error);
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'careerflow-secret');
    req.user = await User.findById(decoded.id).select('-password');
  } catch {
    // Ignore invalid or expired tokens for optional authentication.
  }

  next();
};

export default protect;
