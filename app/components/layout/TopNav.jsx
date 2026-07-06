"use client";

import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import VisitorCounter from "./VisitorCounter";
import styles from "./layout.module.css";

export default function TopNav({ onLogHabit }) {
  const { logout } = useUser();
  const router = useRouter();

  function handleSignOut() {
    logout();
    router.push("/login");
  }

  return (
    <header className={styles.topNav}>
      {/* Brand */}
      <div className={styles.brand} aria-label="HabitBack home">
        <span className={styles.brandLogo} aria-hidden="true">🌿</span>
        <span className={styles.brandName}>HabitBack</span>
      </div>

      {/* Navigation actions */}
      <nav aria-label="Main navigation" className={styles.navActions}>

        {/* Visitor counter — hidden on very small screens via CSS */}
        <div className={styles.visitorWrap} aria-hidden="true">
          <VisitorCounter />
        </div>

        <button
          className={styles.logBtn}
          onClick={onLogHabit}
          type="button"
          aria-label="Log a habit entry"
        >
          <span aria-hidden="true">✚</span> Log Habit
        </button>

        <button
          className={styles.signOutBtn}
          onClick={handleSignOut}
          type="button"
          aria-label="Sign out of HabitBack"
        >
          Sign Out
        </button>

      </nav>
    </header>
  );
}
