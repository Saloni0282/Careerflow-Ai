import { Link } from 'react-router-dom';
import GoogleAuthButton from './GoogleAuthButton';
import styles from '../pages/AuthForm.module.css';

const AuthForm = ({
  title,
  subtitle,
  submitLabel,
  loadingLabel,
  loading,
  error,
  values,
  onChange,
  onSubmit,
  onGoogleSuccess,
  onGoogleError,
  footerText,
  footerLinkText,
  footerLinkTo,
  mode
}) => (
  <main className={styles.main}>
    <div className={styles.heading}>
      <p className={styles.eyebrow}>CareerFlow AI</p>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>

    <GoogleAuthButton onSuccess={onGoogleSuccess} onError={onGoogleError} disabled={loading} />

    <div className={styles.divider}>
      <span>or continue with email</span>
    </div>

    <form className={styles.form} onSubmit={onSubmit}>
      {error && <p className={styles.error}>{error}</p>}

      {mode === 'signup' && (
        <label>
          Name
          <input name="name" value={values.name} onChange={onChange} required autoComplete="name" />
        </label>
      )}

      <label>
        Email
        <input name="email" type="email" value={values.email} onChange={onChange} required autoComplete="email" />
      </label>

      <label>
        Password
        <input
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
          required
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? loadingLabel : submitLabel}
      </button>
    </form>

    <p className={styles.switchText}>
      {footerText} <Link to={footerLinkTo}>{footerLinkText}</Link>
    </p>
  </main>
);

export default AuthForm;
