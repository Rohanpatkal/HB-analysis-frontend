"use client";
// Full-page error state with retry button.

import styles from "./ui.module.css";

export default function ErrorScreen({ message, onRetry }) {
  return (
    <div className={styles.loadingPage}>
      <div className={styles.errorCard}>
        <span className={styles.errorIcon} aria-hidden="true">⚠️</span>
        <h2 className={styles.errorTitle}>Something went wrong</h2>
        <p className={styles.errorMessage}>{message || "Failed to load data."}</p>
        {onRetry && (
          <button className={styles.retryBtn} onClick={onRetry}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
