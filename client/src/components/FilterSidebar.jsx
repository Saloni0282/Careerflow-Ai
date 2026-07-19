import styles from './FilterSidebar.module.css';

const FilterSidebar = ({ filters, onChange, onClear }) => (
  <aside className={styles.sidebar}>
    <div className={styles.filterGroup}>
      <h3>Search</h3>
      <input
        type="text"
        value={filters.search}
        onChange={(event) => onChange('search', event.target.value)}
        placeholder="Title or company"
      />
    </div>

    <div className={styles.filterGroup}>
      <h3>Category</h3>
      <select value={filters.category} onChange={(event) => onChange('category', event.target.value)}>
        <option value="">All</option>
        {filters.categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>

    <div className={styles.filterGroup}>
      <h3>Experience</h3>
      <select value={filters.experienceLevel} onChange={(event) => onChange('experienceLevel', event.target.value)}>
        <option value="">Any</option>
        {filters.experienceLevels.map((level) => (
          <option key={level} value={level}>{level}</option>
        ))}
      </select>
    </div>

    <div className={styles.filterGroup}>
      <h3>Work mode</h3>
      <select value={filters.workMode} onChange={(event) => onChange('workMode', event.target.value)}>
        <option value="">Any</option>
        {filters.workModes.map((mode) => (
          <option key={mode} value={mode}>{mode}</option>
        ))}
      </select>
    </div>

    <div className={styles.filterGroup}>
      <h3>Employment type</h3>
      <select value={filters.employmentType} onChange={(event) => onChange('employmentType', event.target.value)}>
        <option value="">Any</option>
        {filters.employmentTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>

    <button type="button" className={styles.clearButton} onClick={onClear}>
      Clear filters
    </button>
  </aside>
);

export default FilterSidebar;
