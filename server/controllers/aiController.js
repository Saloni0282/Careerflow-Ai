import * as geminiService from '../services/geminiService.js';
import * as atsService from '../services/atsService.js';
import * as interviewService from '../services/interviewService.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { asyncHandler, createHttpError } from '../middleware/errorMiddleware.js';
import { parseResumePdf } from '../utils/pdfParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '..', 'uploads', 'resumes');

const MIN_JD_LENGTH = 40;
const MAX_JD_LENGTH = 12000;
const MIN_RESUME_LENGTH = 80;
const MIN_PDF_RESUME_LENGTH = 180;
const MAX_RESUME_LENGTH = 20000;

export const generateCoverLetter = asyncHandler(async (req, res) => {
  const jobDescription = String(req.body?.jobDescription || '').trim();
  let resumeText = '';
  const resumeSource = req.file ? 'pdf' : 'saved resume';

  if (!jobDescription) {
    throw createHttpError(400, 'Please paste a job description before generating.', 'AI Cover Letter Error');
  }

  if (jobDescription.length < MIN_JD_LENGTH) {
    throw createHttpError(400, 'Please add more job details for a useful cover letter.', 'AI Cover Letter Error');
  }

  if (jobDescription.length > MAX_JD_LENGTH) {
    throw createHttpError(400, `Job description must be ${MAX_JD_LENGTH} characters or less.`, 'AI Cover Letter Error');
  }

  if (!req.file) {
    if (!req.is('multipart/form-data')) {
      throw createHttpError(
        400,
        'Resume upload was not sent as multipart form data. Please refresh the page and try uploading again.',
        'AI Cover Letter Error'
      );
    }

    throw createHttpError(400, 'Please upload your resume PDF or use your saved resume.', 'AI Cover Letter Error');
  }

  resumeText = await parseResumePdf(req.file.buffer);

  if (resumeText.length < MIN_PDF_RESUME_LENGTH) {
    throw createHttpError(
      400,
      'The uploaded PDF did not contain enough readable resume text. Please upload a text-based resume PDF.',
      'AI Cover Letter Error'
    );
  }

  if (resumeText.length < MIN_RESUME_LENGTH) {
    throw createHttpError(400, 'Please provide more resume details so the AI can personalize the letter.', 'AI Cover Letter Error');
  }

  if (resumeText.length > MAX_RESUME_LENGTH) {
    resumeText = resumeText.slice(0, MAX_RESUME_LENGTH);
  }

  const result = await geminiService.generateCoverLetter({
    resumeText,
    jobDescription
  });

  res.status(200).json({
    success: true,
    data: {
      coverLetter: result.coverLetter,
      model: result.model,
      resumeSource,
      generatedAt: new Date().toISOString()
    }
  });
}, 'AI Cover Letter Error');

export const generateCoverLetterFromSavedResume = asyncHandler(async (req, res) => {
  const jobDescription = String(req.body?.jobDescription || '').trim();

  if (!jobDescription) {
    throw createHttpError(400, 'Please paste a job description before generating.', 'AI Cover Letter Error');
  }

  if (jobDescription.length < MIN_JD_LENGTH) {
    throw createHttpError(400, 'Please add more job details for a useful cover letter.', 'AI Cover Letter Error');
  }

  if (jobDescription.length > MAX_JD_LENGTH) {
    throw createHttpError(400, `Job description must be ${MAX_JD_LENGTH} characters or less.`, 'AI Cover Letter Error');
  }

  if (!req.user?.resumeUrl) {
    throw createHttpError(400, 'No saved resume found. Please upload a resume to your profile first.', 'AI Cover Letter Error');
  }

  const fileName = path.basename(req.user.resumeUrl);
  const filePath = path.join(uploadsPath, fileName);
  const pdfBuffer = await fs.readFile(filePath);
  let resumeText = await parseResumePdf(pdfBuffer);

  if (resumeText.length < MIN_PDF_RESUME_LENGTH) {
    throw createHttpError(
      400,
      'The saved resume did not contain enough readable text. Please upload a text-based resume PDF.',
      'AI Cover Letter Error'
    );
  }

  if (resumeText.length < MIN_RESUME_LENGTH) {
    throw createHttpError(400, 'Please provide more resume details so the AI can personalize the letter.', 'AI Cover Letter Error');
  }

  if (resumeText.length > MAX_RESUME_LENGTH) {
    resumeText = resumeText.slice(0, MAX_RESUME_LENGTH);
  }

  const result = await geminiService.generateCoverLetter({
    resumeText,
    jobDescription
  });

  res.status(200).json({
    success: true,
    data: {
      coverLetter: result.coverLetter,
      model: result.model,
      resumeSource: 'saved resume',
      generatedAt: new Date().toISOString()
    }
  });
}, 'AI Cover Letter Error');

