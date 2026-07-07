// app/layout.js
import "./globals.css";
import { UserProvider } from "./context/UserContext";

// Single source of truth for the canonical URL — must match deployed domain
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hb-analysis-frontend.vercel.app";

export const metadata = {
  // metadataBase resolves all relative URLs in OG images, canonical, etc.
  metadataBase: new URL(APP_URL),

  title: {
    default: "HabitBack — Bad Habit Tracker & Recovery Analytics",
    // Child pages get: "Sign In | HabitBack — Bad Habit Tracker"
    template: "%s | HabitBack — Habit Tracker",
  },

  description:
    "HabitBack is a free bad habit tracker and addiction recovery dashboard. Track smoking habits, monitor habit streaks, log daily progress, and visualise your recovery with analytics.",

  // Broader keyword set covering all 8 target terms
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
  ],

  authors: [{ name: "HabitBack", url: APP_URL }],
  creator: "HabitBack",
  publisher: "HabitBack",

  // Default canonical — child pages should override with their own path
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
    siteName: "HabitBack",
    title: "HabitBack — Bad Habit Tracker & Recovery Analytics",
    description:
      "Free bad habit tracker and addiction recovery dashboard. Monitor habit streaks, log daily habits, and visualise your recovery progress.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HabitBack — Bad Habit Tracker & Recovery Analytics Dashboard",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "HabitBack — Bad Habit Tracker & Recovery Analytics",
    description:
      "Free bad habit tracker and addiction recovery dashboard. Monitor habit streaks and log daily habits.",
    images: ["/og-image.png"],
    creator: "@habitback",
    site: "@habitback",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/manifest.json",

  // Google Search Console ownership verification
  verification: {
    google: "google890085bba37a9fce",
  },

  // Category hint for search engines
  category: "health",
};

// viewport and themeColor MUST be a separate export (Next.js 15+ requirement)
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
