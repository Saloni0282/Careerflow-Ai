import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Header.module.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        CareerFlow AI
      </Link>
      <nav className={styles.nav}>
        {user ? (
          <>
          <span>Welcome, {user?.user?.name}</span>
            <button className={styles.logoutButton} onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
