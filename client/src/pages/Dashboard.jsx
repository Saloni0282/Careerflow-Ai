import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SearchBar from '../components/SearchBar';
import JobFilters from '../components/JobFilters';
import HorizontalJobCard from '../components/HorizontalJobCard';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { jobService } from '../services/jobService';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [jobsData, setJobsData] = useState({ jobs: [], totalJobs: 0, totalPages: 1, currentPage: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', experienceLevel: '', workMode: '', employmentType: '' });
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchJobs = useCallback(async (opts = {}) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: opts.page || page,
        limit,
        search: opts.search ?? search,
        category: opts.category ?? filters.category,
        location: opts.location,
        workMode: opts.workMode ?? filters.workMode,
        employmentType: opts.employmentType ?? filters.employmentType,
        experienceLevel: opts.experienceLevel ?? filters.experienceLevel
      };
      const res = await jobService.getJobs(params);
      setJobsData(res);
    } catch (err) {
      setError(err.message || 'Unable to load jobs');
    } finally {
      setLoading(false);
    }
  }, [page, search, filters]);

  useEffect(() => {
    fetchJobs({ page: 1 });
  }, []);

  useEffect(() => {
    fetchJobs({ page });
  }, [page]);

  const handleSearch = useCallback(() => {
    setPage(1);
    fetchJobs({ page: 1, search });
  }, [search, fetchJobs]);

  const handleFilterChange = useCallback((field, value) => {
    setFilters((c) => ({ ...c, [field]: value }));
    setPage(1);
    fetchJobs({ page: 1, [field]: value, search });
  }, [fetchJobs, search]);

  const handleClear = useCallback(() => {
    setFilters({ category: '', experienceLevel: '', workMode: '', employmentType: '' });
    setSearch('');
    setPage(1);
    fetchJobs({ page: 1, search: '', category: '', workMode: '', employmentType: '' });
  }, [fetchJobs]);

  const categories = useMemo(() => [...new Set(jobsData.jobs.map((j) => j.category))], [jobsData.jobs]);
  const experienceLevels = useMemo(() => [...new Set(jobsData.jobs.map((j) => j.experienceLevel))], [jobsData.jobs]);
  const workModes = useMemo(() => [...new Set(jobsData.jobs.map((j) => j.workMode))], [jobsData.jobs]);
  const employmentTypes = useMemo(() => [...new Set(jobsData.jobs.map((j) => j.employmentType))], [jobsData.jobs]);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <p className={styles.subtitle}>Marketplace</p>
          <h1>Browse available roles</h1>
          <p className={styles.description}>Search, filter and apply to jobs from your personal career dashboard.</p>
        </div>
      </div>
      <div className={styles.content}>
        <JobFilters
          filters={filters}
          onChange={handleFilterChange}
          onClear={handleClear}
          categories={categories}
          experienceLevels={experienceLevels}
          workModes={workModes}
          employmentTypes={employmentTypes}
        />
        <main className={styles.main}>
          <SearchBar value={search} onChange={setSearch} />

          {loading ? (
            <LoadingSkeleton count={limit} />
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : (
            <>
              {jobsData.jobs.map((job) => (
                <HorizontalJobCard key={job._id} job={job} />
              ))}

              <div className={styles.pageMeta}>
                <div>Showing page {jobsData.currentPage} of {jobsData.totalPages} — {jobsData.totalJobs} jobs</div>
                <Pagination currentPage={jobsData.currentPage} totalPages={jobsData.totalPages} onPage={(p) => setPage(Math.max(1, Math.min(p, jobsData.totalPages)))} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
