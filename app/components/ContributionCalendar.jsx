"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useDashboard } from "../context/DashboardProvider";
import { isoFor } from "../utils/analytics.common";

// ─── status colour map ───────────────────────────────────────────────────────
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

// Human-readable label for a day status
const statusLabel = { green: "Smoke Free", yellow: "Reduced", red: "Smoked", empty: "No data", future: "" };
const statusEmoji  = { green: "🟢", yellow: "🟡", red: "🔴", empty: "⚪", future: "" };

// Format "YYYY-MM-DD" → "Monday, 07 July 2026"
function formatFullDate(iso) {
  const [y, m, d] = iso.split("-");
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString("en-IN", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });
}

// ─── Day detail panel ─────────────────────────────────────────────────────────
function DayDetail({ day, onClose }) {
  if (!day) return null;

  const hasSmoking  = day.count > 0;
  const hasBreak    = day.breakCount > 0;
  const hasMood     = Boolean(day.mood);
  const hasNotes    = Boolean(day.notes?.trim());
  const hasActivity = hasSmoking || hasBreak || hasMood || hasNotes;

  return (
    <div style={{
      marginTop: "20px",
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "20px",
      padding: "20px 22px",
      animation: "slideDown 0.18s ease",
    }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: "#94a3b8", marginBottom: "3px" }}>
            Day Detail
          </div>
          <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
            {formatFullDate(day.fullDate)}
          </div>
          <div style={{ marginTop: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.85rem" }}>{statusEmoji[day.status]}</span>
            <span style={{
              fontSize: "0.78rem", fontWeight: 600, padding: "2px 10px",
              borderRadius: "999px", background: day.status === "green" ? "#dcfce7" : day.status === "red" ? "#fee2e2" : day.status === "yellow" ? "#fef9c3" : "#f1f5f9",
              color: day.status === "green" ? "#15803d" : day.status === "red" ? "#b91c1c" : day.status === "yellow" ? "#92400e" : "#64748b",
            }}>
              {statusLabel[day.status]}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", flexShrink: 0 }}
          aria-label="Close day detail"
        >
          <X size={16} />
        </button>
      </div>

      {/* Stats grid — only shown when there's actual data */}
      {hasActivity ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
          {hasSmoking && (
            <StatTile icon="🚬" label="Cigarettes" value={day.count} />
          )}
          {hasBreak && (
            <StatTile icon="❤️" label="HB Count" value={day.breakCount} />
          )}
          {hasMood && (
            <StatTile icon={day.mood} label="Mood" value="" />
          )}
          {hasNotes && (
            <div style={{ gridColumn: "1 / -1", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px 14px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#94a3b8", marginBottom: "6px" }}>
                📝 Notes
              </div>
              <p style={{ fontSize: "0.9rem", color: "#334155", lineHeight: 1.5, margin: 0 }}>
                {day.notes}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "16px 0", color: "#94a3b8", fontSize: "0.88rem" }}>
          No activity logged for this day.
        </div>
      )}
    </div>
  );
}

function StatTile({ icon, label, value }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "12px 14px" }}>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#94a3b8", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px" }}>
        <span>{icon}</span> {label}
      </div>
      {value !== "" && (
        <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>
          {value}
        </div>
      )}
    </div>
  );
}

