"use client";

import styles from "./MonthSummary.module.css";
import { useDashboard } from "../../context/DashboardProvider";
import { formatINR } from "../../utils/analytics.common";

// ── Recovery score ring ───────────────────────────────────────────────────────
function ScoreRing({ score }) {
  const r   = 44;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;

  const color =
    score >= 70 ? "#10b981" :
    score >= 40 ? "#f59e0b" :
                  "#ef4444";

  return (
    <div className={styles.ringWrap} aria-label={`Recovery score ${score}%`}>
      <svg width="110" height="110" viewBox="0 0 110 110" aria-hidden="true">
        {/* Track */}
        <circle cx="55" cy="55" r={r} fill="none" stroke="#e2e8f0" strokeWidth="9" />
        {/* Fill */}
        <circle
          cx="55" cy="55" r={r}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`}
          strokeDashoffset={circ * 0.25}   /* start at top */
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className={styles.ringLabel}>
        <span className={styles.ringScore} style={{ color }}>{score}%</span>
        <span className={styles.ringText}>Recovery</span>
      </div>
    </div>
  );
}

// ── Individual stat tile ──────────────────────────────────────────────────────
function Tile({ icon, label, value, sub, accent }) {
  return (
    <div className={styles.tile}>
      <span className={styles.tileIcon} style={{ background: accent }} aria-hidden="true">
        {icon}
      </span>
      <div className={styles.tileBody}>
        <span className={styles.tileValue}>{value}</span>
        <span className={styles.tileLabel}>{label}</span>
        {sub && <span className={styles.tileSub}>{sub}</span>}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MonthSummary() {
  const { data } = useDashboard();
  const { monthName } = data.period;
  const s = data.summary;

  const trend = s.recoveryImprovement;
  const trendLabel =
    trend > 0  ? `▲ +${trend}% vs last month` :
    trend < 0  ? `▼ ${trend}% vs last month`  :
                 "→ Same as last month";
  const trendClass =
    trend > 0  ? styles.trendUp   :
    trend < 0  ? styles.trendDown :
                 styles.trendFlat;

  // Smoke-free progress bar width
  const freePct = s.daysInMonth > 0
    ? Math.round((s.smokeFreeDays / s.daysInMonth) * 100)
    : 0;

  return (
    <section className={styles.card} aria-labelledby="month-summary-heading">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div>
          <h2 id="month-summary-heading">{monthName}</h2>
          <p>Recovery snapshot</p>
        </div>
        <span className={`${styles.trend} ${trendClass}`} aria-live="polite">
          {trendLabel}
        </span>
      </div>

      {/* ── Score ring + top stats ──────────────────────────────────────────── */}
      <div className={styles.hero}>
        <ScoreRing score={s.recoveryScore} />

        <div className={styles.heroStats}>
          <Tile icon="🔥" label="Current Streak"  value={`${s.currentStreak}d`}  accent="#22c55e" />
          <Tile icon="🏆" label="Best Streak"      value={`${s.longestStreak}d`}  accent="#f59e0b" />
          <Tile icon="💰" label="Money Saved"      value={formatINR(s.moneySaved)} accent="#10b981" />
        </div>
      </div>

      {/* ── Smoke-free progress bar ─────────────────────────────────────────── */}
      <div className={styles.progressWrap} aria-label={`${freePct}% smoke-free this month`}>
        <div className={styles.progressHeader}>
          <span>🚭 Smoke-free days</span>
          <span className={styles.progressCount}>
            {s.smokeFreeDays} / {s.daysInMonth}
          </span>
        </div>
        <div className={styles.progressTrack} role="progressbar" aria-valuenow={freePct} aria-valuemin={0} aria-valuemax={100}>
          <div className={styles.progressFill} style={{ width: `${freePct}%` }} />
        </div>
        <div className={styles.progressSubs}>
          <span>🟡 {s.reducedDays} reduced</span>
          <span>🚬 {s.smokingDays} smoked</span>
        </div>
      </div>

      {/* ── Key detail grid ─────────────────────────────────────────────────── */}
      <div className={styles.grid}>
        <Tile
          icon="📊"
          label="Total Cigarettes"
          value={s.totalCount}
          sub={s.avgPerSmokingDay > 0 ? `~${s.avgPerSmokingDay}/smoking day` : undefined}
          accent="#0ea5e9"
        />
        <Tile
          icon="❤️"
          label="Habit Breaks"
          value={s.totalBreaks}
          sub="HB attempts"
          accent="#ec4899"
        />
        <Tile
          icon="📅"
          label="Days Logged"
          value={s.daysLogged}
          sub={`of ${s.daysInMonth} days`}
          accent="#8b5cf6"
        />
        <Tile
          icon="⚠️"
          label="Peak Day"
          value={s.peakDay.count > 0 ? `${s.peakDay.count} cigs` : "—"}
          sub={s.peakDay.count > 0 ? s.peakDay.label : "no data"}
          accent="#ef4444"
        />
      </div>

    </section>
  );
}
