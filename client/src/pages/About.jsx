import { Link } from 'react-router-dom';
import styles from './About.module.css';

const About = () => (
  <section className={styles.page}>
    <header className={styles.hero}>
      <p className={styles.eyebrow}>About CareerFlow AI</p>
      <h1>A smarter workspace for managing the modern job search.</h1>
      <p>
        CareerFlow AI is built to help job seekers organize applications, save important roles,
        prepare stronger materials, and make better decisions throughout the hiring journey.
      </p>
    </header>

    <div className={styles.contentGrid}>
      <article className={styles.section}>
        <h2>Aim of the project</h2>
        <p>
          The aim of CareerFlow AI is to create one focused platform where candidates can manage
          their complete job search workflow. Instead of switching between spreadsheets, notes,
          job portals, email threads, and resume tools, users can keep jobs, saved roles,
          applications, notes, and AI assistance in a single organized system.
        </p>
      </article>

      <article className={styles.section}>
        <h2>Purpose of the project</h2>
        <p>
          The purpose is to reduce confusion and improve productivity during job hunting. CareerFlow
          AI helps users browse jobs, save opportunities, track application status, write notes,
          prepare personalized cover letters, and follow their progress from discovery to interview
          and offer stages.
        </p>
      </article>

      <article className={styles.section}>
        <h2>Need for the project</h2>
        <p>
          Job searching can become difficult when a candidate applies to many companies at once.
          Important details are often lost: where they applied, which resume was used, what the next
          step is, or when to follow up. CareerFlow AI solves this need by giving users a structured
          dashboard and AI-powered tools that make the process clearer, faster, and more professional.
        </p>
      </article>
    </div>

    <section className={styles.featureBand}>
      <div>
        <h2>What CareerFlow AI includes</h2>
        <p>
          The project currently includes a public job board, protected job tracking, saved jobs,
          JWT authentication, Google login support, MongoDB-backed data, and an AI cover letter
          generator powered by Gemini. The AI tool uses resume PDF parsing and job description
          analysis to create concise, personalized cover letters.
        </p>
      </div>
      <div className={styles.stackList}>
        <span>React</span>
        <span>Node.js</span>
        <span>Express</span>
        <span>MongoDB</span>
        <span>Gemini API</span>
        <span>JWT Auth</span>
      </div>
    </section>

    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div>
          <h2>CareerFlow AI</h2>
          <p>
            Built for students, freshers, and professionals who want a cleaner way to manage job
            applications and career preparation.
          </p>
        </div>

        <nav className={styles.footerLinks}>
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>
          <Link to="/ai">AI Tools</Link>
          <Link to="/tracker">Track Applied Jobs</Link>
        </nav>
      </div>

      <div className={styles.footerBottom}>
        <span>2026 CareerFlow AI. Built for organized career growth.</span>
        <a href="mailto:support@careerflow.ai">support@careerflow.ai</a>
      </div>
    </footer>
  </section>
);

export default About;
