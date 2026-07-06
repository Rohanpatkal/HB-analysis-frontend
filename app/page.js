"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { DashboardProvider, useDashboard } from "./context/DashboardProvider";
import { useUser } from "./context/UserContext";
import { fetchAnalyticsData } from "../lib/api-client";

import TopNav from "./components/layout/TopNav";
import LoadingScreen from "./components/ui/LoadingScreen";
import ErrorScreen from "./components/ui/ErrorScreen";
import RecoveryHighlights from "./components/RecoveryHighlights/RecoveryHighlights";
import AnalyticsFilters from "./components/AnalyticsFilters";
import MonthSummary from "./components/summuryDetails/MonthSummury";
import ContributionCalendar from "./components/ContributionCalendar";
import Details from "./components/Details/Details";
import LogHabitDrawer from "./components/LogHabit/LogHabitDrawer";

import layoutStyles from "./components/layout/layout.module.css";
import fabStyles from "./components/LogHabit/LogHabit.module.css";

// DashboardContent is rendered inside DashboardProvider so it can read
// loading/error from the context.
function DashboardContent({ onLogHabit }) {
  const { loading, error, refresh } = useDashboard();

  if (loading) return <LoadingScreen message="Loading your recovery data…" />;
  if (error)   return <ErrorScreen message={error} onRetry={refresh} />;

  return (
    <div className={layoutStyles.pageContent}>
      <RecoveryHighlights />
      <AnalyticsFilters />

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
        <div className="lg:sticky lg:top-20">
          <MonthSummary />
        </div>
        <ContributionCalendar />
      </div>

      <Details />
    </div>
  );
}

// Guard — shown only when userId is ready and present.
function Dashboard() {
  const { userId, ready } = useUser();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Wait for localStorage read before redirecting.
  if (!ready) return <LoadingScreen message="Starting up…" />;

  if (!userId) {
    router.replace("/login");
    return null;
  }

  return (
    <DashboardProvider fetcher={fetchAnalyticsData} userId={userId}>
      <div style={{ minHeight: "100vh", background: "#f0f2f8" }}>

        <TopNav onLogHabit={() => setDrawerOpen(true)} />

        <DashboardContent onLogHabit={() => setDrawerOpen(true)} />

        {/* FAB — visible on mobile as an alternative to nav button */}
        <button
          className={fabStyles.fab}
          onClick={() => setDrawerOpen(true)}
          aria-label="Log a habit"
          title="Log Habit"
        >
          ✚
        </button>

        {drawerOpen && (
          <LogHabitDrawer onClose={() => setDrawerOpen(false)} />
        )}

      </div>
    </DashboardProvider>
  );
}

export default function Home() {
  return <Dashboard />;
}
