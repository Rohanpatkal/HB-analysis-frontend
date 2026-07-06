"use client";
// Full-page loading state shown while the dashboard fetches data.

import styles from "./ui.module.css";

export default function LoadingScreen({ message = "Loading your data…" }) {
  return (
    <div className={styles.loadingPage}>
      <div className={styles.loadingCard}>
        <div className={styles.loadingSpinner} aria-hidden="true" />
        <p className={styles.loadingText}>{message}</p>
      </div>
    </div>
  );
}
