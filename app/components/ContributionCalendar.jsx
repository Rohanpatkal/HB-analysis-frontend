"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDashboard } from "../context/DashboardProvider";

const statusStyles = {
  green: {
    cell: "bg-emerald-50 border-emerald-200 hover:border-emerald-300",
    day: "text-emerald-700",
    dot: "bg-emerald-500",
    chip: "bg-emerald-100 text-emerald-700",
  },
  yellow: {
    cell: "bg-amber-50 border-amber-200 hover:border-amber-300",
    day: "text-amber-700",
    dot: "bg-amber-500",
    chip: "bg-amber-100 text-amber-700",
  },
  red: {
    cell: "bg-rose-50 border-rose-200 hover:border-rose-300",
    day: "text-rose-700",
    dot: "bg-rose-500",
    chip: "bg-rose-100 text-rose-700",
  },
  empty: {
    cell: "bg-slate-50 border-slate-100 hover:border-slate-200",
    day: "text-slate-400",
    dot: "bg-slate-300",
    chip: "bg-slate-100 text-slate-500",
  },
};

export default function ContributionCalendar() {
  const { period, selectPeriod, data } = useDashboard();
  const { month, year } = period;
  const calendarData = data.calendar;
  const countsData = data.dayCounts ?? {};
  const monthName = useMemo(
    () =>
      new Date(year, month, 1).toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
    [year, month]
  );

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();

    const totalDays = new Date(year, month + 1, 0).getDate();

    const calendar = [];

    for (let i = 0; i < startDay; i++) {
      calendar.push(null);
    }

    for (let day = 1; day <= totalDays; day++) {
      const fullDate = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      calendar.push({
        day,
        fullDate,
        status: calendarData[fullDate] || "empty",
        count: countsData[fullDate]?.count ?? 0,
        hbCount: countsData[fullDate]?.hbCount ?? 0,
      });
    }

    return calendar;
  }, [year, month, calendarData, countsData]);

  const previousMonth = () => {
    if (month === 0) {
      selectPeriod({ month: 11, year: year - 1 });
    } else {
      selectPeriod({ month: month - 1, year });
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      selectPeriod({ month: 0, year: year + 1 });
    } else {
      selectPeriod({ month: month + 1, year });
    }
  };

  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-3xl shadow-xl border p-4 sm:p-8">

      {/* Header */}

      <div className="flex justify-between items-center mb-6 sm:mb-8">

        <button
          onClick={previousMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ChevronLeft />
        </button>

        <h2 className="text-xl sm:text-3xl font-bold text-center">{monthName}</h2>

        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ChevronRight />
        </button>

      </div>

      {/* Week Days */}

      <div className="grid grid-cols-7 mb-3 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400">

        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}

      </div>

      {/* Calendar */}

      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">

        {days.map((item, index) => {

          if (!item) return <div key={index}></div>;

          const s = statusStyles[item.status] ?? statusStyles.empty;
          const showCount = item.count > 1;
          const showHbCount = item.hbCount >= 1;

          return (
            <button
              key={index}
              onClick={() => alert(item.fullDate)}
              title={item.fullDate}
              className={`
                flex
                min-h-[60px]
                sm:min-h-[94px]
                flex-col
                justify-between
                rounded-xl
                sm:rounded-2xl
                border
                p-1.5
                sm:p-2.5
                text-left
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                ${s.cell}
              `}
            >
              <span className="flex items-center justify-between">
                <span className={`text-xs sm:text-base font-bold leading-none ${s.day}`}>
                  {item.day}
                </span>
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`}></span>
              </span>

              {(showCount || showHbCount) && (
                <span className="flex flex-wrap gap-1">
                  {showCount && (
                    <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] sm:text-[11px] font-bold leading-none ${s.chip}`}>
                      � {item.count}
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

      {/* Legend */}

      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 sm:mt-8 border-t border-slate-100 pt-5">

        <Legend color="bg-emerald-500" text="Smoke Free" />

        <Legend color="bg-amber-500" text="Reduced" />

        <Legend color="bg-rose-500" text="Smoked" />

        <Legend color="bg-slate-300" text="No Data" />

        <span className="ml-auto flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">🚬 cigarettes</span>
          <span className="inline-flex items-center gap-1">🔥 HB count</span>
        </span>

      </div>

    </div>
  );
}

function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`}></div>
      <span className="text-xs sm:text-sm text-slate-600">{text}</span>
    </div>
  );
}
