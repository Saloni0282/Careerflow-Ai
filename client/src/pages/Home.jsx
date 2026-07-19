import { Link } from 'react-router-dom';
import AIToolsSection from '../components/AIToolsSection';
import styles from './Home.module.css';

const Home = () => (
  <section className={styles.page}>
    <div className={styles.hero}>
      <h1>CareerFlow AI</h1>
      <p>Track job applications, save important roles, and stay organized with AI-powered job workflows.</p>
      <Link to="/jobs" className={styles.ctaButton}>
        View Jobs
      </Link>
    </div>

    <AIToolsSection />

    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.brandColumn}>
          <h2>Take control of your career with confidence.</h2>
          <p>
            CareerFlow AI helps professionals manage every application, follow up faster, and keep the
            entire job search journey in one modern dashboard.
          </p>
        </div>

        <div className={styles.linkGroup}>
          <h3>Product</h3>
          <Link to="/jobs">Jobs board</Link>
          <Link to="/saved">Saved roles</Link>
          <Link to="/about">About</Link>
        </div>

        <div className={styles.linkGroup}>
          <h3>Company</h3>
          <a href="mailto:support@careerflow.ai">Contact us</a>
          <a href="https://example.com" target="_blank" rel="noreferrer">Career resources</a>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>© 2026 CareerFlow AI · Built for modern career growth.</span>
        <div className={styles.footerActions}>
          <a href="mailto:support@careerflow.ai">support@careerflow.ai</a>
        </div>
      </div>
    </footer>
  </section>
);

export default Home;
