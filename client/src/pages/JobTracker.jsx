import { useEffect, useState } from 'react';
import { applicationService } from '../services/applicationService';
import { jobService } from '../services/jobService';
import { useAuth } from '../hooks/useAuth';
import { useForm } from '../hooks/useForm';
import styles from './JobTracker.module.css';
import ApplicationTrackerCard from '../components/ApplicationTrackerCard';
import ExternalAppliedJobCard from '../components/ExternalAppliedJobCard';
import DashboardSection from '../components/DashboardSection';

const JobTracker = () => {
  const { token, user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [externalJobs, setExternalJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');

  const { values, handleChange, resetForm } = useForm({
    title: '',
    company: '',
    jobUrl: '',
    source: 'LinkedIn',
    location: '',
    salary: '',
    appliedDate: new Date().toISOString().slice(0, 10),
    applicationStatus: 'Applied',
    notes: '',
    description: ''
  });

  useEffect(() => {
    const fetch = async () => {
      setError('');
      setLoading(true);
      try {
        const apps = await applicationService.getApplications(token);
        const external = await jobService.getExternalJobs(token);
        setApplications(apps || []);
        setExternalJobs(external || []);
      } catch (err) {
        setError(err.message || 'Unable to load tracker data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetch();
    }
  }, [token, user]);

  useEffect(() => {
    const handleNewApplication = (event) => {
      const application = event?.detail?.application;
      const job = event?.detail?.job;
      if (!application) return;

      const applicationWithJob = {
        ...application,
        jobId: typeof application.jobId === 'object' ? application.jobId : job
      };

      setApplications((prev) => {
        if (prev.some((item) => item._id === applicationWithJob._id)) return prev;
        return [applicationWithJob, ...prev];
      });
    };

    window.addEventListener('applicationCreated', handleNewApplication);
    return () => window.removeEventListener('applicationCreated', handleNewApplication);
  }, []);

  const handleUpdatedApplication = (updated) => {
    setApplications((prev) => prev.map((a) => (a._id === updated._id ? updated : a)));
  };

  const handleApplicationDeleted = (id) => {
    setApplications((prev) => prev.filter((app) => app._id !== id));
    setMessage('Application removed successfully.');
  };

  const handleExternalJobDeleted = (id) => {
    setExternalJobs((prev) => prev.filter((job) => job._id !== id));
    setMessage('Job removed successfully.');
  };

  const handleExternalJobSaved = (updated) => {
    setExternalJobs((prev) => prev.map((job) => (job._id === updated._id ? updated : job)));
  };

  const handleCreateJob = async (event) => {
    event.preventDefault();
    setFormError('');
    setMessage('');

    try {
      const payload = {
        title: values.title,
        company: values.company,
        jobUrl: values.jobUrl,
        source: values.source,
        location: values.location,
        salary: values.salary,
        appliedDate: values.appliedDate ? new Date(values.appliedDate) : new Date(),
        applicationStatus: values.applicationStatus,
        notes: values.notes,
        description: values.description,
        createdBy: user?.id
      };
      const createdJob = await jobService.createJob(payload, token);
      const newJob = createdJob?.data || createdJob;
      setExternalJobs((prev) => [newJob, ...prev]);
      resetForm();
      setMessage('Application record added successfully.');
    } catch (err) {
      setFormError(err.message || 'Unable to save external application.');
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <h1>Track Applied Jobs</h1>
        <p>Manage platform applications and external application records from one professional dashboard.</p>
      </div>

      {loading ? (
        <p>Loading your dashboard…</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <>
          {message && <div className={styles.message}>{message}</div>}
          <DashboardSection title="My Applied Jobs">
            {applications.length ? (
              applications.map((app) => (
                <ApplicationTrackerCard key={app._id} application={app} onUpdated={handleUpdatedApplication} onDeleted={handleApplicationDeleted} />
              ))
            ) : (
              <p>You have not applied to any jobs yet.</p>
            )}
          </DashboardSection>

          <DashboardSection title="External Applied Jobs">
            <div className={styles.formSection}>
              <div className={styles.sectionHeader}>
                <h3>Add an external application</h3>
                <p>Track jobs you applied for outside CareerFlow AI, including status, source, and notes.</p>
              </div>
              <form className={styles.createForm} onSubmit={handleCreateJob}>
                <div className={styles.gridTwo}>
                  <label>
                    Job title
                    <input name="title" value={values.title} onChange={handleChange} required />
                  </label>
                  <label>
                    Company
                    <input name="company" value={values.company} onChange={handleChange} required />
                  </label>
                </div>
                <div className={styles.gridTwo}>
                  <label>
                    Source
                    <select name="source" value={values.source} onChange={handleChange}>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Indeed">Indeed</option>
                      <option value="Company Website">Company Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>
                  <label>
                    Applied date
                    <input type="date" name="appliedDate" value={values.appliedDate} onChange={handleChange} required />
                  </label>
                </div>
                <div className={styles.gridTwo}>
                  <label>
                    Application status
                    <select name="applicationStatus" value={values.applicationStatus} onChange={handleChange}>
                      <option value="Applied">Applied</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Offer Received">Offer Received</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Withdrawn">Withdrawn</option>
                      <option value="Joined">Joined</option>
                    </select>
                  </label>
                  <label>
                    Job URL
                    <input
                      name="jobUrl"
                      value={values.jobUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </label>
                </div>
                <div className={styles.gridTwo}>
                  <label>
                    Location
                    <input
                      name="location"
                      value={values.location}
                      onChange={handleChange}
                      placeholder="Remote or city, state"
                    />
                  </label>
                  <label>
                    Salary
                    <input name="salary" value={values.salary} onChange={handleChange} placeholder="e.g. $90k - $120k" />
                  </label>
                </div>
                <label>
                  Notes
                  <textarea
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Interview prep, follow-ups, or job-specific notes"
                  />
                </label>
                <label>
                  Description
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Optional details about the role or application"
                  />
                </label>
                {formError && <div className={styles.formError}>{formError}</div>}
                <div className={styles.actionRow}>
                  <button type="submit">Save application</button>
                </div>
              </form>
            </div>

            {externalJobs.length ? (
              externalJobs.map((job) => (
                <ExternalAppliedJobCard
                  key={job._id}
                  job={job}
                  onDeleted={handleExternalJobDeleted}
                  onNotesSaved={handleExternalJobSaved}
                />
              ))
            ) : (
              <p>You have not added any external application records yet.</p>
            )}
          </DashboardSection>
        </>
      )}
    </section>
  );
};

export default JobTracker;
