"use client";

import { useUser } from "../../context/UserContext";
import styles from "./layout.module.css";

export default function TopNav({ onLogHabit }) {
  const { logout } = useUser();

  return (
    <header className={styles.topNav}>
      {/* Brand */}
      <div className={styles.brand}>
        <span className={styles.brandLogo} aria-hidden="true">🌿</span>
        <span className={styles.brandName}>HabitBack</span>
      </div>

      {/* Actions */}
      <div className={styles.navActions}>
        <button
          className={styles.logBtn}
          onClick={onLogHabit}
          aria-label="Log a habit"
        >
          <span aria-hidden="true">✚</span> Log Habit
        </button>

        <button
          className={styles.signOutBtn}
          onClick={logout}
          aria-label="Sign out"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
