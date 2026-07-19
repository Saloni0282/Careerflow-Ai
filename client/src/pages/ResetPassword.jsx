import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useForm } from '../hooks/useForm';
import styles from './AuthForm.module.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { values, handleChange } = useForm({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const token = new URLSearchParams(location.search).get('token');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Reset token is missing from the link.');
      return;
    }

    if (!values.password || values.password !== values.confirmPassword) {
      setError('Passwords must match.');
      return;
    }

    setLoading(true);

    try {
      await authService.resetPassword({ token, password: values.password, confirmPassword: values.confirmPassword });
      setSuccess('Password updated successfully. You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>CareerFlow AI</p>
          <h1>Set a new password</h1>
          <p>Use the reset link from your email to choose a secure new password.</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            New password
            <input name="password" type="password" value={values.password} onChange={handleChange} required autoComplete="new-password" />
          </label>

          <label>
            Confirm password
            <input name="confirmPassword" type="password" value={values.confirmPassword} onChange={handleChange} required autoComplete="new-password" />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Reset password'}
          </button>
        </form>

        <p className={styles.switchText}>
          Back to <Link to="/login">Login</Link>
        </p>
      </main>
    </div>
  );
};

export default ResetPassword;
