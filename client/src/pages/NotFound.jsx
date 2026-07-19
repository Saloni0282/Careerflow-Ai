import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => (
  <section className={styles.page}>
    <h1>Page not found</h1>
    <p>The page you are looking for does not exist.</p>
    <Link to="/">Return home</Link>
  </section>
);

export default NotFound;
