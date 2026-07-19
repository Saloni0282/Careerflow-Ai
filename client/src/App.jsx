import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { ThemeProvider } from './context/ThemeContext';
import styles from './App.module.css';

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <div className={styles.appContainer}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <JobProvider>
                <AppRoutes />
              </JobProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