// ─── Main calendar component ──────────────────────────────────────────────────
export default function ContributionCalendar() {
  const { period, selectPeriod, data } = useDashboard();
  const { month, year } = period;
  const calendarData = data.calendar;
  const countsData   = data.dayCounts ?? {};

  const [selectedDay, setSelectedDay] = useState(null);

  const todayISO = useMemo(() => {
    const t = new Date();
    return isoFor(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const monthName = useMemo(
    () => new Date(year, month, 1).toLocaleString("default", { month: "long", year: "numeric" }),
    [year, month]
  );

  const days = useMemo(() => {
    const startDay  = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const calendar  = [];

    for (let i = 0; i < startDay; i++) calendar.push(null);

    for (let day = 1; day <= totalDays; day++) {
      const fullDate = isoFor(year, month, day);
      const isFuture = fullDate > todayISO;
      const isToday  = fullDate === todayISO;
      const counts   = countsData[fullDate] ?? {};

      calendar.push({
        day,
        fullDate,
        isToday,
        isFuture,
        status:     isFuture ? "future" : (calendarData[fullDate] || "empty"),
        count:      isFuture ? 0 : (counts.count      ?? 0),
        // breakCount is the field from the API; keep hbCount as an alias for the chip display
        breakCount: isFuture ? 0 : (counts.breakCount ?? counts.hbCount ?? 0),
        mood:       isFuture ? "" : (counts.mood       ?? ""),
        notes:      isFuture ? "" : (counts.notes      ?? ""),
      });
    }
    return calendar;
  }, [year, month, todayISO, calendarData, countsData]);

  // Deselect if user navigates to a different month
  function previousMonth() {
    setSelectedDay(null);
    selectPeriod(month === 0 ? { month: 11, year: year - 1 } : { month: month - 1, year });
  }

  function nextMonth() {
    setSelectedDay(null);
    selectPeriod(month === 11 ? { month: 0, year: year + 1 } : { month: month + 1, year });
  }

  function handleDayClick(item) {
    if (item.isFuture) return;
    // Toggle: clicking the same day again hides the panel
    setSelectedDay(prev => prev?.fullDate === item.fullDate ? null : item);
  }

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl border p-4 sm:p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 sm:mb-8">
        <button onClick={previousMonth} className="p-2 rounded-full hover:bg-gray-100" aria-label="Previous month">
          <ChevronLeft />
        </button>
        <h2 className="text-xl sm:text-3xl font-bold text-center">{monthName}</h2>
        <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100" aria-label="Next month">
          <ChevronRight />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-3 text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-slate-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
        {days.map((item, index) => {
          if (!item) return <div key={index} />;

          const s          = statusStyles[item.status] ?? statusStyles.empty;
          const isSelected = selectedDay?.fullDate === item.fullDate;
          const showCount  = !item.isFuture && item.count > 0;
          const showHb     = !item.isFuture && item.breakCount >= 1;

          return (
            <button
              key={index}
              disabled={item.isFuture}
              onClick={() => handleDayClick(item)}
              title={item.isToday ? "Today" : item.fullDate}
              aria-pressed={isSelected}
              className={[
                "relative flex min-h-[60px] sm:min-h-[94px] flex-col",
                "justify-between rounded-xl sm:rounded-2xl border",
                "p-1.5 sm:p-2.5 text-left transition-all duration-200",
                !item.isFuture && "hover:-translate-y-0.5 hover:shadow-md",
                isSelected ? "ring-2 ring-offset-1 ring-blue-500" : "",
                s.cell,
              ].join(" ")}
            >
              {item.isToday && (
                <span className="pointer-events-none absolute inset-0 rounded-xl sm:rounded-2xl ring-2 ring-blue-400 ring-offset-1 animate-pulse" />
              )}

              <span className="flex items-center justify-between">
                <span className={["text-xs sm:text-base font-bold leading-none", item.isToday ? "text-blue-600" : s.day].join(" ")}>
                  {item.day}
                </span>
                <span className={["h-1.5 w-1.5 rounded-full", item.isToday ? "bg-blue-400 animate-ping" : item.isFuture ? "opacity-0" : s.dot].join(" ")} />
              </span>

              {(showCount || showHb) && (
                <span className="flex flex-wrap gap-1">
                  {showCount && (
                    <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[9px] sm:text-[11px] font-bold leading-none ${s.chip}`}>
                      🚬 {item.count}
                    </span>
                  )}
                  {showHb && (
                    <span className="inline-flex items-center gap-0.5 rounded-md bg-white px-1.5 py-0.5 text-[9px] sm:text-[11px] font-bold leading-none text-slate-600 ring-1 ring-black/5">
                      🔥 {item.breakCount}
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Day detail panel — slides in below the grid on click */}
      <DayDetail day={selectedDay} onClose={() => setSelectedDay(null)} />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 sm:mt-8 border-t border-slate-100 pt-5">
        <Legend color="bg-blue-400"    text="Today"      ring />
        <Legend color="bg-emerald-500" text="Smoke Free" />
        <Legend color="bg-amber-500"   text="Reduced"    />
        <Legend color="bg-rose-500"    text="Smoked"     />
        <Legend color="bg-slate-200"   text="Future"     />

        <span className="ml-auto flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span>🚬 cigarettes</span>
          <span>🔥 HB count</span>
        </span>
      </div>

    </div>
  );
}

function Legend({ color, text, ring }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`relative w-3 h-3 rounded-full ${color}`}>
        {ring && <span className="absolute inset-0 rounded-full ring-2 ring-blue-400 ring-offset-1 animate-pulse" />}
      </div>
      <span className="text-xs sm:text-sm text-slate-600">{text}</span>
    </div>
  );
}
