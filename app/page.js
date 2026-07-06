"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardProvider } from "./context/DashboardProvider";
import { useUser } from "./context/UserContext";
import { fetchAnalyticsData } from "../lib/api-client";
import AnalyticsFilters from "./components/AnalyticsFilters";
import ContributionCalendar from "./components/ContributionCalendar";
import MonthSummary from "./components/summuryDetails/MonthSummury";
import Details from "./components/Details/Details";
import RecoveryHighlights from "./components/RecoveryHighlights/RecoveryHighlights";
import LogHabitDrawer from "./components/LogHabit/LogHabitDrawer";
import styles from "./components/LogHabit/LogHabit.module.css";

// Inner component — rendered after UserProvider is ready.
function Dashboard() {
  const { userId, logout, ready } = useUser();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Wait for localStorage to be read before deciding to redirect.
  if (!ready) return null;

  if (!userId) {
    router.replace("/login");
    return null;
  }

  return (
    // DashboardProvider fetches data once — fetchAnalyticsData needs userId.
    <DashboardProvider fetcher={fetchAnalyticsData} userId={userId}>
      <main className="min-h-screen py-6 px-4 sm:py-10 sm:px-6 lg:px-10">
        <div className="mx-auto flex w-full flex-col gap-6 sm:gap-8">

          {/* Top bar with logout */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={logout}
              style={{
                background: "none",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "0.85rem",
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
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

      {/* Floating action button — opens the log drawer */}
      <button
        className={styles.fab}
        onClick={() => setDrawerOpen(true)}
        aria-label="Log a habit"
        title="Log Habit"
      >
        ✚
      </button>

      {/* Log Habit drawer / bottom sheet */}
      {drawerOpen && (
        <LogHabitDrawer onClose={() => setDrawerOpen(false)} />
      )}
    </DashboardProvider>
  );
}

export default function Home() {
  return <Dashboard />;
}
