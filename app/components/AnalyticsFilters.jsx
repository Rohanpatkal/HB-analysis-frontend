"use client";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useDashboard } from "../context/DashboardProvider";
import { MONTHS } from "../utils/analytics.common";

export default function AnalyticsFilter({ startYear = 2020 }) {
  const { period, selectPeriod } = useDashboard();
  const { month, year } = period;

  // Build the year dropdown list from startYear up to 5 years from now.
  const maxYear = new Date().getFullYear() + 5;
  const years = Array.from(
    { length: maxYear - startYear + 1 },
    (_, i) => maxYear - i
  );

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
    <div className="rounded-3xl border bg-white shadow-sm p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-3 rounded-2xl">
            <CalendarDays className="text-emerald-600" size={22} />
          </div>
          <div>
            <h2 className="font-bold text-xl">Analytics Period</h2>
            <p className="text-sm text-gray-500">Select any month and year</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex w-full sm:w-auto flex-wrap items-center gap-3">

          <button
            onClick={goToPreviousMonth}
            className="h-11 w-11 rounded-xl border hover:bg-gray-100 transition"
            aria-label="Previous month"
          >
            <ChevronLeft className="mx-auto" size={18} />
          </button>

          <select
            value={month}
            onChange={(e) => selectPeriod({ month: Number(e.target.value), year })}
            className="h-11 flex-1 sm:flex-none min-w-0 rounded-xl border px-4 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {MONTHS.map((name, index) => (
              <option key={name} value={index}>{name}</option>
            ))}
          </select>

          <select
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
            className="rounded-xl bg-emerald-500 px-5 h-11 text-white hover:bg-emerald-600 transition"
          >
            Today
          </button>

          <button
            onClick={goToNextMonth}
            className="h-11 w-11 rounded-xl border hover:bg-gray-100 transition"
            aria-label="Next month"
          >
            <ChevronRight className="mx-auto" size={18} />
          </button>

        </div>
      </div>
    </div>
  );
}
