import React from 'react';
import styles from './LoadingSkeleton.module.css';

const LoadingSkeleton = ({ count = 5 }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={styles.skel} />
    ))}
  </div>
);

export default LoadingSkeleton;
