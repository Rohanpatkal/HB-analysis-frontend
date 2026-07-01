"use client";

import styles from "./RecoveryHighlights.module.css";
import { Trophy } from "lucide-react";
import { useDashboard } from "../../context/DashboardProvider";

export default function RecoveryHighlights() {
  const { data } = useDashboard();
  const monthName = data.period.monthName;
  const {
    level = 1,
    nextBadgePercent = 0,
    daysRemaining = 0,
    stats = [],
  } = data.highlights ?? {};

  return (
    <section className={styles.hero}>
      <div className={styles.glow}></div>

      <div className={styles.header}>
        <div>
          <h2>🏆 Recovery Highlights</h2>
          <p>{monthName ? `${monthName} overview` : "Your recovery journey"}</p>
        </div>

        <div className={styles.level}>
          <Trophy size={18} />
          <span>Level {level}</span>
        </div>
      </div>

      <div className={styles.stats}>
        {stats.map((item) => (
          <div className={styles.stat} key={item.key ?? item.label}>
            <div className={styles.icon} style={{ background: item.color }}>
              {item.label?.charAt(0)}
            </div>

            <div>
              <h3>{item.value}</h3>
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <span>Next Badge</span>
          <span>{nextBadgePercent}%</span>
        </div>

        <div className={styles.progress}>
          <div
            className={styles.progressFill}
            style={{ width: `${nextBadgePercent}%` }}
          ></div>
        </div>

        <small>
          {daysRemaining} days remaining to unlock 100 Day Champion 🏅
        </small>
      </div>

      <div className={styles.record}>
        🎉 <strong>Personal Best!</strong> You achieved your longest
        smoke-free streak.
      </div>
    </section>
  );
}
