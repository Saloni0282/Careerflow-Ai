import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => (
  <aside className={styles.sidebar}>
    <h2>Quick Actions</h2>
    <ul>
      <li>
        <Link to="/jobs/new">Add new job</Link>
      </li>
      <li>
        <Link to="/tracker">Applied jobs</Link>
      </li>
      <li>
        <Link to="/">View dashboard</Link>
      </li>
    </ul>
  </aside>
);

export default Sidebar;
