import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { applicationService } from '../services/applicationService';
import { jobService } from '../services/jobService';
import StatusBadge from './StatusBadge';
import NotesEditor from './NotesEditor';
import styles from './ApplicationTrackerCard.module.css';

const STATUS_OPTIONS = ['Applied', 'Interview Scheduled', 'Interviewing', 'Rejected', 'Offer Received', 'Joined', 'Withdrawn'];

const ExternalAppliedJobCard = ({ job, onDeleted, onNotesSaved, onApplied }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [localJob, setLocalJob] = useState(job);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const buildNotes = (notes = '') => {
    return String(notes)
      .split(/\n|\r|\r\n|\u2022|•/)
      .map((note) => note.trim())
      .filter(Boolean);
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setUpdating(true);

    try {
      const res = await jobService.updateJob(localJob._id, { applicationStatus: newStatus }, token);
      const updated = res?.data || res;
      setLocalJob(updated);
      onNotesSaved && onNotesSaved(updated);
    } catch (err) {
      window.alert(err.message || 'Unable to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const notes = buildNotes(localJob.notes);

  const saveNotes = async (text) => {
    setUpdating(true);
    try {
      // Append new note to existing notes
      const existing = localJob.notes ? String(localJob.notes).trim() : '';
      const combined = existing ? `${existing}\n• ${text}` : `• ${text}`;
      const res = await jobService.updateJob(localJob._id, { notes: combined }, token);
      const updated = res?.data || res;
      setLocalJob(updated);
      onNotesSaved && onNotesSaved(updated);
    } catch (err) {
      // ignore
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this created job and all local job details?');
    if (!confirmed) return;
    setDeleting(true);
    try {
      await jobService.deleteJob(localJob._id, token);
      onDeleted && onDeleted(localJob._id);
    } catch (err) {
      window.alert(err.message || 'Unable to delete job.');
    } finally {
      setDeleting(false);
    }
  };

  const handleApply = async () => {
    try {
      const res = await applicationService.applyForJob(localJob._id, token);
      const application = res?.data || res;
      window.dispatchEvent(new CustomEvent('applicationCreated', { detail: { application, job: localJob } }));
      onApplied && onApplied(application);
    } catch (err) {
      window.alert(err.message || 'Unable to apply at this time.');
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.left}>
        <div className={styles.logo}>
          {localJob.logo ? (
            <img src={localJob.logo} alt={localJob.company} />
          ) : (
            <div className={styles.fallback}>{(localJob.company || '')[0]}</div>
          )}
        </div>
        <div className={styles.titleBlock}>
          <h3>{localJob.title}</h3>
          <p className={styles.company}>{localJob.company}</p>
          <p className={styles.location}>{localJob.location || 'Remote'}</p>
          {localJob.jobUrl && (
            <a className={styles.link} href={localJob.jobUrl} target="_blank" rel="noreferrer">
              View posting
            </a>
          )}
        </div>
      </div>

      <div className={styles.middle}>
        <div className={styles.metaRow}>
          <span>{localJob.source || 'External'}</span>
          <span>{localJob.salary || 'Salary not set'}</span>
          <span>{new Date(localJob.appliedDate).toLocaleDateString()}</span>
        </div>
        {notes.length > 0 && (
          <div className={styles.noteGroup}>
            <strong>Personal Notes</strong>
            <ul className={styles.noteList}>
              {notes.map((note, index) => (
                <li key={index} className={styles.noteItem}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={styles.right}>
        <div className={styles.controls}>
          <select value={localJob.applicationStatus} onChange={handleStatusChange} disabled={updating} className={styles.select}>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <StatusBadge status={localJob.applicationStatus} />
        </div>

        <div className={styles.actions}>
          <button className={styles.primary} type="button" onClick={handleApply} disabled={deleting}>
            Apply
          </button>
          <button className={styles.primary} type="button" onClick={() => navigate(`/jobs/${localJob._id}`)} disabled={deleting}>
            View
          </button>
          <button type="button" className={styles.deleteButton} onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>

        <NotesEditor initial={localJob.notes} onSave={saveNotes} placeholder="Add notes for this external application" />
      </div>
    </article>
  );
};

export default React.memo(ExternalAppliedJobCard);
