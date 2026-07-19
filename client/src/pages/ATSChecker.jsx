import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { atsService } from '../services/atsService';
import styles from './ATSChecker.module.css';

const MIN_JD_LENGTH = 40;
const MAX_JD_LENGTH = 12000;
const MAX_PDF_SIZE = 5 * 1024 * 1024;

const analysisOptions = [
  { value: 'resume-only', label: 'Resume Only Analysis', description: 'Scan your resume for ATS readiness and optimization opportunities.' },
  { value: 'resume+jd', label: 'Resume + Job Description Analysis', description: 'Compare your resume to a specific job description for a match score.' }
];

const ATSChecker = () => {
  const { user, token } = useAuth();
  const [analysisMode, setAnalysisMode] = useState('resume-only');
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [useSavedResume, setUseSavedResume] = useState(!!user?.resumeUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleResumeUpload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    setError('');

    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF resume file.');
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      setError('Resume PDF must be 5MB or smaller.');
      return;
    }

    setResumeFile(file);
    setUseSavedResume(false);
  };

  const removeResumeFile = () => {
    setResumeFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResult(null);

    if (!resumeFile && !(useSavedResume && user?.resumeUrl)) {
      setError('Provide your resume using a PDF upload or use your saved resume.');
      return;
    }

    if (analysisMode === 'resume+jd' && jobDescription.trim().length < MIN_JD_LENGTH) {
      setError('Add more details from the job description before running a match analysis.');
      return;
    }

    if (jobDescription.trim().length > MAX_JD_LENGTH) {
      setError(`Job description must be ${MAX_JD_LENGTH.toLocaleString()} characters or less.`);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('analysisType', analysisMode);

      if (resumeFile) {
        formData.append('resumePdf', resumeFile);
      }

      if (useSavedResume && !resumeFile) {
        formData.append('useSavedResume', 'true');
      }

      const response = await atsService.analyzeResume(formData, token);
      setResult(response.data);
    } catch (err) {
      setError(err.message || 'Unable to analyze the resume right now.');
    } finally {
      setLoading(false);
    }
  };

  const hasResumeInput = Boolean(resumeFile || (useSavedResume && user?.resumeUrl));

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>ATS Resume Checker</p>
        <h1>Analyze your resume for ATS compatibility and job match strength.</h1>
        <p>
          Upload your resume PDF or use your stored profile resume, then compare it against a job description
          for practical hiring feedback.
        </p>
      </div>

      <form className={styles.workspace} onSubmit={handleSubmit}>
        <div className={styles.inputPanel}>
          <div className={styles.sectionHeader}>
            <div>
              <h2>Analysis workflow</h2>
              <p>Select the mode that fits your current application stage.</p>
            </div>
          </div>

          <div className={styles.modeGrid}>
            {analysisOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`${styles.modeOption} ${analysisMode === option.value ? styles.activeMode : ''}`}
                onClick={() => setAnalysisMode(option.value)}
              >
                <span>{option.label}</span>
                <p>{option.description}</p>
              </button>
            ))}
          </div>

          <div className={styles.sectionHeader}>
            <div>
              <h2>Resume source</h2>
              <p>Choose one resume input method to keep the analysis focused and accurate.</p>
            </div>
          </div>

          <div className={styles.uploadGrid}>
            <label className={styles.uploadCard} htmlFor="resumePdf">
              <strong>Upload PDF</strong>
              <span>Choose a resume file from your computer.</span>
              <input id="resumePdf" type="file" accept="application/pdf" onChange={handleResumeUpload} disabled={loading} />
            </label>

              {user?.resumeUrl && (
              <label className={styles.savedCard}>
                <div className={styles.savedRow}>
                  <div>
                    <strong>Use stored resume</strong>
                    <p>{user.resumeFileName || 'Resume uploaded to your profile'}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={useSavedResume && !resumeFile}
                    onChange={(event) => {
                      setUseSavedResume(event.target.checked);
                      if (event.target.checked) {
                        setResumeFile(null);
                      }
                    }}
                    disabled={loading}
                  />
                </div>
              </label>
            )}
          </div>

          {resumeFile && (
            <div className={styles.filePreview}>
              <div>
                <strong>{resumeFile.name}</strong>
                <span>{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <button type="button" className={styles.clearButton} onClick={removeResumeFile} disabled={loading}>
                Remove file
              </button>
            </div>
          )}

          <div className={styles.sectionHeader}>
            <div>
              <h2>Job description</h2>
              <p>
                Paste the full job description only if you want a matching score and gap analysis. This is optional for resume-only reviews.
              </p>
            </div>
          </div>

          <textarea
            className={styles.textarea}
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the job description here when using Resume + Job Description Analysis."
            rows={8}
            disabled={loading}
          />

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.primaryButton} disabled={loading || !hasResumeInput}>
            {loading ? 'Analyzing resume…' : 'Run ATS analysis'}
          </button>
        </div>

        <div className={styles.resultPanel}>
          <div className={styles.resultHeader}>
            <h2>ATS result dashboard</h2>
            <p>
              Your analysis results appear here after the tool finishes. If you have not submitted any resume yet,
              the dashboard will provide guidance on the next step.
            </p>
          </div>

          {!result ? (
            <div className={styles.emptyState}>
              <p>No analysis has been run yet.</p>
              <p>Upload your resume PDF or use your saved resume to begin.</p>
            </div>
          ) : (
            <>
              <div className={styles.scoreGrid}>
                <article className={styles.scoreCard}>
                  <div className={styles.scoreLabel}>ATS Score</div>
                  <div className={styles.scoreValue}>{result.atsScore}%</div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${result.atsScore}%` }} />
                  </div>
                </article>
                {result.matchScore !== null && (
                  <article className={styles.scoreCard}>
                    <div className={styles.scoreLabel}>Match Score</div>
                    <div className={styles.scoreValue}>{result.matchScore}%</div>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${result.matchScore}%` }} />
                    </div>
                  </article>
                )}
              </div>

              <div className={styles.insightGrid}>
                <article className={styles.insightCard}>
                  <h3>Strengths</h3>
                  {result.resumeStrengths.length ? (
                    <ul>
                      {result.resumeStrengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No strengths were identified. Try highlighting more relevant achievements.</p>
                  )}
                </article>

                <article className={styles.insightCard}>
                  <h3>Weaknesses</h3>
                  {result.resumeWeaknesses.length ? (
                    <ul>
                      {result.resumeWeaknesses.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Your resume appears strong in the scanned areas.</p>
                  )}
                </article>
              </div>

              {result.matchedSkills.length > 0 && (
                <section className={styles.matchSection}>
                  <h3>Matched Skills</h3>
                  <div className={styles.tagGrid}>
                    {result.matchedSkills.map((skill) => (
                      <span key={skill} className={styles.tag}>{skill}</span>
                    ))}
                  </div>
                </section>
              )}

              {result.missingSkills.length > 0 && (
                <section className={styles.matchSection}>
                  <h3>Missing Skills</h3>
                  <div className={styles.tagGrid}>
                    {result.missingSkills.map((skill) => (
                      <span key={skill} className={styles.missingTag}>{skill}</span>
                    ))}
                  </div>
                </section>
              )}

              {result.missingSections.length > 0 && (
                <section className={styles.matchSection}>
                  <h3>Missing Sections</h3>
                  <ul>
                    {result.missingSections.map((section) => (
                      <li key={section}>{section}</li>
                    ))}
                  </ul>
                </section>
              )}

              {result.improvementSuggestions.length > 0 && (
                <section className={styles.matchSection}>
                  <h3>Recommendations</h3>
                  <ul>
                    {result.improvementSuggestions.map((suggestion) => (
                      <li key={suggestion}>{suggestion}</li>
                    ))}
                  </ul>
                </section>
              )}

              {result.keywordMatchAnalysis && (
                <section className={styles.matchSection}>
                  <h3>Keyword analysis</h3>
                  <p>{result.keywordMatchAnalysis}</p>
                </section>
              )}
            </>
          )}
        </div>
      </form>
    </section>
  );
};

export default ATSChecker;
