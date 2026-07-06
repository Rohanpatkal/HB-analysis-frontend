"use client";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useDashboard } from "../context/DashboardProvider";
import { MONTHS } from "../utils/analytics.common";

export default function AnalyticsFilter() {
  const { period, selectPeriod, globalSummary } = useDashboard();
  const { month, year } = period;

  // Use real years from the backend /summary response.
  // Fall back to current year only if summary hasn't loaded yet.
  const currentYear = new Date().getFullYear();
  const years = Array.isArray(globalSummary?.years) && globalSummary.years.length > 0
    ? [...globalSummary.years].map(Number).sort((a, b) => b - a) // descending
    : [currentYear];

  const goToPreviousMonth = () => {
    selectPeriod(month === 0 ? { month: 11, year: year - 1 } : { month: month - 1, year });
  };

  const goToNextMonth = () => {
    selectPeriod(month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year });
  };

  const goToToday = () => {
    const now = new Date();
    selectPeriod({ month: now.getMonth(), year: now.getFullYear() });
  };

  return (
    <section aria-labelledby="analytics-period-heading" className="rounded-3xl border bg-white shadow-sm p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-3 rounded-2xl" aria-hidden="true">
            <CalendarDays className="text-emerald-600" size={22} />
          </div>
          <div>
            <h2 id="analytics-period-heading" className="font-bold text-xl">Analytics Period</h2>
            <p className="text-sm text-gray-500">Select any month and year</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex w-full sm:w-auto flex-wrap items-center gap-3" role="group" aria-label="Period navigation">

          <button
            onClick={goToPreviousMonth}
            type="button"
            className="h-11 w-11 rounded-xl border hover:bg-gray-100 transition"
            aria-label="Previous month"
          >
            <ChevronLeft className="mx-auto" size={18} aria-hidden="true" />
          </button>

          <label htmlFor="month-select" className="sr-only">Month</label>
          <select
            id="month-select"
            value={month}
            onChange={(e) => selectPeriod({ month: Number(e.target.value), year })}
            className="h-11 flex-1 sm:flex-none min-w-0 rounded-xl border px-4 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {MONTHS.map((name, index) => (
              <option key={name} value={index}>{name}</option>
            ))}
          </select>

          <label htmlFor="year-select" className="sr-only">Year</label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => selectPeriod({ month, year: Number(e.target.value) })}
            className="h-11 flex-1 sm:flex-none min-w-0 rounded-xl border px-4 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <button
            onClick={goToToday}
            type="button"
            className="rounded-xl bg-emerald-500 px-5 h-11 text-white hover:bg-emerald-600 transition"
            aria-label="Go to current month"
          >
            Today
          </button>

          <button
            onClick={goToNextMonth}
            type="button"
            className="h-11 w-11 rounded-xl border hover:bg-gray-100 transition"
            aria-label="Next month"
          >
            <ChevronRight className="mx-auto" size={18} aria-hidden="true" />
          </button>

        </div>
      </div>
    </section>
  );
}
