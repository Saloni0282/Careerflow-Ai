import { createContext, useContext, useEffect, useState } from 'react';
import { jobService } from '../services/jobService';
import { useAuthContext } from './AuthContext';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const { token } = useAuthContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await jobService.getJobs(token);
        setJobs(data);
      } catch (err) {
        setError(err.message || 'Unable to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token]);

  const addJob = async (jobData) => {
    // Convert skills from comma-separated string to array
    const payload = {
      ...jobData,
      skills: jobData.skills ? jobData.skills.split(',').map((s) => s.trim()).filter((s) => s) : []
    };
    const newJob = await jobService.createJob(payload, token);
    setJobs((current) => [newJob, ...current]);
    return newJob;
  };

  return (
    <JobContext.Provider value={{ jobs, loading, error, addJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => useContext(JobContext);
