import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import AuthForm from '../components/AuthForm';
import styles from './AuthForm.module.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();
  const { values, handleChange } = useForm({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const redirectTo = location.state?.from || '/jobs';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(values);
      navigate(redirectTo);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    if (!credential) {
      setError('Google login did not return a credential.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await googleLogin(credential);
      navigate(redirectTo);
    } catch (err) {
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <AuthForm
        title="Welcome back"
        subtitle="Log in to save jobs, track applications, and manage your career workflow."
        submitLabel="Login"
        loadingLabel="Logging in..."
        loading={loading}
        error={error}
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onGoogleSuccess={handleGoogleSuccess}
        onGoogleError={() => setError('Google login was cancelled or failed.')}
        footerText="Don't have an account?"
        footerLinkText="Sign Up"
        footerLinkTo="/signup"
        mode="login"
      />
    </div>
  );
};

export default Login;
  const redirectTo = location.state?.from || '/jobs';
