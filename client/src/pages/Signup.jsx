import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import AuthForm from '../components/AuthForm';
import styles from './AuthForm.module.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, googleLogin } = useAuth();
  const { values, handleChange } = useForm({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(values);
      navigate('/jobs');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    if (!credential) {
      setError('Google signup did not return a credential.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await googleLogin(credential);
      navigate('/jobs');
    } catch (err) {
      setError(err.message || 'Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <AuthForm
        title="Create your account"
        subtitle="Start tracking roles, saved jobs, and application progress in one focused workspace."
        submitLabel="Sign up"
        loadingLabel="Signing up..."
        loading={loading}
        error={error}
        values={values}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onGoogleSuccess={handleGoogleSuccess}
        onGoogleError={() => setError('Google signup was cancelled or failed.')}
        footerText="Already have an account?"
        footerLinkText="Login"
        footerLinkTo="/login"
        mode="signup"
      />
    </div>
  );
};

export default Signup;
