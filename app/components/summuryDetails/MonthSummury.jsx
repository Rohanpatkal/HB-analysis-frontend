"use client";

import styles from "./MonthSummary.module.css";
import { useDashboard } from "../../context/DashboardProvider";

export default function MonthSummary() {
  const { data } = useDashboard();
  const monthName = data.period.monthName;
  const stats = data.summary;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>{monthName}</h2>
        <p>Your monthly recovery overview</p>
      </div>

      <div className={styles.list}>
        {stats.map((item) => (
          <div key={item.title} className={styles.item}>
            <div
              className={styles.icon}
              style={{ background: item.color }}
            >
              {item.icon}
            </div>

            <div className={styles.content}>
              <h3>{item.value}</h3>
              <span>{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
