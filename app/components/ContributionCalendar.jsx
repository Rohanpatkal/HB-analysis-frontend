"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDashboard } from "../context/DashboardProvider";
import { isoFor } from "../utils/analytics.common";

// ─── status styles ───────────────────────────────────────────────────────────
const statusStyles = {
  green: {
    cell: "bg-emerald-200 border-emerald-400 hover:border-emerald-500",
    day:  "text-emerald-950",
    dot:  "bg-emerald-700",
    chip: "bg-emerald-300 text-emerald-950",
  },
  yellow: {
    cell: "bg-amber-200 border-amber-400 hover:border-amber-500",
    day:  "text-amber-950",
    dot:  "bg-amber-700",
    chip: "bg-amber-300 text-amber-950",
  },
  red: {
    cell: "bg-rose-200 border-rose-400 hover:border-rose-500",
    day:  "text-rose-950",
    dot:  "bg-rose-700",
    chip: "bg-rose-300 text-rose-950",
  },
  // future days and empty cells share the same muted look
  future: {
    cell: "bg-slate-50 border-slate-100 cursor-default",
    day:  "text-slate-300",
    dot:  "bg-slate-200",
    chip: "",
  },
  empty: {
    cell: "bg-slate-200 border-slate-300 hover:border-slate-400",
    day:  "text-slate-600",
    dot:  "bg-slate-500",
    chip: "bg-slate-300 text-slate-700",
  },
};

export default function ContributionCalendar() {
  const { period, selectPeriod, data } = useDashboard();
  const { month, year } = period;
  const calendarData  = data.calendar;
  const countsData    = data.dayCounts ?? {};

  // ─── today snapshot ──────────────────────────────────────────────────────
  const todayISO = useMemo(() => {
    const t = new Date();
    return isoFor(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const monthName = useMemo(
    () =>
      new Date(year, month, 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
    [year, month]
  );

  // ─── build day objects ────────────────────────────────────────────────────
  const days = useMemo(() => {
    const startDay  = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const calendar = [];

    // leading blank spacers
    for (let i = 0; i < startDay; i++) calendar.push(null);

    for (let day = 1; day <= totalDays; day++) {
      const fullDate = isoFor(year, month, day);
      const isFuture = fullDate > todayISO;
      const isToday  = fullDate === todayISO;

      calendar.push({
        day,
        fullDate,
        isToday,
        isFuture,
        // future days are always blank — no status, no counts
        status:  isFuture ? "future" : (calendarData[fullDate] || "empty"),
        count:   isFuture ? 0 : (countsData[fullDate]?.count   ?? 0),
        hbCount: isFuture ? 0 : (countsData[fullDate]?.hbCount ?? 0),
      });
    }

    return calendar;
  }, [year, month, todayISO, calendarData, countsData]);

  // ─── navigation ──────────────────────────────────────────────────────────
  const previousMonth = () =>
    selectPeriod(month === 0 ? { month: 11, year: year - 1 } : { month: month - 1, year });

  const nextMonth = () =>
    selectPeriod(month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year });

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-white rounded-3xl shadow-xl border p-4 sm:p-8">

      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <button onClick={previousMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronLeft />
        </button>
        <h2 className="text-xl sm:text-3xl font-bold text-center">{monthName}</h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
          <ChevronRight />
        </button>
      </div>

      {/* ── Weekday headers ── */}
      <div className="grid grid-cols-7 mb-3 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* ── Day grid ── */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
        {days.map((item, index) => {
          if (!item) return <div key={index} />;

          const s          = statusStyles[item.status] ?? statusStyles.empty;
          const showCount  = !item.isFuture && item.count > 0;
          const showHbCount = !item.isFuture && item.hbCount >= 1;

          return (
            <button
              key={index}
              disabled={item.isFuture}
              onClick={() => {
                if (!item.isFuture) {
                  // TODO: open day detail panel
                  // For now we log to console — replace with a proper modal
                  console.log("Day selected:", item.fullDate, item);
                }
              }}
              title={item.isToday ? "Today" : item.fullDate}
              className={[
                "relative flex min-h-[60px] sm:min-h-[94px] flex-col",
                "justify-between rounded-xl sm:rounded-2xl border",
                "p-1.5 sm:p-2.5 text-left transition-all duration-200",
                !item.isFuture && "hover:-translate-y-0.5 hover:shadow-md",
                s.cell,
              ].join(" ")}
            >
              {/* ── today pulsing ring ── */}
              {item.isToday && (
                <span className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl ring-2 ring-blue-400 ring-offset-1 animate-pulse" />
              )}

              {/* ── day number row ── */}
              <span className="flex items-center justify-between">
                <span
                  className={[
                    "text-xs sm:text-base font-bold leading-none",
                    item.isToday ? "text-blue-600" : s.day,
                  ].join(" ")}
                >
                  {item.day}
                </span>

                {/* blue dot for today, normal status dot otherwise */}
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    item.isToday ? "bg-blue-400 animate-ping" : (item.isFuture ? "opacity-0" : s.dot),
                  ].join(" ")}
                />
              </span>

              {/* ── count chips (past days only) ── */}
              {(showCount || showHbCount) && (
                <span className="flex flex-wrap gap-1">
                  {showCount && (
                    <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] sm:text-[11px] font-bold leading-none ${s.chip}`}>
                      🚬 {item.count}
                    </span>
                  )}
                  {showHbCount && (
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-white px-1.5 py-0.5 text-[9px] sm:text-[11px] font-bold leading-none text-slate-600 ring-1 ring-black/5">
                      🔥 {item.hbCount}
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 sm:mt-8 border-t border-slate-100 pt-5">
        <Legend color="bg-blue-400"    text="Today"      ring />
        <Legend color="bg-emerald-500" text="Smoke Free" />
        <Legend color="bg-amber-500"   text="Reduced"    />
        <Legend color="bg-rose-500"    text="Smoked"     />
        <Legend color="bg-slate-200"   text="Future"     />

        <span className="ml-auto flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">🚬 cigarettes</span>
          <span className="inline-flex items-center gap-1">🔥 HB count</span>
        </span>
      </div>

    </div>
  );
}

function Legend({ color, text, ring }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`relative w-3 h-3 rounded-full ${color}`}>
        {ring && (
          <span className="absolute inset-0 rounded-full ring-2 ring-blue-400 ring-offset-1 animate-pulse" />
        )}
      </div>
      <span className="text-xs sm:text-sm text-slate-600">{text}</span>
    </div>
  );
}
