import styles from './SearchBar.module.css';

const SearchBar = ({ value, onChange, placeholder = 'Search by title or company…' }) => (
  <div className={styles.searchBar}>
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      aria-label="Search jobs"
    />
  </div>
);

export default SearchBar;
