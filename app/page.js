"use client";

import { DashboardProvider } from "./context/DashboardProvider";
import { fetchAnalyticsData } from "../lib/api-client";
import AnalyticsFilters from "./components/AnalyticsFilters";
import ContributionCalendar from "./components/ContributionCalendar";
import MonthSummary from "./components/summuryDetails/MonthSummury";
import Details from "./components/Details/Details";
import RecoveryHighlights from "./components/RecoveryHighlights/RecoveryHighlights";

export default function Home() {
  // fetchAnalyticsData is a stable module-level reference — safe to pass
  // directly so DashboardProvider only fetches once on mount.
  return (
    <DashboardProvider fetcher={fetchAnalyticsData}>
      <main className="min-h-screen py-6 px-4 sm:py-10 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full flex-col gap-6 sm:gap-8">

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
