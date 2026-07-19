import { createHttpError } from './errorMiddleware.js';

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(createHttpError(403, 'Forbidden', 'Auth Error'));
  }

  next();
};

export default authorize;
