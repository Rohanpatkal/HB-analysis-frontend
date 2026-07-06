"use client";

import styles from "./MonthSummary.module.css";
import { useDashboard } from "../../context/DashboardProvider";

export default function MonthSummary() {
  const { data } = useDashboard();
  const monthName = data.period.monthName;
  const stats = data.summary;

  return (
    <section className={styles.card} aria-labelledby="month-summary-heading">
      <div className={styles.header}>
        <h2 id="month-summary-heading">{monthName}</h2>
        <p>Your monthly recovery overview</p>
      </div>

      <ul className={styles.list} aria-label="Monthly recovery statistics">
        {stats.map((item) => (
          <li key={item.title} className={styles.item}>
            <div
              className={styles.icon}
              style={{ background: item.color }}
              aria-hidden="true"
            >
              {item.icon}
            </div>

            <div className={styles.content}>
              <h3>{item.value}</h3>
              <span>{item.title}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
