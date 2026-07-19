import { Link } from 'react-router-dom';
import styles from './AIHub.module.css';

const tools = [
  {
    title: 'Cover Letter Generator',
    description: 'Create a tailored cover letter from your resume and a job description in seconds.',
    link: '/ai/cover-letter',
    badge: 'Live'
  },
  {
    title: 'ATS Resume Checker',
    description: 'Analyze your resume for ATS compatibility and compare it to a job description.',
    link: '/ai/ats-checker',
    badge: 'Live'
  },
  {
    title: 'Interview Question Generator',
    description: 'Prepare for interviews with role-specific questions and answer guidance.',
    link: '/ai/interview-prep',
    badge: 'Coming soon',
    disabled: true
  }
];

const AIHub = () => (
  <section className={styles.page}>
    <div className={styles.hero}>
      <p className={styles.eyebrow}>AI command center</p>
      <h1>One central hub for every AI-powered career tool.</h1>
      <p>
        Manage cover letters, resume analysis, and interview preparation from a single professional
        workspace. Each tool is built to scale and connect with your existing job search workflow.
      </p>
      <div className={styles.quickLinks}>
        <Link to="/ai/cover-letter" className={styles.quickButton}>
          Cover letter tool
        </Link>
        <Link to="/ai/ats-checker" className={styles.quickButtonPrimary}>
          ATS Resume Checker
        </Link>
      </div>
    </div>

    <div className={styles.grid}>
      {tools.map((tool) => (
        <article key={tool.title} className={`${styles.card} ${tool.disabled ? styles.disabled : ''}`}>
          <div className={styles.cardHeader}>
            <h2>{tool.title}</h2>
            <span className={styles.badge}>{tool.badge}</span>
          </div>
          <p>{tool.description}</p>
          <div className={styles.cardFooter}>
            <Link
              to={tool.link}
              className={tool.disabled ? styles.cardButtonDisabled : styles.cardButton}
              aria-disabled={tool.disabled}
            >
              {tool.disabled ? 'Preview' : 'Open tool'}
            </Link>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default AIHub;
