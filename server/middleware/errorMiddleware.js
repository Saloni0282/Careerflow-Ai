const isDevelopment = () => process.env.NODE_ENV !== 'production';

export const createHttpError = (statusCode, message, context = 'Server Error', options = {}) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.context = context;
  error.isOperational = options.isOperational ?? true;
  return error;
};

export const asyncHandler = (handler, context = 'Async Route Error') => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    error.context = error.context || context;
    next(error);
  }
};

const getStatusCode = (error, res) => {
  if (error.statusCode) {
    return error.statusCode;
  }

  if (res.statusCode && res.statusCode !== 200) {
    return res.statusCode;
  }

  if (error.name === 'ValidationError') {
    return 400;
  }

  if (error.name === 'CastError') {
    return 400;
  }

  if (error.code === 11000) {
    return 409;
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return 401;
  }

  return 500;
};

const getProductionMessage = (error, statusCode) => {
  if (error.isOperational && error.message) {
    return error.message;
  }

  if (statusCode >= 400 && statusCode < 500) {
    return 'Invalid request';
  }

  return 'Something went wrong';
};

export const errorMiddleware = (error, req, res, next) => {
  const statusCode = getStatusCode(error, res);
  const context = error.context || 'Server Error';

  console.error(`[${context}]`, {
    message: error.message,
    statusCode,
    method: req.method,
    path: req.originalUrl,
    params: req.params,
    query: req.query,
    stack: error.stack,
    error
  });

  const message = isDevelopment()
    ? error.message || 'Server error'
    : getProductionMessage(error, statusCode);

  res.status(statusCode).json({
    success: false,
    message
  });
};

export default errorMiddleware;