export const analyzeResumeAts = asyncHandler(async (req, res) => {
  const jobDescription = String(req.body?.jobDescription || '').trim();
  const useSavedResume = String(req.body?.useSavedResume || '').toLowerCase() === 'true';
  const analysisType = jobDescription ? 'resume+jd' : 'resume-only';

  const MIN_JD_LENGTH = 40;
  const MAX_JD_LENGTH = 12000;
  const MIN_RESUME_LENGTH = 80;
  const MIN_PDF_RESUME_LENGTH = 180;
  const MAX_RESUME_LENGTH = 20000;

  if (analysisType === 'resume+jd' && jobDescription.length < MIN_JD_LENGTH) {
    throw createHttpError(400, 'Please add more job details for a meaningful ATS match.', 'AI ATS Error');
  }

  if (jobDescription.length > MAX_JD_LENGTH) {
    throw createHttpError(400, `Job description must be ${MAX_JD_LENGTH} characters or less.`, 'AI ATS Error');
  }

  let resumeText = '';
  let resumeSource = '';

  if (req.file) {
    resumeText = await parseResumePdf(req.file.buffer);
    resumeSource = 'uploaded resume';
  } else if (useSavedResume || req.user?.resumeUrl) {
    if (!req.user?.resumeUrl) {
      throw createHttpError(400, 'No saved resume found. Upload a resume to your profile first.', 'AI ATS Error');
    }

    const fileName = path.basename(req.user.resumeUrl);
    const filePath = path.join(uploadsPath, fileName);
    const pdfBuffer = await fs.readFile(filePath);
    resumeText = await parseResumePdf(pdfBuffer);
    resumeSource = 'saved resume';
  }

  if (!resumeText) {
    throw createHttpError(400, 'Please upload a resume PDF or use a stored resume.', 'AI ATS Error');
  }

  if (resumeText.length < MIN_RESUME_LENGTH) {
    throw createHttpError(400, 'Please provide more resume details so the AI can analyze your resume accurately.', 'AI ATS Error');
  }

  if (resumeText.length < MIN_PDF_RESUME_LENGTH && (req.file || resumeSource === 'saved resume')) {
    throw createHttpError(
      400,
      'The uploaded or saved resume did not contain enough readable text. Please use a text-based PDF resume.',
      'AI ATS Error'
    );
  }

  if (resumeText.length > MAX_RESUME_LENGTH) {
    resumeText = resumeText.slice(0, MAX_RESUME_LENGTH);
  }

  const result = await atsService.analyzeResume({ resumeText, jobDescription });

  res.status(200).json({
    success: true,
    data: {
      ...result,
      analysisType,
      resumeSource,
      jobDescription: analysisType === 'resume+jd' ? jobDescription : undefined,
      analyzedAt: new Date().toISOString()
    }
  });
}, 'AI ATS Error');

export const generateInterviewPrep = asyncHandler(async (req, res) => {
  const experienceSummary = String(req.body?.experienceSummary || '').trim();
  const jobDescription = String(req.body?.jobDescription || '').trim();
  const interviewRound = String(req.body?.interviewRound || '').trim();
  const jobRole = String(req.body?.jobRole || '').trim();

  if (!experienceSummary) {
    throw createHttpError(400, 'Please provide an experience summary.', 'AI Interview Prep Error');
  }

  if (!jobDescription) {
    throw createHttpError(400, 'Please paste the job description to generate interview questions.', 'AI Interview Prep Error');
  }

  const result = await interviewService.generateInterviewPrep({ experienceSummary, jobDescription, interviewRound, jobRole });

  res.status(200).json({
    success: true,
    data: {
      ...result,
      generatedAt: new Date().toISOString()
    }
  });
}, 'AI Interview Prep Error');
