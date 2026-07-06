// app/layout.js
import "./globals.css";
import { UserProvider } from "./context/UserContext";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://habitback.app";

export const metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "HabitBack — Habit Analytics Dashboard",
    template: "%s | HabitBack",
  },
  description:
    "Track your smoking recovery journey with HabitBack. Log habits daily, monitor smoke-free streaks, and visualise your progress with a contribution calendar.",
  keywords: [
    "habit tracker",
    "smoking recovery",
    "quit smoking",
    "habit analytics",
    "smoke-free streak",
    "recovery dashboard",
    "cigarette log",
  ],
  authors: [{ name: "HabitBack" }],
  creator: "HabitBack",
  publisher: "HabitBack",
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
    title: "HabitBack — Habit Analytics Dashboard",
    description:
      "Track your smoking recovery journey with HabitBack. Log habits daily, monitor smoke-free streaks, and visualise your progress.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HabitBack — Habit Analytics Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HabitBack — Habit Analytics Dashboard",
    description:
      "Track your smoking recovery journey with HabitBack. Log habits daily, monitor smoke-free streaks, and visualise your progress.",
    images: ["/og-image.png"],
    creator: "@habitback",
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
};

// viewport and themeColor must be in a separate export in Next.js 15+
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
        {/* UserProvider makes userId available to every page */}
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
