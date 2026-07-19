import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import { savedService } from '../services/savedService';
import StatusBadge from './StatusBadge';
import styles from './HorizontalJobCard.module.css';

const HorizontalJobCard = ({ job, onApplied }) => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await applicationService.applyForJob(job._id, token);
      const application = res?.data || res;
      window.dispatchEvent(new CustomEvent('applicationCreated', { detail: { application, job } }));
      onApplied && onApplied(application);
    } catch (err) {
      // ignore
    }
  };

  const handleSave = async () => {
    if (!user) return navigate('/login');
    try {
      await savedService.addSavedJob({ jobId: job._id, title: job.title, company: job.company }, token);
    } catch (err) {}
  };

  return (
    <article className={styles.card}>
      <div className={styles.left}>
        <div className={styles.logo}>{job.logo ? <img src={job.logo} alt={job.company} /> : <div className={styles.fallback}>{job.company?.charAt(0)}</div>}</div>
        <div className={styles.info}>
          <h3>{job.title}</h3>
          <p className={styles.company}>{job.company}</p>
          <p className={styles.location}>{job.location || 'Remote'}</p>
        </div>
      </div>

      <div className={styles.middle}>
        <div className={styles.meta}>{job.experienceLevel} • {job.employmentType}</div>
        <div className={styles.meta}>{job.workMode} • {job.salary}</div>
        <div className={styles.meta}>{new Date(job.postedDate).toLocaleDateString()}</div>
      </div>

      <div className={styles.right}>
        <div className={styles.actions}>
          <button className={styles.apply} onClick={handleApply}>Apply</button>
          <button className={styles.save} onClick={handleSave}>Save</button>
          <button className={styles.view} onClick={() => navigate(`/jobs/${job._id}`)}>View details</button>
        </div>
        {job.applied && <StatusBadge status={job.applied} />}
      </div>
    </article>
  );
};

export default React.memo(HorizontalJobCard);
