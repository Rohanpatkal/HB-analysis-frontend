"use client";

import styles from "./Details.module.css";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useDashboard } from "../../context/DashboardProvider";
import { formatINR } from "../../utils/analytics.common";

function TrendBadge({ delta, unit = "%" }) {
  if (delta > 0) {
    return (
      <span className={`${styles.badge} ${styles.up}`}>
        <TrendingUp size={15} /> +{delta}
        {unit} vs prev
      </span>
    );
  }
  if (delta < 0) {
    return (
      <span className={`${styles.badge} ${styles.down}`}>
        <TrendingDown size={15} /> {delta}
        {unit} vs prev
      </span>
    );
  }
  return (
    <span className={`${styles.badge} ${styles.flat}`}>
      <Minus size={15} /> no change
    </span>
  );
}

function Tile({ color, label, value, sub }) {
  return (
    <div className={styles.tile}>
      <div className={styles.tileLabel}>
        <span className={styles.dot} style={{ background: color }}></span>
        {label}
      </div>
      <div className={styles.tileValue}>{value}</div>
      {sub ? <div className={styles.tileSub}>{sub}</div> : null}
    </div>
  );
}

export default function Details() {
  const { data, yearData, period } = useDashboard();
  const d = data.details;

  const maxSmokeFree = Math.max(...yearData.months.map((m) => m.smokeFreeDays), 1);

  return (
    <div className={styles.wrapper}>
      {/* Monthly details */}
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <h3>Monthly Details</h3>
            <p>{data.period.monthName}</p>
          </div>
          <TrendBadge delta={d.recoveryImprovement} />
        </div>

        <div className={styles.grid}>
          <Tile color="#3b82f6" label="Total Days" value={d.totalDays} />
          <Tile color="#22c55e" label="Smoke-Free" value={d.smokeFreeDays} sub={`${d.recoveryScore}% of month`} />
          <Tile color="#f59e0b" label="Reduced" value={d.reducedDays} sub="affected days" />
          <Tile color="#ef4444" label="Smoking" value={d.smokingDays} />
          <Tile color="#10b981" label="Longest Gap" value={`${d.maxGap} days`} sub="best smoke-free run" />
          <Tile color="#8b5cf6" label="Shortest Gap" value={`${d.minGap} days`} sub="shortest run" />
          <Tile color="#0ea5e9" label="Current Streak" value={`${d.currentStreak} days`} />
          <Tile color="#16a34a" label="Money Saved" value={formatINR(d.moneySaved)} />
        </div>
      </div>

      {/* Yearly details */}
      <div className={styles.panel}>
        <div className={styles.panelHead}>
          <div>
            <h3>Yearly Details</h3>
            <p>Overview for {period.year}</p>
          </div>
          <TrendBadge delta={yearData.improvement} />
        </div>

        <div className={styles.grid}>
          <Tile color="#3b82f6" label="Total Days" value={yearData.totalDays} />
          <Tile color="#22c55e" label="Smoke-Free" value={yearData.totalSmokeFree} sub={`avg ${yearData.avgRecovery}% recovery`} />
          <Tile color="#f59e0b" label="Reduced" value={yearData.totalReduced} />
          <Tile color="#ef4444" label="Smoking" value={yearData.totalSmoking} />
          <Tile color="#10b981" label="Longest Streak" value={`${yearData.longestStreak} days`} sub="max gap this year" />
          <Tile color="#8b5cf6" label="Shortest Gap" value={`${yearData.shortestGap} days`} sub="min gap this year" />
          <Tile color="#0ea5e9" label="Best Month" value={yearData.bestMonth.name} sub={`${yearData.bestMonth.smokeFreeDays} smoke-free`} />
          <Tile color="#f43f5e" label="Toughest Month" value={yearData.toughestMonth.name} sub={`${yearData.toughestMonth.smokingDays} smoking`} />
          <Tile color="#16a34a" label="Money Saved" value={yearData.totalMoneySavedLabel} />
        </div>

        {/* Mini month-by-month chart */}
        <div className={styles.chart}>
          <div className={styles.chartTitle}>Smoke-free days per month</div>
          <div className={styles.bars}>
            {yearData.months.map((m) => (
              <div className={styles.barCol} key={m.month}>
                <div
                  className={styles.bar}
                  style={{ height: `${(m.smokeFreeDays / maxSmokeFree) * 100}%` }}
                  title={`${m.name}: ${m.smokeFreeDays} smoke-free days`}
                ></div>
                <span className={styles.barLabel}>{m.name.charAt(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
