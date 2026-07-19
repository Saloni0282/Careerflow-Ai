import React, { useState } from 'react';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../hooks/useAuth';
import StatusBadge from './StatusBadge';
import NotesEditor from './NotesEditor';
import styles from './ApplicationTrackerCard.module.css';

const STATUS_OPTIONS = ['Applied', 'Interview Scheduled', 'Interviewing', 'Rejected', 'Offer Received', 'Joined', 'Withdrawn'];

const ApplicationTrackerCard = ({ application, onUpdated, onDeleted }) => {
  const { token } = useAuth();
  const [local, setLocal] = useState(application);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleStatus = async (e) => {
    const newStatus = e.target.value;
    setUpdating(true);
    try {
      const res = await applicationService.updateApplication(application._id, { applicationStatus: newStatus }, token);
      const updated = res?.data || res;
      setLocal(updated);
      onUpdated && onUpdated(updated);
    } catch (err) {
      // ignore for now
    } finally {
      setUpdating(false);
    }
  };

  const saveNotes = async (text) => {
    setUpdating(true);
    try {
      // Append the new note to existing notes instead of replacing.
      const existing = local.notes ? String(local.notes).trim() : '';
      const combined = existing ? `${existing}\n• ${text}` : `• ${text}`;
      const res = await applicationService.updateApplication(application._id, { notes: combined }, token);
      const updated = res?.data || res;
      setLocal(updated);
      onUpdated && onUpdated(updated);
    } catch (err) {
      // ignore
    } finally {
      setUpdating(false);
    }
  };

  const buildNotes = (notes = '') => {
    return String(notes)
      .split(/\n|\r|\r\n|\u2022|•/)
      .map((note) => note.trim())
      .filter(Boolean);
  };

  const notes = buildNotes(local.notes);

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this application record? This cannot be undone.');
    if (!confirmed) return;
    setDeleting(true);
    try {
      await applicationService.deleteApplication(application._id, token);
      onDeleted && onDeleted(application._id);
    } catch (err) {
      window.alert(err.message || 'Unable to delete application.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.left}>
        <div className={styles.logo}>
          {local.jobId?.logo ? (
            <img src={local.jobId.logo} alt={local.jobId.company} />
          ) : (
            <div className={styles.fallback}>{(local.jobId?.company || '')[0]}</div>
          )}
        </div>
        <div className={styles.titleBlock}>
          <h3>{local.jobId?.title}</h3>
          <p className={styles.company}>{local.jobId?.company}</p>
          <p className={styles.location}>{local.jobId?.location || 'Remote'}</p>
        </div>
      </div>

      <div className={styles.middle}>
        <div className={styles.metaRow}>
          <span>{local.jobId?.experienceLevel}</span>
          <span>{local.jobId?.employmentType}</span>
          <span>{local.jobId?.workMode}</span>
          <span>{local.jobId?.salary}</span>
          <span>{new Date(local.jobId?.postedDate).toLocaleDateString()}</span>
        </div>
        <div className={styles.metaRow}>
          <span>Applied: {new Date(local.appliedDate).toLocaleDateString()}</span>
          {local.interviewFeedback && <span>Interview feedback available</span>}
          {local.recruiterFeedback && <span>Recruiter feedback available</span>}
        </div>
      
        <NotesEditor initial={local.notes} onSave={saveNotes} placeholder="Add or update personal notes (press Enter for new lines)" />
        {(local.recruiterFeedback || local.interviewFeedback || local.nextSteps) && (
          <div className={styles.feedbackGroup}>
            <strong>Feedback</strong>
            {local.recruiterFeedback && <p><strong>Recruiter:</strong> {local.recruiterFeedback}</p>}
            {local.interviewFeedback && <p><strong>Interview:</strong> {local.interviewFeedback}</p>}
            {local.nextSteps && <p><strong>Next steps:</strong> {local.nextSteps}</p>}
          </div>
        )}
      </div>

      <div className={styles.right}>
        <div className={styles.controls}>
          <select value={local.applicationStatus} onChange={handleStatus} disabled={updating} className={styles.select}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <StatusBadge status={local.applicationStatus} />
        </div>

        <div className={styles.actions}>
          <button className={styles.primary} onClick={() => window.open(`/jobs/${local.jobId?._id}`, '_blank')}>
            View details
          </button>
          <button type="button" className={styles.deleteButton} onClick={handleDelete}>
            Delete
          </button>
        </div>

      
      </div>
    </article>
  );
};

export default React.memo(ApplicationTrackerCard);
