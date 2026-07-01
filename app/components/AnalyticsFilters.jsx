"use client";

import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { useDashboard } from "../context/DashboardProvider";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AnalyticsFilter({ startYear = 2020 }) {
  const { period, selectPeriod } = useDashboard();
  const { month, year } = period;

  const notify = (m, y) => {
    selectPeriod({ month: m, year: y });
  };

  const previous = () => {
    if (month === 0) {
      notify(11, year - 1);
    } else {
      notify(month - 1, year);
    }
  };

  const next = () => {
    if (month === 11) {
      notify(0, year + 1);
    } else {
      notify(month + 1, year);
    }
  };

  const changeMonth = (e) => {
    notify(Number(e.target.value), year);
  };

  const changeYear = (e) => {
    notify(month, Number(e.target.value));
  };

  const resetToday = () => {
    const now = new Date();
    notify(now.getMonth(), now.getFullYear());
  };

  const years = [];
  const maxYear = new Date().getFullYear() + 5;

  for (let y = maxYear; y >= startYear; y--) {
    years.push(y);
  }

  return (
    <div className="rounded-3xl border bg-white shadow-sm p-6">

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-3 rounded-2xl">
            <CalendarDays className="text-emerald-600" size={22} />
          </div>

          <div>
            <h2 className="font-bold text-xl">
              Analytics Period
            </h2>

            <p className="text-sm text-gray-500">
              Select any month and year
            </p>
          </div>
        </div>

        <div className="flex w-full sm:w-auto flex-wrap items-center gap-3">

          <button
            onClick={previous}
            className="h-11 w-11 rounded-xl border hover:bg-gray-100 transition"
          >
            <ChevronLeft className="mx-auto" size={18} />
          </button>

          <select
            value={month}
            onChange={changeMonth}
            className="h-11 flex-1 sm:flex-none min-w-0 rounded-xl border px-4 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {MONTHS.map((item, index) => (
              <option key={item} value={index}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={changeYear}
            className="h-11 flex-1 sm:flex-none min-w-0 rounded-xl border px-4 outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {years.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <button
            onClick={resetToday}
            className="rounded-xl bg-emerald-500 px-5 h-11 text-white hover:bg-emerald-600 transition"
          >
            Today
          </button>

          <button
            onClick={next}
            className="h-11 w-11 rounded-xl border hover:bg-gray-100 transition"
          >
            <ChevronRight className="mx-auto" size={18} />
          </button>

        </div>

      </div>
    </div>
  );
}
