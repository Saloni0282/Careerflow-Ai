import React from 'react';
import styles from './JobFilters.module.css';

const JobFilters = ({ filters, onChange, onClear, categories = [], experienceLevels = [], workModes = [], employmentTypes = [] }) => (
  <aside className={styles.filters}>
    <div className={styles.block}>
      <label>Category</label>
      <select value={filters.category} onChange={(e) => onChange('category', e.target.value)}>
        <option value="">All</option>
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
    <div className={styles.block}>
      <label>Experience</label>
      <select value={filters.experienceLevel} onChange={(e) => onChange('experienceLevel', e.target.value)}>
        <option value="">Any</option>
        {experienceLevels.map((e) => <option key={e} value={e}>{e}</option>)}
      </select>
    </div>
    <div className={styles.block}>
      <label>Work mode</label>
      <select value={filters.workMode} onChange={(e) => onChange('workMode', e.target.value)}>
        <option value="">Any</option>
        {workModes.map((w) => <option key={w} value={w}>{w}</option>)}
      </select>
    </div>
    <div className={styles.block}>
      <label>Employment Type</label>
      <select value={filters.employmentType} onChange={(e) => onChange('employmentType', e.target.value)}>
        <option value="">Any</option>
        {employmentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
      </select>
    </div>
    <div className={styles.actions}>
      <button type="button" onClick={onClear}>Clear filters</button>
    </div>
  </aside>
);

export default JobFilters;
