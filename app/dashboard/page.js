"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import { DashboardProvider, useDashboard } from "../context/DashboardProvider";
import { useUser } from "../context/UserContext";
import { fetchAnalyticsData } from "../../lib/api-client";

import TopNav from "../components/layout/TopNav";
import LoadingScreen from "../components/ui/LoadingScreen";
import ErrorScreen from "../components/ui/ErrorScreen";

// Lazy-load heavy sections to reduce initial bundle size.
const RecoveryHighlights   = dynamic(() => import("../components/RecoveryHighlights/RecoveryHighlights"), { ssr: false });
const AnalyticsFilters     = dynamic(() => import("../components/AnalyticsFilters"),                      { ssr: false });
const MonthSummary         = dynamic(() => import("../components/summuryDetails/MonthSummury"),            { ssr: false });
const ContributionCalendar = dynamic(() => import("../components/ContributionCalendar"),                   { ssr: false });
const Details              = dynamic(() => import("../components/Details/Details"),                        { ssr: false });
const LogHabitDrawer       = dynamic(() => import("../components/LogHabit/LogHabitDrawer"),                { ssr: false });
const CommentSection       = dynamic(() => import("../components/CommentSection/CommentSection"),          { ssr: false });

import layoutStyles from "../components/layout/layout.module.css";
import fabStyles from "../components/LogHabit/LogHabit.module.css";

// JSON-LD structured data for the dashboard
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HabitPilot",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  description:
    "A personal habit analytics dashboard for tracking smoking recovery journeys with smoke-free streaks, contribution calendars, and monthly summaries.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

function DashboardContent({ onEditLog }) {
  const { loading, error, refresh } = useDashboard();

  if (loading) return <LoadingScreen message="Loading your recovery data…" />;
  if (error)   return <ErrorScreen message={error} onRetry={refresh} />;

  return (
    <main className={layoutStyles.pageContent} id="main-content" aria-label="Recovery dashboard">
      <RecoveryHighlights />
      <AnalyticsFilters />
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
        <div className="lg:sticky lg:top-20">
          <MonthSummary />
        </div>
        <ContributionCalendar onEditLog={onEditLog} />
      </div>
      <Details />
      <CommentSection />
    </main>
  );
}

function Dashboard() {
  const { userId, ready } = useUser();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);

  if (!ready) return <LoadingScreen message="Starting up…" />;

  if (!userId) {
    router.replace("/login");
    return null;
  }

  function handleOpenCreate() {
    setEditingLog(null);
    setDrawerOpen(true);
  }

  function handleOpenEdit(dayItem) {
    setEditingLog({
      id:         dayItem.id,
      date:       dayItem.fullDate,
      count:      dayItem.count,
      breakCount: dayItem.breakCount,
      mood:       dayItem.mood,
      notesRaw:   dayItem.notesRaw,
    });
    setDrawerOpen(true);
  }

  function handleClose() {
    setDrawerOpen(false);
    setEditingLog(null);
  }

  return (
    <DashboardProvider fetcher={fetchAnalyticsData} userId={userId}>
      <a
        href="#main-content"
        style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}
        className="focus:left-4 focus:top-4 focus:w-auto focus:h-auto focus:overflow-visible focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow"
      >
        Skip to content
      </a>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ minHeight: "100vh", background: "#f0f2f8" }}>
        <TopNav onLogHabit={handleOpenCreate} />
        <DashboardContent onEditLog={handleOpenEdit} />

        <button
          className={fabStyles.fab}
          onClick={handleOpenCreate}
          type="button"
          aria-label="Log a new habit entry"
          title="Log Habit"
        >
          <span aria-hidden="true">✚</span>
          <span className="sr-only">Log Habit</span>
        </button>

        {drawerOpen && (
          <LogHabitDrawer onClose={handleClose} existingLog={editingLog} />
        )}
      </div>
    </DashboardProvider>
  );
}

export default function DashboardPage() {
  return <Dashboard />;
}
