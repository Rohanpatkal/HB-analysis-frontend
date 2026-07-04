"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getPeriodData, getYearData } from "../data/getPeriodData";

const DashboardContext = createContext(null);

/**
 * DashboardProvider — single source of truth for the whole dashboard.
 *
 * Responsibilities:
 *  - Fetches the full analytics payload ONCE on mount via the `fetcher` prop.
 *  - Owns the selected period (month / year).
 *  - Derives every component's data from the raw payload + selected period
 *    using getPeriodData() and getYearData() — no component fetches independently.
 *
 * Usage:
 *   <DashboardProvider fetcher={fetchAnalyticsData}>
 *     <YourComponents />
 *   </DashboardProvider>
 *
 * What components receive via useDashboard():
 *   period        — { month, year } currently selected
 *   selectPeriod  — fn({ month, year }) to change the selected period
 *   data          — shaped data for the selected month (calendar, summary, etc.)
 *   yearData      — aggregated stats for the selected year
 *   loading       — true while the initial fetch is in progress
 *   error         — error message string if the fetch failed, else null
 */
export function DashboardProvider({ children, fetcher }) {
  const now = new Date();

  // Selected period — changing this re-derives data from the already-fetched payload.
  const [period, setPeriod] = useState({
    month: now.getMonth(),
    year: now.getFullYear(),
  });

  // The raw API payload — fetched once, reused for every period change.
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(Boolean(fetcher));
  const [error, setError] = useState(null);

  // Fetch the full dataset once on mount.
  // The API returns ALL years/months in one response, so we only need one call.
  useEffect(() => {
    if (!fetcher) return;

    let active = true;
    setLoading(true);
    setError(null);

    Promise.resolve(fetcher())
      .then((payload) => {
        if (active) setRaw(payload);
      })
      .catch((err) => {
        if (active) setError(err?.message ?? "Failed to load data");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [fetcher]); // runs once — fetcher ref is stable

  // Derive the selected month's data from the raw payload.
  // Recomputes instantly (no network call) whenever period changes.
  const data = useMemo(
    () => getPeriodData(period.month, period.year, raw),
    [period.month, period.year, raw]
  );

  // Derive yearly aggregates for the selected year.
  const yearData = useMemo(
    () => getYearData(period.year, raw),
    [period.year, raw]
  );

  const selectPeriod = useCallback(({ month, year }) => {
    setPeriod({ month, year });
  }, []);

  const value = useMemo(
    () => ({ period, selectPeriod, data, yearData, loading, error }),
    [period, selectPeriod, data, yearData, loading, error]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used inside a <DashboardProvider>");
  }
  return ctx;
}
