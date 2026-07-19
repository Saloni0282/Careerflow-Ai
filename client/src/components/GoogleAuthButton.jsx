import { GoogleLogin } from '@react-oauth/google';
import styles from './GoogleAuthButton.module.css';

const GoogleAuthButton = ({ onSuccess, onError, disabled = false }) => {
  const configured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  if (!configured) {
    return (
      <button type="button" className={styles.googleButton} disabled>
        Continue with Google
      </button>
    );
  }

  return (
    <div className={`${styles.googleShell} ${disabled ? styles.disabled : ''}`}>
      <GoogleLogin
        onSuccess={(response) => onSuccess(response.credential)}
        onError={onError}
        text="continue_with"
        shape="pill"
        size="large"
        width="360"
        useOneTap={false}
      />
    </div>
  );
};

export default GoogleAuthButton;
