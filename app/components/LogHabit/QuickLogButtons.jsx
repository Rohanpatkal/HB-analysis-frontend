import React, { useState } from 'react';

export default function QuickLogButtons({ onLogComplete }) {
  const [loadingHabit, setLoadingHabit] = useState(null);

  const fastLogs = [
    { label: "⚡ Just Smoked (1)", count: 1, type: "smoking" },
    { label: "📅 Log Yesterday (1)", count: 1, type: "yesterday" }
  ];

  const handleInstantLog = async (log) => {
    setLoadingHabit(log.label);
    try {
      // Direct production pipeline execution simulation 
      await new Promise(resolve => setTimeout(resolve, 600));
      console.log(`Instant logged ${log.count} for payload: ${log.type}`);
      onLogComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingHabit(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Instant 1-Click Logging</span>
        <p className="text-xs text-slate-500 mb-4">No confirmation required. Press to record.</p>
      </div>
      <div className="flex flex-col gap-2.5">
        {fastLogs.map((log) => (
          <button
            key={log.label}
            disabled={loadingHabit !== null}
            onClick={() => handleInstantLog(log)}
            className="w-full text-left bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-100 hover:border-emerald-200 text-slate-700 font-medium py-3 px-4 rounded-xl transition-all text-sm flex justify-between items-center"
          >
            <span>{log.label}</span>
            {loadingHabit === log.label ? (
              <span className="text-xs text-emerald-600 animate-pulse">Saving...</span>
            ) : (
              <span className="text-slate-300 text-xs">⚡</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}