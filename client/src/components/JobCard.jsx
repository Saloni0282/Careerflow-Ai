import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import { savedService } from '../services/savedService';
import styles from './JobCard.module.css';

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [actionMessage, setActionMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBusy(true);
    setActionMessage('');
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

      setActionMessage('Application submitted');
    } catch (err) {
      setActionMessage(err.message || 'Unable to apply');
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBusy(true);
    setActionMessage('');
    try {
      await savedService.addSavedJob(
        {
          jobId: job._id,
          title: job.title,
          company: job.company,
          status: job.employmentType,
          location: job.location,
          notes: job.description?.slice(0, 120)
        },
        token
      );
      setActionMessage('Saved to your list');
    } catch (err) {
      setActionMessage(err.message || 'Unable to save');
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.logoBlock}>
          {job.logo ? <img src={job.logo} alt={`${job.company} logo`} /> : <span className={styles.logoFallback}>{job.company.charAt(0)}</span>}
        </div>
        <div className={styles.titleBlock}>
          <h3>{job.title}</h3>
          <p className={styles.company}>{job.company}</p>
        </div>
      </div>

      <div className={styles.badgeRow}>
        <span className={styles.badge}>{job.workMode}</span>
        <span className={styles.badge}>{job.experienceLevel}</span>
        <span className={styles.badge}>{job.employmentType}</span>
      </div>

      <p className={styles.preview}>{job.description?.slice(0, 120)}...</p>

      <div className={styles.metaRow}>
        <span>{job.location || 'Remote'}</span>
        <span>{job.salary}</span>
        <span>{new Date(job.postedDate).toLocaleDateString()}</span>
      </div>

      <div className={styles.skillRow}>
        {job.skills?.slice(0, 4).map((skill) => (
          <span key={skill} className={styles.skillTag}>{skill}</span>
        ))}
      </div>

      <div className={styles.actionRow}>
        <button type="button" className={styles.primaryAction} onClick={() => navigate(`/jobs/${job._id}`)}>
          View details
        </button>
        <button type="button" className={styles.secondaryAction} onClick={handleApply} disabled={busy}>
          {busy ? 'Processing…' : 'Apply'}
        </button>
      </div>

      <button type="button" className={styles.linkAction} onClick={handleSave} disabled={busy}>
        Save job
      </button>
      {actionMessage && <p className={styles.feedback}>{actionMessage}</p>}
    </article>
  );
};

export default JobCard;
