import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { useForm } from '../hooks/useForm';
import styles from './Profile.module.css';

const Profile = () => {
  const { user, token, updateUser, logout } = useAuth();
  const { values, handleChange, setValues } = useForm({
    name: '',
    email: '',
    headline: '',
    location: '',
    bio: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setValues({
        name: user.name || '',
        email: user.email || '',
        headline: user.headline || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user, setValues]);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await authService.updateProfile(values, token);
      updateUser(response.user);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Unable to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (!password || password !== confirmPassword) {
      setError('Passwords must match.');
      setLoading(false);
      return;
    }

    try {
      await authService.updatePassword({ password, confirmPassword }, token);
      setMessage('Password updated. Please log in again.');
      logout();
    } catch (err) {
      setError(err.message || 'Unable to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload your resume as a PDF file.');
      event.target.value = '';
      return;
    }

    setError('');
    setMessage('');
    setResumeLoading(true);

    try {
      const formData = new FormData();
      formData.append('resumePdf', file);
      const response = await authService.uploadResume(formData, token);
      updateUser(response.user);
      setMessage('Resume uploaded successfully.');
    } catch (err) {
      setError(err.message || 'Resume upload failed.');
    } finally {
      setResumeLoading(false);
      event.target.value = '';
    }
  };

  const handleResumeDelete = async () => {
    setError('');
    setMessage('');
    setResumeLoading(true);

    try {
      const response = await authService.deleteResume(token);
      updateUser(response.user);
      setMessage('Resume removed successfully.');
    } catch (err) {
      setError(err.message || 'Unable to remove resume.');
    } finally {
      setResumeLoading(false);
    }
  };

  if (!user) {
    return <div className={styles.page}>You must be signed in to view this page.</div>;
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.sectionLabel}>Professional profile</p>
          <h1>Career settings</h1>
          <p className={styles.description}>
            Keep your profile current, upload your resume, and manage your account access.
          </p>
        </div>
      </header>

      {message && <div className={styles.message}>{message}</div>}
      {error && <div className={styles.error}>{error}</div>}

      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <h2>Profile details</h2>
          <span>Update your public profile and contact information.</span>
        </div>
        <form className={styles.formGrid} onSubmit={handleProfileSave}>
          <label>
            Full name
            <input name="name" value={values.name} onChange={handleChange} required />
          </label>

          <label>
            Email address
            <input name="email" type="email" value={values.email} onChange={handleChange} required />
          </label>

          <label>
            Headline
            <input name="headline" value={values.headline} onChange={handleChange} placeholder="Product manager, Frontend developer, etc." />
          </label>

          <label>
            Location
            <input name="location" value={values.location} onChange={handleChange} placeholder="City, state or remote" />
          </label>

          <label className={styles.fullWidth}>
            About me
            <textarea name="bio" value={values.bio} onChange={handleChange} rows="5" placeholder="Write a short professional summary." />
          </label>

          <div className={styles.actionGroup}>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save profile'}
            </button>
          </div>
        </form>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <h2>Resume & application assets</h2>
          <span>Upload a current resume for one-click applications and recruiter requests.</span>
        </div>
        <div className={styles.resumeSection}>
          <div>
            <p className={styles.resumeLabel}>Current resume</p>
            {user.resumeUrl ? (
              <>
                <a className={styles.resumeLink} href={user.resumeUrl} target="_blank" rel="noreferrer">
                  {user.resumeFileName || 'View uploaded resume'}
                </a>
                {user.resumeUploadedAt && (
                  <p className={styles.mutedText}>
                    Uploaded {new Date(user.resumeUploadedAt).toLocaleDateString()} at {new Date(user.resumeUploadedAt).toLocaleTimeString()}
                  </p>
                )}
              </>
            ) : (
              <p className={styles.mutedText}>No resume uploaded yet.</p>
            )}
          </div>

          <div className={styles.resumeActions}>
            <label className={styles.uploadButton}>
              {resumeLoading ? 'Uploading…' : 'Upload new resume'}
              <input type="file" accept="application/pdf" onChange={handleResumeUpload} disabled={resumeLoading} />
            </label>
            {user.resumeUrl && (
              <button type="button" className={styles.removeResume} onClick={handleResumeDelete} disabled={resumeLoading}>
                {resumeLoading ? 'Processing…' : 'Remove resume'}
              </button>
            )}
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.sectionHeader}>
          <h2>Security</h2>
          <span>Change your password and keep your account secure.</span>
        </div>
        <form className={styles.formGrid} onSubmit={handlePasswordChange}>
          <label>
            New password
            <input name="password" type="password" required autoComplete="new-password" />
          </label>

          <label>
            Confirm password
            <input name="confirmPassword" type="password" required autoComplete="new-password" />
          </label>

          <div className={styles.actionGroup}>
            <button type="submit" disabled={loading}>
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Profile;
