import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import styles from './UserMenu.module.css';

const getInitials = (name = '', email = '') => {
  const source = name || email;
  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';
};

const UserMenu = ({ user, compact = false }) => (
  <div className={`${styles.userMenu} ${compact ? styles.compact : ''}`}>
    {user.avatar ? (
      <img className={styles.avatar} src={user.avatar} alt={user.name || user.email} />
    ) : (
      <span className={styles.avatarFallback}>
        <FiUser />
      </span>
    )}

    {!compact && (
      <div className={styles.identity}>
        <span>{user.name || user.email}</span>
        <small>{user.email}</small>
      </div>
    )}
  </div>
);

export default UserMenu;
