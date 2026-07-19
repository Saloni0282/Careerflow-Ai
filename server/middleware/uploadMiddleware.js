import multer from 'multer';
import { createHttpError } from './errorMiddleware.js';

const MAX_RESUME_SIZE = 5 * 1024 * 1024;

const storage = multer.memoryStorage();

const resumeFileFilter = (req, file, callback) => {
  const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return callback(createHttpError(400, 'Please upload a valid PDF resume.', 'AI Cover Letter Error'));
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: MAX_RESUME_SIZE,
    files: 1
  }
});

export const uploadResume = (req, res, next) => {
  upload.single('resumePdf')(req, res, (error) => {
    if (!error) {
      return next();
    }

    if (error instanceof multer.MulterError) {
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? 'Resume PDF must be 5MB or smaller.'
        : 'Unable to upload resume PDF.';

      return next(createHttpError(400, message, 'AI Cover Letter Error'));
    }

    error.context = error.context || 'AI Cover Letter Error';
    next(error);
  });
};
