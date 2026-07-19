import { useMemo, useState } from 'react';
import { aiService } from '../services/aiService';
import styles from './CoverLetterGenerator.module.css';

const MAX_JD_LENGTH = 12000;
const MIN_JD_LENGTH = 40;
const MAX_PDF_SIZE = 5 * 1024 * 1024;

const CoverLetterGenerator = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumePdf, setResumePdf] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [generatedAt, setGeneratedAt] = useState('');

  const remainingCharacters = MAX_JD_LENGTH - jobDescription.length;
  const canGenerate = useMemo(
    () => jobDescription.trim().length >= MIN_JD_LENGTH && Boolean(resumePdf) && !loading,
    [jobDescription, resumePdf, loading]
  );

  const handleResumeFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload your resume as a PDF file.');
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      setError('Resume PDF must be 5MB or smaller.');
      return;
    }

    setResumePdf(file);
    setError('');
  };

  const removeResumePdf = () => {
    setResumePdf(null);
  };

  const generate = async () => {
    const trimmedDescription = jobDescription.trim();

    if (!trimmedDescription) {
      setError('Paste a job description before generating your cover letter.');
      return;
    }

    if (trimmedDescription.length < MIN_JD_LENGTH) {
      setError('Add a little more detail from the job post so the AI can personalize the letter.');
      return;
    }

    if (trimmedDescription.length > MAX_JD_LENGTH) {
      setError(`Keep the job description under ${MAX_JD_LENGTH.toLocaleString()} characters.`);
      return;
    }

    if (!resumePdf) {
      setError('Upload your resume PDF before generating.');
      return;
    }

    setLoading(true);
    setError('');
    setCopied(false);

    try {
      const response = await aiService.generateCoverLetter({
        jobDescription: trimmedDescription,
        resumePdf
      });
      const result = response?.data?.coverLetter;

      if (!result) {
        throw new Error('The AI response was empty. Please try again.');
      }

      setCoverLetter(result);
      setGeneratedAt(response.data.generatedAt || new Date().toISOString());
    } catch (err) {
      setError(err.message || 'Unable to generate a cover letter right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!coverLetter) {
      return;
    }

    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError('Copy failed. Please select the letter text and copy it manually.');
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <p className={styles.eyebrow}>AI Cover Letter Generator</p>
        <h1>Create a personalized cover letter from your resume and a job description</h1>
        <p>
          Upload your resume PDF, then add the job description. CareerFlow AI will align your
          skills, projects, and experience with the role.
        </p>
      </div>

      <div className={styles.workspace}>
        <form className={styles.inputPanel} onSubmit={(event) => { event.preventDefault(); generate(); }}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Resume</h2>
              <p>Upload the resume PDF you want the AI to personalize from.</p>
            </div>
          </div>

          <div className={styles.uploadBox}>
            <input
              id="resumePdf"
              type="file"
              accept="application/pdf,.pdf"
              className={styles.fileInput}
              onChange={handleResumeFile}
              disabled={loading}
            />
            <label htmlFor="resumePdf" className={styles.uploadLabel}>
              <span className={styles.uploadTitle}>Upload resume PDF</span>
              <span className={styles.uploadHint}>PDF only, up to 5MB</span>
            </label>
          </div>

          {resumePdf && (
            <div className={styles.filePreview}>
              <div>
                <strong>{resumePdf.name}</strong>
                <span>{(resumePdf.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <button type="button" className={styles.removeButton} onClick={removeResumePdf} disabled={loading}>
                Remove
              </button>
            </div>
          )}

          <div className={styles.panelHeader}>
            <div>
              <h2>Job description</h2>
              <p>Paste the complete JD, including company, role, responsibilities, and requirements.</p>
            </div>
            <span className={remainingCharacters < 0 ? styles.counterDanger : styles.counter}>
              {jobDescription.length.toLocaleString()} / {MAX_JD_LENGTH.toLocaleString()}
            </span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            placeholder="Paste the job description, company name, position, responsibilities, and requirements..."
            className={styles.textarea}
            maxLength={MAX_JD_LENGTH + 500}
            disabled={loading}
          />

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryButton} disabled={!canGenerate}>
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Personalizing
                </>
              ) : (
                'Generate Cover Letter'
              )}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={generate}
              disabled={!coverLetter || loading}
            >
              Regenerate
            </button>
          </div>
        </form>

        <section className={styles.resultPanel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Generated result</h2>
              <p>{generatedAt ? `Created ${new Date(generatedAt).toLocaleString()}` : 'Your cover letter will appear here.'}</p>
            </div>
            <button
              type="button"
              className={styles.copyButton}
              onClick={handleCopy}
              disabled={!coverLetter || loading}
            >
              {copied ? 'Copied' : 'Copy to Clipboard'}
            </button>
          </div>

          <div className={`${styles.output} ${coverLetter ? styles.outputReady : ''}`}>
            {loading ? (
              <div className={styles.generatingState}>
                <span className={styles.largeSpinner} />
                <strong>Drafting your personalized letter</strong>
                <p>Matching resume skills, projects, and experience against the JD.</p>
              </div>
            ) : coverLetter ? (
              <article className={styles.letterPaper}>
                <div className={styles.letterTopLine} />
                <pre>{coverLetter}</pre>
              </article>
            ) : (
              <div className={styles.emptyState}>
                <strong>Ready when you are.</strong>
                <p>Upload your resume PDF and add a job description to generate a polished cover letter without logging in.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
};

export default CoverLetterGenerator;
