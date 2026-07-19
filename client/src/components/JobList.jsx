import JobCard from './JobCard';
import styles from './JobList.module.css';

const JobList = ({ jobs }) => {
  if (!jobs.length) {
    return <p className={styles.empty}>No jobs saved yet.</p>;
  }

  return (
    <div className={styles.grid}>
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
