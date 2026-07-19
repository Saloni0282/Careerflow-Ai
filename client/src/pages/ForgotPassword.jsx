import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useForm } from '../hooks/useForm';
import styles from './AuthForm.module.css';

const ForgotPassword = () => {
  const { values, handleChange } = useForm({ email: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authService.forgotPassword(values);
      setSuccess('A password reset link has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Unable to submit request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>CareerFlow AI</p>
          <h1>Reset your password</h1>
          <p>Enter the email address used to create your account and we’ll send a password reset link.</p>
        </div>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label>
            Email
            <input name="email" type="email" value={values.email} onChange={handleChange} required autoComplete="email" />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <p className={styles.switchText}>
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </main>
    </div>
  );
};

export default ForgotPassword;
