import React, { useState } from 'react';
import styles from './InterviewPrep.module.css';
import { interviewService } from '../services/interviewService';
import { useAuth } from '../hooks/useAuth';

const rounds = ['HR Round', 'Round 1 Technical', 'Round 2 Technical', 'Managerial Round', 'Final Round'];

const InterviewPrep=() => {
  const { token } = useAuth();
  const [experienceSummary, setExperienceSummary] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [interviewRound, setInterviewRound] = useState('Round 1 Technical');
  const [jobRole, setJobRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!experienceSummary.trim() || !jobDescription.trim()) {
      setError('Provide both an experience summary and a job description.');
      return;
    }

    setLoading(true);
    try {
      const payload = { experienceSummary, jobDescription, interviewRound, jobRole };
      const resp = await interviewService.generateInterview(payload, token);
      setResult(resp.data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to generate interview questions.');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (i) => {
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const copyAnswer = async (text, i) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(i);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      // fallback: select and copy via textarea
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedIndex(i);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const copyAllAnswers = async () => {
    if (!result?.questions?.length) return;
    const all = result.questions.map((q, idx) => `Q${idx + 1}: ${q.question}\nA: ${q.suggestedAnswer}`).join('\n\n');
    try { await navigator.clipboard.writeText(all); setCopiedIndex('all'); setTimeout(()=>setCopiedIndex(null),2000); } catch { /* ignore */ }
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1>AI Interview Question Generator</h1>
        <p>Paste your experience summary and the job description to get focused interview questions and concise answers.</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          Experience Summary
          <textarea value={experienceSummary} onChange={(e) => setExperienceSummary(e.target.value)} rows={6} />
        </label>

        <label>
          Job Description
          <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={8} />
        </label>

        <div className={styles.row}>
          <label>
            Interview Round
            <select value={interviewRound} onChange={(e) => setInterviewRound(e.target.value)}>
              {rounds.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>

          <label>
            Job Role (optional)
            <input value={jobRole} onChange={(e) => setJobRole(e.target.value)} />
          </label>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.actions}>
          <button type="submit" disabled={loading}>{loading ? 'Generating…' : 'Generate Questions'}</button>
        </div>
      </form>

      {result && (
        <section className={styles.results}>
          <div className={styles.resultHeaderTop}>
            <div>
              <p className={styles.metaLabel}>Interview round</p>
              <h2>{result.interviewRound || 'Interview Preparation'}</h2>
            </div>
            <div>
              <p className={styles.metaLabel}>Job role</p>
              <p>{result.jobRole || 'Not provided'}</p>
            </div>
            {result.generatedAt && (
              <div>
                <p className={styles.metaLabel}>Generated</p>
                <p>{new Date(result.generatedAt).toLocaleString()}</p>
              </div>
            )}
          </div>

          {result.focusAreas?.length > 0 && (
            <div className={styles.sectionBlock}>
              <h2>Focus Areas</h2>
              <div className={styles.tagList}>
                {result.focusAreas.map((f, i) => <span key={i} className={styles.tag}>{f}</span>)}
              </div>
            </div>
          )}

          <div className={styles.sectionBlock}>
            <h2>Questions</h2>
            <div className={styles.controls}>
              <button type="button" onClick={copyAllAnswers} className={styles.copyAllButton}>Copy all answers</button>
              {copiedIndex === 'all' && <span className={styles.copiedBadge}>Copied</span>}
            </div>
            <div className={styles.cards}>
              {result.questions?.length > 0 ? result.questions.map((q, i) => (
                <article key={i} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div>
                      <span className={styles.badge}>{q.category || 'Question'}</span>
                      <div className={styles.q}>{q.question}</div>
                    </div>
                    <div className={styles.cardActions}>
                      <button type="button" className={styles.copyButton} onClick={() => copyAnswer(q.suggestedAnswer, i)}>
                        {copiedIndex === i ? 'Copied' : 'Copy'}
                      </button>
                      <button type="button" className={styles.toggleButton} onClick={() => toggleExpand(i)}>
                        {expanded[i] ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                  {expanded[i] && <div className={styles.a}>{q.suggestedAnswer}</div>}
                </article>
              )) : <p>No questions were returned.</p>}
            </div>
          </div>

          <div className={styles.sectionBlock}>
            <h2>Interview Assessment Summary</h2>
            {result.summary ? <p>{result.summary}</p> : <p>No summary available.</p>}
          </div>

          {result.strengths?.length > 0 && (
            <div className={styles.sectionBlock}>
              <h3>Strengths</h3>
              <ul>{result.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          )}

          {result.potentialWeakAreas?.length > 0 && (
            <div className={styles.sectionBlock}>
              <h3>Potential Weak Areas</h3>
              <ul>{result.potentialWeakAreas.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          )}
        </section>
      )}
    </section>
  );
}

export default InterviewPrep;