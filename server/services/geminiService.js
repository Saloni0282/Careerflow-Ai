import axios from 'axios';

const DEFAULT_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

const buildCoverLetterPrompt = ({ resumeText, jobDescription }) => `
You are an expert career strategist and ATS-friendly cover letter writer.

Use the candidate resume and job description to write a highly personalized cover letter.

Personalization strategy:
- Identify the target role, company, responsibilities, required skills, and preferred technologies from the job description.
- Analyze the candidate resume for experience, projects, skills, tools, education, domain exposure, and career background.
- Prioritize only resume evidence that matches the job requirements.
- Mention matching technologies, responsibilities, and relevant projects when present in the resume.
- If the resume lacks a requirement, do not invent experience. Emphasize transferable strengths honestly.
- Make the letter sound human, specific, confident, and professional, not like a generic AI template.
- Avoid generic phrases like "I am uniquely qualified" unless backed by resume evidence.
- Do not include placeholders, fake metrics, addresses, phone numbers, dates, or unverifiable claims.
- Use concrete nouns from the resume and JD: technologies, project names, job titles, domains, responsibilities, and tools.
- If a candidate project aligns with the JD, briefly connect that project to the employer's need.

Output requirements:
- Return only the finished cover letter text.
- Keep it concise and point to point: 220-300 words total.
- Write exactly 4 short paragraphs after the greeting.
- Each paragraph must be 2-3 sentences maximum.
- Paragraph 1: role/company fit using the JD.
- Paragraph 2: strongest matching skills and technologies from the resume.
- Paragraph 3: one relevant project or experience match, if available.
- Paragraph 4: motivation, value to the team, and confident closing.
- If the hiring manager name is unavailable, use "Dear Hiring Manager,".
- If the company name is unclear, refer to "your team" naturally.
- Do not apologize, mention missing information, or explain your process.
- Do not add long storytelling, repeated skills, bullet points, markdown headings, or extra sections.

Candidate resume:
"""${resumeText}"""

Job description:
"""${jobDescription}"""
`;

const extractText = (data) => {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) {
    return '';
  }
  console.log("Parts",parts)

  return parts
    .map((part) => part.text)
    .filter(Boolean)
    .join('\n')
    .trim();
};

export const generateCoverLetter = async ({ resumeText, jobDescription }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    const error = new Error('Gemini API key is not configured');
    error.statusCode = 500;
    error.context = 'AI Cover Letter Error';
    error.isOperational = true;
    throw error;
  }

  try {
    const response = await axios.post(
      `${GEMINI_BASE_URL}/${model}:generateContent`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: buildCoverLetterPrompt({ resumeText, jobDescription }) }]
          }
        ],
        generationConfig: {
          temperature: 0.55,
          topP: 0.85,
          maxOutputTokens: 2000
        }
      },
      {
        headers: {
          'x-goog-api-key': apiKey
        },
        timeout: 30000
      }
    );

    const coverLetter = extractText(response.data);

    if (!coverLetter) {
      const error = new Error('Gemini returned an empty response');
      error.statusCode = 502;
      error.context = 'AI Cover Letter Error';
      error.isOperational = true;
      throw error;
    }

    return {
      coverLetter,
      model
    };
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    const geminiMessage = error.response?.data?.error?.message;
    const serviceError = new Error(
      geminiMessage || 'Unable to generate cover letter right now. Please try again.'
    );
    serviceError.statusCode = error.response?.status || 502;
    serviceError.context = 'AI Cover Letter Error';
    serviceError.isOperational = true;
    serviceError.cause = error;
    throw serviceError;
  }
};

export const generateAtsAnalysis = async ({ prompt }) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;

  if (!apiKey) {
    const error = new Error('Gemini API key is not configured');
    error.statusCode = 500;
    error.context = 'AI ATS Error';
    error.isOperational = true;
    throw error;
  }

  try {
    const response = await axios.post(
      `${GEMINI_BASE_URL}/${model}:generateContent`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topP: 0.8,
          maxOutputTokens: 5000
        }
      },
      {
        headers: {
          'x-goog-api-key': apiKey
        },
        timeout: 30000
      }
    );

    const resultText = extractText(response.data);
    console.log("ATS gemini",response.data)

    if (!resultText) {
      const error = new Error('Gemini returned an empty ATS response');
      error.statusCode = 502;
      error.context = 'AI ATS Error';
      error.isOperational = true;
      throw error;
    }

    return resultText;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }

    const geminiMessage = error.response?.data?.error?.message;
    const serviceError = new Error(
      geminiMessage || 'Unable to analyze resume right now. Please try again.'
    );
    serviceError.statusCode = error.response?.status || 502;
    serviceError.context = 'AI ATS Error';
    serviceError.isOperational = true;
    serviceError.cause = error;
    throw serviceError;
  }
};
