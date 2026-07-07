// app/login/page.js
// Server Component — exports metadata, renders the client LoginForm.

import LoginForm from "./LoginForm";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://habitpilot.vercel.app";

export const metadata = {
  title: "Sign In or Register Free",

  description:
    "Sign in to HabitPilot — the free bad habit tracker. Log daily habits, monitor your habit streak, and track your addiction recovery progress.",

  keywords: [
    "HabitPilot login",
    "habit tracker sign in",
    "bad habit tracker app",
    "recovery tracker login",
    "quit bad habits free",
  ],

  alternates: {
    canonical: `${APP_URL}/login`,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Sign In to HabitPilot — Bad Habit Tracker",
    description:
      "Sign in or create a free account to start tracking your bad habits and addiction recovery journey with HabitPilot.",
    type: "website",
    url: `${APP_URL}/login`,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HabitPilot — Bad Habit Tracker Sign In",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sign In to HabitPilot — Bad Habit Tracker",
    description:
      "Sign in or create a free account to start tracking bad habits and monitor your recovery with HabitPilot.",
    images: ["/og-image.png"],
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
