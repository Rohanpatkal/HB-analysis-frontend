"use client";

import { useState } from "react";
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

// ── Rank constants ────────────────────────────────────────────────────────────
const RANK_CLASSES = [styles.rank1, styles.rank2, styles.rank3, styles.rank4, styles.rank5];
const RANK_MEDALS  = ["🥇", "🥈", "🥉", "4th", "5th"];

// ── Gap rows ──────────────────────────────────────────────────────────────────
// Pure count-based gaps: a gap = consecutive days with count === 0.
// No yellow/affected-day logic. Ranked highest occurrence count → lowest.
function GapRows({ gapResult, emptyLabel }) {
  if (!gapResult || !gapResult.top5 || gapResult.top5.length === 0) {
    return <p className={styles.gapEmpty}>{emptyLabel ?? "No gap data available"}</p>;
  }
  const { average, top5 } = gapResult;
  const maxC = top5[0].count; // rank-1 always has the highest count

  return (
    <>
      <div className={styles.gapAverage}>
        <span className={styles.gapAverageValue}>{average}</span>
        <span className={styles.gapAverageLabel}>days — average gap length</span>
      </div>
      <div className={styles.gapRows}>
        {top5.map((item, i) => (
          <div className={styles.gapRow} key={item.gap}>
            <span className={`${styles.gapRank} ${RANK_CLASSES[i]}`} title={`Rank ${i + 1}`}>
              {RANK_MEDALS[i]}
            </span>
            <div className={styles.gapBarWrap}>
              <div className={styles.gapBarMeta}>
                <span className={styles.gapBarLabel}>
                  {item.gap} day{item.gap !== 1 ? "s" : ""} gap
                </span>
                <span className={styles.gapBarCount}>
                  {item.count}
                </span>
              </div>
              <div className={styles.gapBarOuter}>
                <div
                  className={styles.gapBarInner}
                  style={{ width: `${(item.count / maxC) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Details() {
  const { data, yearData, period, globalSummary, gapStats } = useDashboard();
  const d = data.details;

  const maxSmokeFree = Math.max(...yearData.months.map((m) => m.smokeFreeDays), 1);

  // Get per-year gap result from backend data
  const yearGapResult  = gapStats?.yearlyGaps?.[String(period.year)] ?? null;
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
      {/* A gap = consecutive days with count=0 between two smoking days.         */}
      {/* No yellow/affected logic — pure raw count data from backend.            */}
      <section className={styles.panel} aria-labelledby="gap-analysis-heading">
        <div className={styles.panelHead}>
          <div>
            <h2 id="gap-analysis-heading" className={styles.panelTitle}>📊 Gap Analysis</h2>
            <p>Days between cigarettes — top 5 streak lengths by frequency</p>
          </div>
          <span className={`${styles.badge} ${styles.flat}`}>
            highest count → 1st
          </span>
        </div>

        {/* ── Per-year top 5 ──────────────────────────────────────────────── */}
        <div>
          <div className={styles.gapSectionTitle}>
            📅 {period.year}
            <span className={styles.gapSectionSub}>ranked by occurrence count</span>
          </div>
          <GapRows
            gapResult={yearGapResult}
            emptyLabel={`No gap data for ${period.year}`}
          />
        </div>

        {/* ── All-time global top 5 ────────────────────────────────────────── */}
        <div style={{ marginTop: "28px", borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
          <div className={styles.gapSectionTitle}>
            🌍 All Time
            <span className={styles.gapSectionSub}>ranked by occurrence count</span>
          </div>
          <GapRows
            gapResult={globalGapResult}
            emptyLabel="No global gap data available"
          />
        </div>

      </section>
    </div>
  );
}
