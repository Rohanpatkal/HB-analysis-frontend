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
 * Props:
 *   fetcher(userId) — async function that returns the raw analytics payload.
 *   userId          — the logged-in user's ID.
 *
 * Exposed via useDashboard():
 *   period        — { month, year } currently selected
 *   selectPeriod  — change the selected period
 *   data          — shaped data for the selected month
 *   yearData      — aggregated stats for the selected year
 *   globalSummary — backend /summary data: { totalCount, yearMax, yearMin, monthMax, monthMin, years[] }
 *   loading       — true while fetching
 *   error         — error message or null
 *   refresh       — re-fetch from the API (call after logging a habit)
 */
export function DashboardProvider({ children, fetcher, userId }) {
  const now = new Date();

  const [period, setPeriod] = useState({
    month: now.getMonth(),
    year: now.getFullYear(),
  });

  const [raw, setRaw]       = useState(null);
  const [loading, setLoading] = useState(Boolean(fetcher && userId));
  const [error, setError]   = useState(null);
  // Load the full dataset. Called on mount and after a habit is saved.
  const load = useCallback(() => {
    if (!fetcher || !userId) return;

    setLoading(true);
    setError(null);

    fetcher(userId)
      .then((payload) => setRaw(payload))
      .catch((err)    => setError(err?.message ?? "Failed to load data"))
      .finally(()     => setLoading(false));
  }, [fetcher, userId]);

  // Initial fetch when userId becomes available.
  useEffect(() => {
    load();
  }, [load]);

  // Derive the selected month's shaped data from the raw payload.
  const data = useMemo(
    () => getPeriodData(period.month, period.year, raw),
    [period.month, period.year, raw]
  );

  // Derive yearly aggregated stats for the selected year.
  const yearData = useMemo(
    () => getYearData(period.year, raw),
    [period.year, raw]
  );

  // Global summary directly from the backend /summary endpoint.
  const globalSummary = useMemo(() => raw?.summary ?? null, [raw]);

  // Gap stats from backend /gaps endpoint.
  const gapStats = useMemo(() => raw?.gapStats ?? null, [raw]);

  const selectPeriod = useCallback(({ month, year }) => {
    setPeriod({ month, year });
  }, []);

  const value = useMemo(
    () => ({ period, selectPeriod, data, yearData, globalSummary, gapStats, loading, error, refresh: load }),
    [period, selectPeriod, data, yearData, globalSummary, gapStats, loading, error, load]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside a <DashboardProvider>");
  return ctx;
}
