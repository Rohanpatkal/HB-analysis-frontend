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
 * Master data provider for the whole dashboard.
 *
 * - Owns the selected period (month/year).
 * - Optionally fetches raw data via a `fetcher(month, year)` prop.
 * - Runs everything through getPeriodData() so every component receives
 *   the same derived shape (calendar, summary, highlights, achievements).
 *
 * Plug in a real API by passing a fetcher:
 *   <DashboardProvider fetcher={(m, y) => api.getMonth(m, y)}>
 * When no fetcher is given, data is generated locally.
 */
export function DashboardProvider({ children, fetcher }) {
  const now = new Date();

  const [period, setPeriod] = useState({
    month: now.getMonth(),
    year: now.getFullYear(),
  });
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch raw data whenever the period changes (only if a fetcher exists).
  useEffect(() => {
    if (!fetcher) return;

    let active = true;
    setLoading(true);
    setError(null);

    Promise.resolve(fetcher(period.month, period.year))
      .then((payload) => {
        if (active) setRaw(payload);
      })
      .catch((err) => {
        if (active) setError(err?.message ?? "Failed to load data");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [fetcher, period.month, period.year]);

  // Single source of truth: derive everything from period + raw data.
  const data = useMemo(
    () => getPeriodData(period.month, period.year, raw),
    [period.month, period.year, raw]
  );

  // Yearly aggregation for the currently selected year.
  const yearData = useMemo(() => getYearData(period.year), [period.year]);

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
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return ctx;
}
