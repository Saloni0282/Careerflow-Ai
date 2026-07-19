import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { jobService } from '../services/jobService';
import { savedService } from '../services/savedService';
import { applicationService } from '../services/applicationService';
import styles from './JobDetails.module.css';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await jobService.getJobById(id, token);
        setJob(data);
      } catch (err) {
        setError(err.message || 'Unable to load job');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token]);

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBusy(true);
    setFeedback('');
    try {
      await savedService.addSavedJob(
        {
          jobId: job._id,
          title: job.title,
          company: job.company,
          status: job.employmentType,
          location: job.location,
          notes: job.description?.slice(0, 140)
        },
        token
      );
      setFeedback('Saved to your list');
    } catch (err) {
      setFeedback(err.message || 'Could not save job');
    } finally {
      setBusy(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBusy(true);
    setFeedback('');
    try {
      const response = await applicationService.applyForJob(job._id, token);
      const application = response?.data || response;
      const applicationWithJob = {
        ...application,
        jobId: typeof application.jobId === 'object' ? application.jobId : job
      };

      window.dispatchEvent(
        new CustomEvent('applicationCreated', {
          detail: {
            application: applicationWithJob,
            job
          }
        })
      );

      setFeedback('Application submitted successfully');
    } catch (err) {
      setFeedback(err.message || 'Unable to apply');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
       
        <main className={styles.main}>
          <button className={styles.backButton} onClick={() => navigate('/jobs')}>
            Back to jobs
          </button>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : job ? (
            <section className={styles.card}>
              <div className={styles.detailHeader}>
                <div>
                  <p className={styles.workMode}>{job.workMode}</p>
                  <h1>{job.title}</h1>
                  <p className={styles.company}>{job.company}</p>
                </div>
                <div className={styles.salary}>{job.salary}</div>
              </div>

              <div className={styles.metaRow}>
                <span>{job.location || 'Remote'}</span>
                <span>{job.experienceLevel}</span>
                <span>{job.employmentType}</span>
              </div>

              <p className={styles.description}>{job.description}</p>

              <div className={styles.section}>
                <h2>Responsibilities</h2>
                <ul>
                  {job.responsibilities?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.section}>
                <h2>Requirements</h2>
                <ul>
                  {job.requirements?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.skillRow}>
                {job.skills?.map((skill) => (
                  <span key={skill} className={styles.skillTag}>{skill}</span>
                ))}
              </div>

              <div className={styles.actionRow}>
                <button className={styles.primaryButton} type="button" onClick={handleApply} disabled={busy}>
                  {busy ? 'Applying…' : 'Apply now'}
                </button>
                <button className={styles.secondaryButton} type="button" onClick={handleSave} disabled={busy}>
                  {busy ? 'Saving…' : 'Save job'}
                </button>
              </div>
              {feedback && <p className={styles.message}>{feedback}</p>}
            </section>
          ) : (
            <p>Job not found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobDetails;
