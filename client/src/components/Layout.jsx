import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import styles from './Layout.module.css';

const Layout = () => (
  <div className={styles.appShell}>
    <Navbar />
    <main className={styles.mainContent}>
      <Outlet />
    </main>
  </div>
);

export default Layout;
