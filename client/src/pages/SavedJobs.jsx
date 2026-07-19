import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { savedService } from '../services/savedService';
import { applicationService } from '../services/applicationService';
import styles from './SavedJobs.module.css';

const SavedJobs = () => {
  const { token } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [appliedIds, setAppliedIds] = useState([]);
  const navigate = useNavigate();

  const fetchSavedJobs = async () => {
    setError('');
    setLoading(true);

    try {
      const data = await savedService.getSavedJobs(token);
      setSavedJobs(data);
    } catch (err) {
      setError(err.message || 'Unable to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchSavedJobs();
  }, [token]);

  const handleRemove = async (id) => {
    try {
      await savedService.removeSavedJob(id, token);
      setSavedJobs((current) => current.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.message || 'Unable to remove saved job');
    }
  };

  const handleApplySaved = async (saved) => {
    if (!token) {
      navigate('/login');
      return;
    }
    setError('');
    try {
      const response = await applicationService.applyForJob(saved.jobId, token);
      const application = response?.data || response;
      const applicationWithJob = {
        ...application,
        jobId: typeof application.jobId === 'object' ? application.jobId : { _id: saved.jobId, title: saved.title, company: saved.company, location: saved.location }
      };

      // notify other parts of the app (JobTracker)
      window.dispatchEvent(new CustomEvent('applicationCreated', { detail: { application: applicationWithJob, job: applicationWithJob.jobId } }));

      setAppliedIds((cur) => [...cur, saved._id]);
    } catch (err) {
      setError(err.message || 'Unable to apply for saved job');
    }
  };

  return (
    <section className={styles.page}>
      <h1>Saved Jobs</h1>
      {loading ? (
        <p>Loading saved jobs...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : savedJobs.length ? (
        <div className={styles.grid}>
          {savedJobs.map((job) => (
            <article key={job._id} className={styles.card}>
              <h2>{job.title}</h2>
              <p>{job.company}</p>
              <p>Status: {job.status}</p>
              <p>{job.location || 'Remote'}</p>
              <div className={styles.actions}>
                <button type="button" onClick={() => handleRemove(job._id)} className={styles.removeButton}>
                  Remove
                </button>
                <button type="button" onClick={() => handleApplySaved(job)} className={styles.applyButton} disabled={appliedIds.includes(job._id)}>
                  {appliedIds.includes(job._id) ? 'Applied' : 'Apply'}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p>No saved jobs yet. Save one from a job detail page.</p>
      )}
    </section>
  );
};

export default SavedJobs;
