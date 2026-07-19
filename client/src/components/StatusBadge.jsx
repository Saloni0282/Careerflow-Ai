import React from 'react';
import styles from './StatusBadge.module.css';

const StatusBadge = ({ status }) => {
  const key = (status || '').toLowerCase();
  const cls = {
    applied: styles.applied,
    'interview scheduled': styles.scheduled,
    interviewing: styles.interviewing,
    rejected: styles.rejected,
    'offer received': styles.offer,
    joined: styles.joined,
    withdrawn: styles.withdrawn
  }[key] || styles.default;

  return <span className={`${styles.badge} ${cls}`}>{status}</span>;
};

export default StatusBadge;
