import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPage }) => {
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className={styles.container}>
      <button onClick={() => onPage(currentPage - 1)} disabled={currentPage <= 1}>Previous</button>
      {pages.map((p) => (
        <button key={p} className={p === currentPage ? styles.active : ''} onClick={() => onPage(p)}>{p}</button>
      ))}
      <button onClick={() => onPage(currentPage + 1)} disabled={currentPage >= totalPages}>Next</button>
    </div>
  );
};

export default Pagination;
