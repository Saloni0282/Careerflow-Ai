import * as geminiService from './geminiService.js';

const buildResumeOnlyPrompt = (resumeText) => `
You are a senior career advisor and ATS resume analyst.

Analyze the candidate resume for ATS friendliness and practical hiring fit.

Focus on:
- resume structure and formatting
- keyword coverage for technical and role-specific skills
- career story clarity and section completeness
- ATS compatibility and readability
- strengths, weaknesses, and actionable improvements

Return only a valid JSON object with the following keys:
- atsScore (integer 0-100)
- resumeStrengths (array of short strings)
- resumeWeaknesses (array of short strings)
- improvementSuggestions (array of short strings)
- recommendedSkills (array of short strings)
- missingSections (array of short strings)
- keywordMatchAnalysis (string)
- analysisType (string)

The JSON value must be parseable and contain no markdown formatting, code fences, or extra explanation.
Use plain text only inside string values and do not include braces or backticks outside of JSON syntax.

Candidate resume text:
"""
${resumeText}
"""
`;

const buildResumeWithJobPrompt = (resumeText, jobDescription) => `
You are a senior career advisor and ATS matching analyst.

Compare the candidate resume against the target job description.

Provide:
- ATS match score for this resume against the JD
- matched skills and technologies
- missing skills and keyword gaps
- resume gaps relative to the role
- actionable recommendations and formatting feedback
- a clear summary of why the resume is a strong or weak match

Return only a valid JSON object with the following keys:
- atsScore (integer 0-100)
- matchScore (integer 0-100)
- matchedSkills (array of short strings)
- missingSkills (array of short strings)
- resumeGaps (array of short strings)
- improvementSuggestions (array of short strings)
- recommendedSkills (array of short strings)
- missingSections (array of short strings)
- keywordMatchAnalysis (string)
- resumeStrengths (array of short strings)
- resumeWeaknesses (array of short strings)
- analysisType (string)

The JSON value must be parseable and contain no markdown formatting, code fences, or extra explanation.
Use plain text only inside string values and do not include braces or backticks outside of JSON syntax.

Candidate resume text:
"""
${resumeText}
"""

Target job description:
"""
${jobDescription}
"""
`;

const stripCodeFences = (value) =>
  String(value || '')
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, ''))
    .trim();

const extractJsonObject = (responseText) => {
  const text = stripCodeFences(responseText);
  const firstBrace = text.indexOf('{');
  if (firstBrace === -1) {
    throw new Error('ATS analysis response was not a valid JSON object.');
  }

  const candidate = text.slice(firstBrace);

  const tryParse = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const directParse = tryParse(candidate);
  if (directParse) return directParse;

  let inString = false;
  let escape = false;
  let depth = 0;
  let end = -1;

  for (let i = 0; i < candidate.length; i += 1) {
    const char = candidate[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === '\\') {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === '{') {
      depth += 1;
    }

    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) {
    throw new Error('ATS analysis response was not a valid JSON object.');
  }

  const rawJson = candidate.slice(0, end + 1).replace(/,\s*([}\]])/g, '$1');

  const parsed = tryParse(rawJson);
  if (!parsed) {
    throw new Error('ATS analysis response was not a valid JSON object.');
  }

  return parsed;
};

const normalizeArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((item) => Boolean(item)).map((item) => String(item).trim());
  if (typeof value === 'string') {
    return value
      .split(/[\n\r]+|•|\u2022|\-|\*|;/)
      .map((item) => item.trim())
      .filter((item) => item);
  }
  return [];
};

const normalizeAtsResult = (raw) => ({
  analysisType: String(raw.analysisType || 'resume-only'),
  atsScore: Number.isFinite(Number(raw.atsScore)) ? Number(raw.atsScore) : 0,
  matchScore: Number.isFinite(Number(raw.matchScore)) ? Number(raw.matchScore) : null,
  resumeStrengths: normalizeArray(raw.resumeStrengths),
  resumeWeaknesses: normalizeArray(raw.resumeWeaknesses),
  improvementSuggestions: normalizeArray(raw.improvementSuggestions),
  recommendedSkills: normalizeArray(raw.recommendedSkills),
  missingSections: normalizeArray(raw.missingSections),
  matchedSkills: normalizeArray(raw.matchedSkills),
  missingSkills: normalizeArray(raw.missingSkills),
  resumeGaps: normalizeArray(raw.resumeGaps),
  keywordMatchAnalysis: String(raw.keywordMatchAnalysis || raw.keywordGapAnalysis || '').trim()
});

export const analyzeResume = async ({ resumeText, jobDescription }) => {
  const prompt = jobDescription
    ? buildResumeWithJobPrompt(resumeText, jobDescription)
    : buildResumeOnlyPrompt(resumeText);

  const rawText = await geminiService.generateAtsAnalysis({ prompt });
  const parsed = extractJsonObject(rawText);

  return normalizeAtsResult({
    ...parsed,
    analysisType: jobDescription ? 'resume+jd' : 'resume-only'
  });
};
