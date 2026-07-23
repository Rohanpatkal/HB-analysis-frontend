"use client";

import styles from "./Details.module.css";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useDashboard } from "../../context/DashboardProvider";
import { formatINR } from "../../utils/analytics.common";

// ── Trend badge ───────────────────────────────────────────────────────────────
function TrendBadge({ delta, unit = "%" }) {
  if (delta > 0) return <span className={`${styles.badge} ${styles.up}`}><TrendingUp size={15} /> +{delta}{unit} vs prev</span>;
  if (delta < 0) return <span className={`${styles.badge} ${styles.down}`}><TrendingDown size={15} /> {delta}{unit} vs prev</span>;
  return <span className={`${styles.badge} ${styles.flat}`}><Minus size={15} /> no change</span>;
}

// ── Stat tile ─────────────────────────────────────────────────────────────────
function Tile({ color, label, value, sub }) {
  return (
    <div className={styles.tile}>
      <div className={styles.tileLabel}><span className={styles.dot} style={{ background: color }}></span>{label}</div>
      <div className={styles.tileValue}>{value}</div>
      {sub ? <div className={styles.tileSub}>{sub}</div> : null}
    </div>
  );
}

function formatMonthKey(key) {
  if (!key) return "—";
  const [mm, yyyy] = key.split("/");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(mm, 10) - 1] ?? mm} ${yyyy}`;
}

// ── Gap leaderboard ───────────────────────────────────────────────────────────
// Ranks gap lengths by how often they occurred (highest count = Rank 1)
const RANK_CONFIG = [
  { medal: "🥇", bg: "linear-gradient(135deg,#fef9c3,#fde68a)", border: "#fcd34d", countBg: "#f59e0b", countColor: "#fff" },
  { medal: "🥈", bg: "linear-gradient(135deg,#f1f5f9,#e2e8f0)", border: "#cbd5e1", countBg: "#64748b", countColor: "#fff" },
  { medal: "🥉", bg: "linear-gradient(135deg,#fef3c7,#fde68a)", border: "#fcd34d", countBg: "#d97706", countColor: "#fff" },
  { medal: "4",  bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)", border: "#bbf7d0", countBg: "#22c55e", countColor: "#fff" },
  { medal: "5",  bg: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "#bfdbfe", countBg: "#3b82f6", countColor: "#fff" },
];

function GapLeaderboard({ gapResult, emptyLabel }) {
  if (!gapResult || !gapResult.top5 || gapResult.top5.length === 0) {
    return (
      <div className={styles.gapEmpty}>
        <span className={styles.gapEmptyIcon}>📭</span>
        <span>{emptyLabel ?? "No gap data available"}</span>
      </div>
    );
  }

  const { average, top5 } = gapResult;
  const maxCount = top5[0].count; // rank 1 always has highest count

  return (
    <div className={styles.gapLeaderboard}>
      {/* Average pill */}
      <div className={styles.gapAveragePill}>
        <span className={styles.gapAvgNum}>{average}</span>
        <span className={styles.gapAvgLabel}>days avg gap</span>
      </div>

      {/* Rank cards */}
      <div className={styles.gapCards}>
        {top5.map((item, i) => {
          const cfg = RANK_CONFIG[i];
          const pct = Math.round((item.count / maxCount) * 100);
          return (
            <div
              key={item.gap}
              className={styles.gapCard}
              style={{ background: cfg.bg, borderColor: cfg.border }}
            >
              {/* Medal */}
              <div className={styles.gapCardMedal}>{cfg.medal}</div>

              {/* Gap length — main info */}
              <div className={styles.gapCardCenter}>
                <span className={styles.gapCardDays}>{item.gap}</span>
                <span className={styles.gapCardDaysLabel}>day{item.gap !== 1 ? "s" : ""}</span>
              </div>

              {/* Count badge — prominently displayed */}
              <div
                className={styles.gapCardCount}
                style={{ background: cfg.countBg, color: cfg.countColor }}
                title={`Occurred ${item.count} time${item.count !== 1 ? "s" : ""}`}
              >
                {item.count}
              </div>

              {/* Progress bar showing relative frequency */}
              <div className={styles.gapCardBar}>
                <div
                  className={styles.gapCardBarFill}
                  style={{
                    width: `${pct}%`,
                    background: cfg.countBg,
                    opacity: 0.4,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Details() {
  const { data, yearData, period, globalSummary, gapStats } = useDashboard();
  const d = data.details;

  const maxSmokeFree = Math.max(...yearData.months.map((m) => m.smokeFreeDays), 1);

  const yearGapResult   = gapStats?.yearlyGaps?.[String(period.year)] ?? null;
  const globalGapResult = gapStats?.globalGaps ?? null;

  return (
    <div className={styles.wrapper} aria-label="Detailed analytics">

      {/* ── All-Time Summary ─────────────────────────────────────────────────── */}
      {globalSummary && (
        <section className={styles.panel} aria-labelledby="global-summary-heading">
          <div className={styles.panelHead}>
            <div>
              <h2 id="global-summary-heading" className={styles.panelTitle}>🌍 All-Time Summary</h2>
              <p>Across all {globalSummary.totalYears} year{globalSummary.totalYears !== 1 ? "s" : ""} of data</p>
            </div>
            <span className={`${styles.badge} ${styles.flat}`}>{globalSummary.totalMonths} months logged</span>
          </div>
          <div className={styles.grid}>
            <Tile color="#0ea5e9" label="Total Cigarettes" value={globalSummary.totalCount.toLocaleString()} sub="all time" />
            <Tile color="#ef4444" label="Worst Year"  value={globalSummary.yearMax.year}  sub={`${globalSummary.yearMax.count.toLocaleString()} cigarettes`} />
            <Tile color="#22c55e" label="Best Year"   value={globalSummary.yearMin.year}  sub={`${globalSummary.yearMin.count.toLocaleString()} cigarettes`} />
            <Tile color="#f43f5e" label="Worst Month" value={formatMonthKey(globalSummary.monthMax.month)} sub={`${globalSummary.monthMax.count.toLocaleString()} cigarettes`} />
            <Tile color="#10b981" label="Best Month"  value={formatMonthKey(globalSummary.monthMin.month)} sub={`${globalSummary.monthMin.count.toLocaleString()} cigarettes`} />
          </div>
        </section>
      )}

      {/* ── Monthly Details ───────────────────────────────────────────────────── */}
      <section className={styles.panel} aria-labelledby="monthly-details-heading">
        <div className={styles.panelHead}>
          <div><h2 id="monthly-details-heading" className={styles.panelTitle}>Monthly Details</h2><p>{data.period.monthName}</p></div>
          <TrendBadge delta={d.recoveryImprovement} />
        </div>
        <div className={styles.grid}>
          <Tile color="#3b82f6" label="Total Days"     value={d.totalDays} />
          <Tile color="#22c55e" label="Smoke-Free"     value={d.smokeFreeDays} sub={`${d.recoveryScore}% of month`} />
          <Tile color="#f59e0b" label="Reduced"        value={d.reducedDays}   sub="affected days" />
          <Tile color="#ef4444" label="Smoking"        value={d.smokingDays} />
          <Tile color="#10b981" label="Longest Gap"    value={`${d.maxGap} days`}      sub="best smoke-free run" />
          <Tile color="#8b5cf6" label="Shortest Gap"   value={`${d.minGap} days`}      sub="shortest run" />
          <Tile color="#0ea5e9" label="Current Streak" value={`${d.currentStreak} days`} />
          <Tile color="#16a34a" label="Money Saved"    value={formatINR(d.moneySaved)} />
        </div>
      </section>

      {/* ── Yearly Details ────────────────────────────────────────────────────── */}
      <section className={styles.panel} aria-labelledby="yearly-details-heading">
        <div className={styles.panelHead}>
          <div><h2 id="yearly-details-heading" className={styles.panelTitle}>Yearly Details</h2><p>Overview for {period.year}</p></div>
          <TrendBadge delta={yearData.improvement} />
        </div>
        <div className={styles.grid}>
          <Tile color="#3b82f6" label="Total Days"     value={yearData.totalDays} />
          <Tile color="#22c55e" label="Smoke-Free"     value={yearData.totalSmokeFree} sub={`avg ${yearData.avgRecovery}% recovery`} />
          <Tile color="#f59e0b" label="Reduced"        value={yearData.totalReduced} />
          <Tile color="#ef4444" label="Smoking"        value={yearData.totalSmoking} />
          <Tile color="#10b981" label="Longest Streak" value={`${yearData.longestStreak} days`} sub="max gap this year" />
          <Tile color="#8b5cf6" label="Shortest Gap"   value={`${yearData.shortestGap} days`}   sub="min gap this year" />
          <Tile color="#0ea5e9" label="Best Month"     value={yearData.bestMonth.name}     sub={`${yearData.bestMonth.smokeFreeDays} smoke-free`} />
          <Tile color="#f43f5e" label="Toughest Month" value={yearData.toughestMonth.name} sub={`${yearData.toughestMonth.smokingDays} smoking`} />
          <Tile color="#16a34a" label="Money Saved"    value={yearData.totalMoneySavedLabel} />
        </div>
        <div className={styles.chart}>
          <div className={styles.chartTitle}>Smoke-free days per month</div>
          <div className={styles.bars}>
            {yearData.months.map((m) => (
              <div className={styles.barCol} key={m.month}>
                <div className={styles.bar} style={{ height: `${(m.smokeFreeDays / maxSmokeFree) * 100}%` }} title={`${m.name}: ${m.smokeFreeDays} smoke-free days`} />
                <span className={styles.barLabel}>{m.name.charAt(0)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gap Analysis ─────────────────────────────────────────────────────── */}
      <section className={styles.panel} aria-labelledby="gap-analysis-heading">
        <div className={styles.panelHead}>
          <div>
            <h2 id="gap-analysis-heading" className={styles.panelTitle}>📊 Gap Analysis</h2>
            <p>Days between cigarettes — ranked by how often each gap length occurred</p>
          </div>
        </div>

        {/* ── Per-year ──────────────────────────────────────────────────────── */}
        <div className={styles.gapSection}>
          <div className={styles.gapSectionTitle}>
            📅 {period.year}
            <span className={styles.gapSectionSub}>highest count = Rank 1</span>
          </div>
          <GapLeaderboard
            gapResult={yearGapResult}
            emptyLabel={`No gap data for ${period.year}`}
          />
        </div>

        {/* ── All-time ──────────────────────────────────────────────────────── */}
        <div className={styles.gapSection} style={{ borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
          <div className={styles.gapSectionTitle}>
            🌍 All Time
            <span className={styles.gapSectionSub}>highest count = Rank 1</span>
          </div>
          <GapLeaderboard
            gapResult={globalGapResult}
            emptyLabel="No global gap data available"
          />
        </div>
      </section>
    </div>
  );
}
