import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiMoon, FiSun, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useThemeContext } from '../context/ThemeContext';
import { authService } from '../services/authService';
import UserMenu from './UserMenu';
import styles from './Navbar.module.css';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/jobs', label: 'Jobs' },
  { to: '/tracker', label: 'Track Applied Jobs' },
  { to: '/saved', label: 'Saved Jobs' },
  { to: '/about', label: 'About' }
];

const aiTools = [
  { to: '/ai/cover-letter', label: 'Cover Letter Generator' },
  { to: '/ai/ats-checker', label: 'ATS Resume Checker' },
  { to: '/ai/interview-prep', label: 'Interview Question Generator' }
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, token, updateUser } = useAuth();
  const { theme, toggleTheme } = useThemeContext();
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const menuRef = useRef(null);
  const toolsRef = useRef(null);
  const fileInputRef = useRef(null);

  const closeMenu = () => {
    setOpen(false);
    setProfileOpen(false);
  };

  const handleNavigateHome = () => {
    closeMenu();
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    closeMenu();
    navigate('/');
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResumeUploading(true);
    try {
      const formData = new FormData();
      formData.append('resumePdf', file);
      const response = await authService.uploadResume(formData, token);
      updateUser(response.user);
      setProfileOpen(false);
    } catch (err) {
      window.alert(err.message || 'Unable to upload resume.');
    } finally {
      setResumeUploading(false);
      event.target.value = '';
    }
  };

  const handleUploadResumeClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.navbar}>
      <div className={styles.leftGroup}>
        <button className={styles.brand} onClick={handleNavigateHome} type="button">
          CareerFlow AI
        </button>
      </div>

      <nav className={`${styles.links} ${open ? styles.mobileOpen : ''}`} onClick={closeMenu}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? styles.active : styles.link)}
          >
            {item.label}
          </NavLink>
        ))}

        <div className={styles.dropdown} ref={toolsRef} onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            className={`${styles.link} ${location.pathname.startsWith('/ai') ? styles.active : ''} ${styles.dropdownTrigger}`}
            onClick={() => setToolsOpen((current) => !current)}
            aria-expanded={toolsOpen}
          >
            AI Tools
            <FiChevronDown className={`${styles.chevron} ${toolsOpen ? styles.chevronOpen : ''}`} />
          </button>

          {toolsOpen && (
            <div className={styles.dropdownMenu}>
              {aiTools.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `${styles.dropdownItem} ${isActive ? styles.active : ''}`}
                  onClick={() => {
                    setToolsOpen(false);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className={styles.actions}>
        {user ? (
          <div className={styles.userMenuContainer} ref={menuRef}>
            <button
              type="button"
              className={styles.userToggle}
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-expanded={profileOpen}
            >
              <UserMenu user={user} compact />
              <FiChevronDown className={`${styles.chevron} ${profileOpen ? styles.chevronOpen : ''}`} />
            </button>

            {profileOpen && (
              <div className={styles.profileDropdown}>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="application/pdf"
                  style={{ display: 'none' }}
                  onChange={handleResumeUpload}
                  disabled={resumeUploading}
                />
                <NavLink to="/profile" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                  Manage profile
                </NavLink>
                <button
                  type="button"
                  className={styles.dropdownItem}
                  onClick={handleUploadResumeClick}
                  disabled={resumeUploading}
                >
                  {resumeUploading ? 'Uploading…' : 'Upload resume'}
                </button>
                <button type="button" className={styles.dropdownItem} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/login" className={({ isActive }) => (isActive ? styles.activeAction : styles.loginButton)}>
            Login
          </NavLink>
        )}

        <button
          className={styles.themeButton}
          onClick={toggleTheme}
          type="button"
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

        <button
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
          <span className={styles.burgerBar} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
