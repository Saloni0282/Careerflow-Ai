import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';
import Dashboard from '../pages/Dashboard';
import JobDetails from '../pages/JobDetails';
import JobForm from '../pages/JobForm';
import SavedJobs from '../pages/SavedJobs';
import JobTracker from '../pages/JobTracker';
import AIHub from '../pages/AIHub';
import ATSChecker from '../pages/ATSChecker';
import InterviewPrep from '../pages/InterviewPrep';
import CoverLetterGenerator from '../pages/CoverLetterGenerator';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import NotFound from '../pages/NotFound';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/jobs" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="ai" element={<AIHub />} />
      <Route path="ai/cover-letter" element={<CoverLetterGenerator />} />
      <Route path="ai/ats-checker" element={<ATSChecker />} />
      <Route path="ai/interview-prep" element={<InterviewPrep />} />
      <Route path="jobs" element={<Dashboard />} />
      <Route path="jobs/new" element={<ProtectedRoute><JobForm /></ProtectedRoute>} />
      <Route path="jobs/:id" element={<JobDetails />} />
      <Route path="tracker" element={<ProtectedRoute><JobTracker /></ProtectedRoute>} />
      <Route path="saved" element={<ProtectedRoute><SavedJobs /></ProtectedRoute>} />
      <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      <Route path="reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default AppRoutes;
