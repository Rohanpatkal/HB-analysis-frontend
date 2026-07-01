"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDashboard } from "../context/DashboardProvider";

const statusColors = {
  green: "bg-emerald-500 hover:bg-emerald-600",
  yellow: "bg-yellow-400 hover:bg-yellow-500",
  red: "bg-red-500 hover:bg-red-600",
  empty: "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
};

export default function ContributionCalendar() {
  const { period, selectPeriod, data } = useDashboard();
  const { month, year } = period;
  const calendarData = data.calendar;
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
      });
    }

    return calendar;
  }, [year, month, calendarData]);

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

      <div className="grid grid-cols-7 mb-3 text-center text-xs sm:text-sm font-semibold text-gray-500">

        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}

      </div>

      {/* Calendar */}

      <div className="grid grid-cols-7 gap-1.5 sm:gap-3">

        {days.map((item, index) => {

          if (!item) return <div key={index}></div>;

          return (
            <button
              key={index}
              onClick={() => alert(item.fullDate)}
              className={`
                h-11
                sm:h-16
                rounded-xl
                sm:rounded-2xl
                transition-all
                duration-300
                hover:scale-105
                text-white
                text-sm
                sm:text-base
                font-semibold
                shadow-sm
                ${statusColors[item.status]}
              `}
            >
              {item.day}
            </button>
          );
        })}

      </div>

      {/* Legend */}

      <div className="flex flex-wrap gap-4 sm:gap-6 mt-6 sm:mt-8">

        <Legend color="bg-emerald-500" text="Smoke Free" />

        <Legend color="bg-yellow-400" text="Reduced" />

        <Legend color="bg-red-500" text="Smoked" />

        <Legend color="bg-gray-300" text="No Data" />

      </div>

    </div>
  );
}

function Legend({ color, text }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded-full ${color}`}></div>
      <span className="text-sm">{text}</span>
    </div>
  );
}
