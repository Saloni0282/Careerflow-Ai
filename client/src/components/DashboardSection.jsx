import React from 'react';
import styles from './DashboardSection.module.css';

const DashboardSection = ({ title, children }) => (
  <section className={styles.section}>
    <div className={styles.header}>
      <h2>{title}</h2>
    </div>
    <div className={styles.body}>{children}</div>
  </section>
);

export default DashboardSection;
