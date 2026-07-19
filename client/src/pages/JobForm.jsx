import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useJobContext } from '../context/JobContext';
import { useForm } from '../hooks/useForm';
import styles from './JobForm.module.css';

const JobForm = () => {
  const navigate = useNavigate();
  const { addJob } = useJobContext();
  const { values, handleChange, resetForm } = useForm({
    title: '',
    company: '',
    category: '',
    location: '',
    workMode: 'Remote',
    experienceLevel: 'Mid',
    employmentType: 'Full-time',
    salary: 'Competitive',
    description: '',
    skills: '',
    notes: ''
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await addJob(values);
    resetForm();
    navigate('/');
  };

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.content}>
        <Sidebar />
        <main className={styles.main}>
          <h1>Add a new job</h1>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>
              Job Title
              <input name="title" value={values.title} onChange={handleChange} required />
            </label>
            <label>
              Company
              <input name="company" value={values.company} onChange={handleChange} required />
            </label>
            <label>
              Category
              <select name="category" value={values.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                <option value="Software">Software Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="HR">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Location
              <input name="location" value={values.location} onChange={handleChange} />
            </label>
            <label>
              Work Mode
              <select name="workMode" value={values.workMode} onChange={handleChange}>
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </label>
            <label>
              Experience Level
              <select name="experienceLevel" value={values.experienceLevel} onChange={handleChange}>
                <option value="Internship">Internship</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </label>
            <label>
              Employment Type
              <select name="employmentType" value={values.employmentType} onChange={handleChange}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Internship">Internship</option>
              </select>
            </label>
            <label>
              Salary
              <input name="salary" value={values.salary} onChange={handleChange} placeholder="e.g., $80,000 - $120,000" />
            </label>
            <label>
              Description
              <textarea name="description" value={values.description} onChange={handleChange} placeholder="Job description and details" />
            </label>
            <label>
              Required Skills (comma-separated)
              <input name="skills" value={values.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
            </label>
            <label>
              Notes
              <textarea name="notes" value={values.notes} onChange={handleChange} />
            </label>
            <button type="submit">Save job</button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default JobForm;
