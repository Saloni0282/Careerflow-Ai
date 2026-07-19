import { Link } from 'react-router-dom';
import styles from './AIToolsSection.module.css';

const tools = [
  {
    title: 'AI Cover Letter Generator',
    description: 'Paste a job description and create a polished, ATS-friendly cover letter in seconds.',
    status: 'Available',
    to: '/ai/cover-letter',
    enabled: true
  },
  {
    title: 'ATS Resume Checker',
    description: 'Analyze your resume for ATS compatibility and discover job-specific match gaps.',
    status: 'Available',
    to: '/ai/ats-checker',
    enabled: true
  },
  {
    title: 'Interview Question Generator',
    description: 'Practice role-specific interview questions based on the job you want.',
    status: 'Coming soon',
    enabled: false
  }
];

const AIToolsSection = ({ compact = false }) => (
  <section className={`${styles.section} ${compact ? styles.compact : ''}`}>
    <div className={styles.heading}>
      <p className={styles.eyebrow}>Public AI tools</p>
      <h2>Accelerate your job search with AI</h2>
      <p>
        Start with a public cover letter generator today. More AI workflow tools are prepared for the
        next release.
      </p>
    </div>

    <div className={styles.grid}>
      {tools.map((tool) => {
        const cardContent = (
          <>
            <div className={styles.cardTop}>
              <span className={tool.enabled ? styles.statusLive : styles.statusSoon}>{tool.status}</span>
            </div>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <span className={styles.cardAction}>{tool.enabled ? 'Open tool' : 'Preview only'}</span>
          </>
        );

        return tool.enabled ? (
          <Link key={tool.title} to={tool.to} className={`${styles.card} ${styles.enabled}`}>
            {cardContent}
          </Link>
        ) : (
          <article key={tool.title} className={`${styles.card} ${styles.disabled}`} aria-disabled="true">
            {cardContent}
          </article>
        );
      })}
    </div>
  </section>
);

export default AIToolsSection;
