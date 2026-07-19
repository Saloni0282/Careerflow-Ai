import * as geminiService from './geminiService.js';

const buildPrompt = ({ experienceSummary, jobDescription, interviewRound, jobRole }) => `
You are a senior technical interviewer and coach. Based on the candidate's Experience Summary and the Job Description, produce a concise, interview-ready set of questions and short suggested answers tailored to the requested interview round.

Rules:
- Return only a single valid JSON object, with no markdown, no bullet lists, no text before or after the object.
- Do not include any explanatory text or comments outside the JSON.
- Generate a maximum of 8 questions total.
- Suggested answers must be concise and interview-ready: 1-2 short sentences only.
- Avoid long answers, excessive theory, or book-style explanations.
- Include only short arrays for focusAreas and no more than 8 questions.
- Include interviewRound and jobRole in the output.

Output schema:
{
  "interviewRound": "",
  "jobRole": "",
  "questions": [
    {"category":"","question":"","suggestedAnswer":""}
  ],
  "focusAreas": [""],
  "summary": ""
}

Candidate experience summary:
"""
${experienceSummary}
"""

Job description:
"""
${jobDescription}
"""

Target interview round: ${interviewRound || 'General'}
Job role: ${jobRole || ''}
`;

const repairJsonText = (text) => text
  .replace(/,\s*([}\]])/g, '$1')
  .replace(/"\s*\n\s*"/g, '","')
  .replace(/\n\s*[-*]\s*([^"\n\r\]]+)/g, ',"$1"')
  .replace(/,\s*(\])/g, '$1');

// Quote-aware JSON extractor: ignores braces inside strings and handles escapes
const parseJsonFromText = (text) => {
  const s = String(text || '');
  let inString = false;
  let escape = false;
  let depth = 0;
  let start = -1;
  let end = -1;

  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i];

    if (!inString && ch === '{') {
      if (start === -1) start = i;
      depth += 1;
      continue;
    }

    if (!inString && ch === '}') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
      continue;
    }

    if (ch === '"' && !escape) {
      inString = !inString;
    }

    escape = ch === '\\' && !escape;
  }

  if (start === -1 || end === -1) {
    const braceStart = s.indexOf('{');
    const braceEnd = s.lastIndexOf('}');
    if (braceStart === -1 || braceEnd === -1 || braceEnd <= braceStart) {
      throw new Error('Interview generation response did not contain a valid JSON object.');
    }
    const candidate = s.slice(braceStart, braceEnd + 1);
    return JSON.parse(repairJsonText(candidate));
  }

  const raw = s.slice(start, end + 1);
  try {
    return JSON.parse(raw);
  } catch (parseError) {
    return JSON.parse(repairJsonText(raw));
  }
};

export const generateInterviewPrep = async ({ experienceSummary, jobDescription, interviewRound, jobRole }) => {
  const prompt = buildPrompt({ experienceSummary, jobDescription, interviewRound, jobRole });
  const raw = await geminiService.generateAtsAnalysis({ prompt });
  const parsed = parseJsonFromText(raw);

  return {
    interviewRound: parsed.interviewRound || interviewRound || 'General',
    jobRole: parsed.jobRole || jobRole || '',
    questions: Array.isArray(parsed.questions) ? parsed.questions : [],
    focusAreas: Array.isArray(parsed.focusAreas) ? parsed.focusAreas : [],
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    potentialWeakAreas: Array.isArray(parsed.potentialWeakAreas) ? parsed.potentialWeakAreas : [],
    summary: String(parsed.summary || '').trim()
  };
};

export default generateInterviewPrep;
