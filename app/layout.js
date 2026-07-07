// app/layout.js
import "./globals.css";
import { UserProvider } from "./context/UserContext";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://habitpilot.vercel.app";

export const metadata = {
  metadataBase: new URL(APP_URL),

  title: {
    default: "HabitPilot — Bad Habit Tracker & Recovery Analytics",
    template: "%s | HabitPilot",
  },

  description:
    "HabitPilot is a free bad habit tracker and addiction recovery dashboard. Track smoking habits, monitor habit streaks, log daily progress, and visualise your recovery with analytics.",

  keywords: [
    "bad habit tracker",
    "habit tracker",
    "habit analytics",
    "quit bad habits",
    "recovery tracker",
    "addiction recovery tracker",
    "habit streak tracker",
    "smoking recovery",
    "quit smoking app",
    "smoke-free streak",
    "bad habit",
    "daily habit log",
    "recovery dashboard",
    "cigarette tracker",
    "HabitPilot",
  ],

  authors: [{ name: "HabitPilot", url: APP_URL }],
  creator: "HabitPilot",
  publisher: "HabitPilot",

  alternates: {
    canonical: APP_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: APP_URL,
    siteName: "HabitPilot",
    title: "HabitPilot — Bad Habit Tracker & Recovery Analytics",
    description:
      "Free bad habit tracker and addiction recovery dashboard. Monitor habit streaks, log daily habits, and visualise your recovery progress.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HabitPilot — Bad Habit Tracker & Recovery Analytics Dashboard",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "HabitPilot — Bad Habit Tracker & Recovery Analytics",
    description:
      "Free bad habit tracker and addiction recovery dashboard. Monitor habit streaks and log daily habits.",
    images: ["/og-image.png"],
    creator: "@habitpilot",
    site: "@habitpilot",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.json",

  verification: {
    google: "google890085bba37a9fce",
  },

  category: "health",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)",  color: "#059669" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
