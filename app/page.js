"use client";

import React, { useState } from "react";
import { DashboardProvider } from "./context/DashboardProvider";
import { fetchAnalyticsData } from "../lib/api-client";
import AnalyticsFilters from "./components/AnalyticsFilters";
import ContributionCalendar from "./components/ContributionCalendar";
import MonthSummary from "./components/summuryDetails/MonthSummury";
import Details from "./components/Details/Details";
import RecoveryHighlights from "./components/RecoveryHighlights/RecoveryHighlights";
import TouchScrollCounter from "./components/LogHabit/TouchScrollCounter";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefreshDashboard = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardProvider fetcher={fetchAnalyticsData} key={refreshTrigger}>
      <main className="min-h-screen bg-slate-50 py-6 px-4 sm:py-10 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full flex-col gap-6 sm:gap-8 max-w-7xl">
          
          {/* Main Action Header Dashboard - Showing ONLY the standalone Touch Counter */}
          <div className="w-full mx-auto">
            <TouchScrollCounter onLogComplete={handleRefreshDashboard} />
          </div>

          <RecoveryHighlights />
          <AnalyticsFilters />

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
            <div className="lg:sticky lg:top-6">
              <MonthSummary />
            </div>
            <ContributionCalendar />
          </div>

          <Details />
        </div>
      </main>
    </DashboardProvider>
  );
}