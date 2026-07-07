// app/login/page.js
// Server Component — exports metadata, renders the client LoginForm.

import LoginForm from "./LoginForm";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hb-analysis-frontend.vercel.app";

export const metadata = {
  // "Sign In" fills the %s slot → "Sign In | HabitBack — Habit Tracker"
  title: "Sign In or Register Free",

  description:
    "Sign in to HabitBack — the free bad habit tracker. Log daily habits, monitor your habit streak, and track your addiction recovery progress.",

  keywords: [
    "habit tracker login",
    "bad habit tracker sign in",
    "recovery tracker app",
    "quit bad habits free",
  ],

  // Canonical prevents the login page from competing with the homepage
  alternates: {
    canonical: `${APP_URL}/login`,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Sign In to HabitBack — Bad Habit Tracker",
    description:
      "Sign in or create a free account to start tracking your bad habits and addiction recovery journey.",
    type: "website",
    url: `${APP_URL}/login`,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HabitBack — Bad Habit Tracker Sign In",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sign In to HabitBack — Bad Habit Tracker",
    description:
      "Sign in or create a free account to start tracking bad habits and monitor your recovery.",
    images: ["/og-image.png"],
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
