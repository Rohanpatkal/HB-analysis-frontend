// app/page.js — Public landing page (Server Component, fully indexable by Google)
import Link from "next/link";
import styles from "./landing.module.css";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hb-analysis-frontend.vercel.app";

// ─── SEO Metadata ───────────────────────────────────────────────────────────
export const metadata = {
  // Unique title containing the primary target keyword
  title: "Bad Habit Tracker & Addiction Recovery Analytics | HabitBack",

  // 155-character description packed with target keywords
  description:
    "HabitBack is a free bad habit tracker and addiction recovery tracker. Track habit streaks, quit bad habits, log daily progress, and monitor your recovery with detailed analytics.",

  keywords: [
    "bad habit tracker",
    "bad habit",
    "habit tracker",
    "habit analytics",
    "quit bad habits",
    "recovery tracker",
    "addiction recovery tracker",
    "habit streak tracker",
    "smoking recovery app",
    "quit smoking tracker",
    "smoke-free streak",
    "daily habit log",
    "recovery dashboard",
  ],

  // Canonical URL — prevents duplicate content penalty
  alternates: {
    canonical: APP_URL,
  },

  openGraph: {
    title: "Bad Habit Tracker & Addiction Recovery Analytics | HabitBack",
    description:
      "Free bad habit tracker and addiction recovery dashboard. Monitor habit streaks, quit bad habits, and visualise your recovery progress daily.",
    type: "website",
    url: APP_URL,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HabitBack Bad Habit Tracker — Recovery Analytics Dashboard",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bad Habit Tracker & Addiction Recovery Analytics | HabitBack",
    description:
      "Free bad habit tracker. Track habit streaks, quit bad habits, and monitor your recovery.",
    images: ["/og-image.png"],
  },
};

// ─── JSON-LD Structured Data ────────────────────────────────────────────────

// 1. WebSite schema — enables Google Sitelinks Searchbox and name recognition
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${APP_URL}/#website`,
  name: "HabitBack",
  url: APP_URL,
  description:
    "A free bad habit tracker and addiction recovery analytics dashboard.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${APP_URL}/login`,
    },
    "query-input": "required name=search_term_string",
  },
};

// 2. Organization schema — establishes brand identity in Google Knowledge Graph
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${APP_URL}/#organization`,
  name: "HabitBack",
  url: APP_URL,
  logo: {
    "@type": "ImageObject",
    url: `${APP_URL}/og-image.png`,
    width: 1200,
    height: 630,
  },
  description:
    "HabitBack helps people quit bad habits and track addiction recovery with daily habit logging, streak tracking, and recovery analytics.",
  foundingDate: "2024",
  sameAs: [],
};

// 3. SoftwareApplication schema — shows "Free", "Health", rating in search results
const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${APP_URL}/#software`,
  name: "HabitBack — Bad Habit Tracker",
  url: APP_URL,
  applicationCategory: "HealthApplication",
  applicationSubCategory: "Habit Tracker",
  operatingSystem: "Web, iOS, Android",
  description:
    "A free bad habit tracker and addiction recovery analytics dashboard. Log daily habits, track habit streaks, quit bad habits, and monitor recovery progress with detailed charts.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
  },
  featureList: [
    "Bad habit tracking",
    "Addiction recovery analytics",
    "Daily habit logging",
    "Habit streak tracker",
    "Monthly contribution calendar",
    "Recovery score",
    "Money saved calculator",
    "Mood tracking",
  ],
  screenshot: `${APP_URL}/og-image.png`,
  creator: {
    "@type": "Organization",
    "@id": `${APP_URL}/#organization`,
    name: "HabitBack",
  },
};

// 4. BreadcrumbList schema — for the homepage (helps rich results)
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: APP_URL,
    },
  ],
};

// ─── Page Data ───────────────────────────────────────────────────────────────

// Feature copy uses target keywords naturally
const FEATURES = [
  {
    icon: "📅",
    title: "Contribution Calendar",
    desc: "See every day of your bad habit recovery journey at a glance. Green = habit-free, yellow = reduced, red = relapsed.",
  },
  {
    icon: "🔥",
    title: "Habit Streak Tracker",
    desc: "Track your current and longest habit-free streaks. The habit streak tracker updates instantly every time you log a day.",
  },
  {
    icon: "📊",
    title: "Recovery Analytics",
    desc: "Detailed monthly and yearly breakdowns — recovery score, best months, toughest days. Real addiction recovery data.",
  },
  {
    icon: "💰",
    title: "Money Saved",
    desc: "See how much money you've saved by quitting bad habits. Concrete motivation to stay on track.",
  },
  {
    icon: "😊",
    title: "Mood Logging",
    desc: "Log your mood alongside daily habit data. Spot patterns between your emotional state and habit triggers.",
  },
  {
    icon: "🏆",
    title: "Badges & Levels",
    desc: "Unlock achievements as you progress in your recovery. Celebrate every milestone on the road to quitting bad habits.",
  },
];

const STATS = [
  { value: "100%", label: "Free to use" },
  { value: "365", label: "Days you can track" },
  { value: "₹0", label: "Cost forever" },
  { value: "∞", label: "Streaks possible" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      {/* Inject all 4 JSON-LD schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className={styles.page}>

        {/* ── Nav ─────────────────────────────────────────────────── */}
        <header className={styles.nav}>
          <div className={styles.navInner}>
            {/* Brand marked as link to homepage for internal linking */}
            <Link href="/" className={styles.brand} aria-label="HabitBack — Home">
              <span aria-hidden="true">🌿</span>
              <span>HabitBack</span>
            </Link>
            <nav aria-label="Site navigation" className={styles.navLinks}>
              <Link href="#features">Features</Link>
              <Link href="#how-it-works">How it works</Link>
              <Link href="/login" className={styles.navCta}>
                Sign In
              </Link>
            </nav>
          </div>
        </header>

        {/* ── Hero ────────────────────────────────────────────────── */}
        {/* H1 contains the primary keyword "bad habit tracker" */}
        <section className={styles.hero} aria-labelledby="hero-heading">
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span aria-hidden="true">🌿</span> Free · No ads · Private
            </div>

            {/* H1 — one per page, contains top keyword */}
            <h1 id="hero-heading" className={styles.heroTitle}>
              The Free Bad Habit<br />
              <span className={styles.heroGradient}>Tracker & Recovery App</span>
            </h1>

            <p className={styles.heroSub}>
              HabitBack is a personal addiction recovery tracker that helps you
              quit bad habits — one day at a time. Log habits daily, watch your
              habit streak grow, and celebrate every milestone on your journey.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/login" className={styles.ctaPrimary}>
                Start Tracking Free
              </Link>
              <a href="#features" className={styles.ctaSecondary}>
                See Features
              </a>
            </div>
          </div>

          {/* Mini calendar preview — aria-hidden since it's decorative */}
          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.calPreview}>
              <div className={styles.calHeader}>
                <span className={styles.calDot} style={{ background: "#22c55e" }} />
                <span className={styles.calDot} style={{ background: "#fbbf24" }} />
                <span className={styles.calDot} style={{ background: "#f87171" }} />
                <span className={styles.calTitle}>July 2026</span>
              </div>
              <div className={styles.calGrid}>
                {CAL_DAYS.map((status, i) => (
                  <div
                    key={i}
                    className={`${styles.calCell} ${styles[`cal_${status}`]}`}
                  />
                ))}
              </div>
              <div className={styles.calLegend}>
                <span><span className={styles.legendDot} style={{ background: "#22c55e" }} />Habit-free</span>
                <span><span className={styles.legendDot} style={{ background: "#fbbf24" }} />Reduced</span>
                <span><span className={styles.legendDot} style={{ background: "#f87171" }} />Relapsed</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ─────────────────────────────────────────── */}
        <section className={styles.statsStrip} aria-label="HabitBack highlights">
          {STATS.map((s) => (
            <div key={s.label} className={styles.statItem}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </section>

        {/* ── Features ────────────────────────────────────────────── */}
        <section id="features" className={styles.features} aria-labelledby="features-heading">
          <div className={styles.sectionInner}>
            <div className={styles.sectionLabel}>Features</div>
            {/* H2 — uses secondary keyword */}
            <h2 id="features-heading" className={styles.sectionTitle}>
              Everything you need to quit bad habits
            </h2>
            <p className={styles.sectionSub}>
              Built for real addiction recovery — simple enough to use every day,
              detailed enough to actually understand your habit patterns.
            </p>

            <div className={styles.featureGrid}>
              {FEATURES.map((f) => (
                <article key={f.title} className={styles.featureCard}>
                  <div className={styles.featureIcon} aria-hidden="true">{f.icon}</div>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────── */}
        <section id="how-it-works" className={styles.howItWorks} aria-labelledby="how-heading">
          <div className={styles.sectionInner}>
            <div className={styles.sectionLabel}>How it works</div>
            <h2 id="how-heading" className={styles.sectionTitle}>
              Start tracking bad habits in 3 steps
            </h2>

            <ol className={styles.steps}>
              <li className={styles.step}>
                <div className={styles.stepNum} aria-hidden="true">1</div>
                <div>
                  <h3>Create a free account</h3>
                  <p>Sign up with your email in under 30 seconds. No credit card, no subscriptions. Your addiction recovery data stays private.</p>
                </div>
              </li>
              <li className={styles.step}>
                <div className={styles.stepNum} aria-hidden="true">2</div>
                <div>
                  <h3>Log your daily habit</h3>
                  <p>Each day, tap "Log Habit" and record your progress. Zero counts too — every habit-free day builds your streak.</p>
                </div>
              </li>
              <li className={styles.step}>
                <div className={styles.stepNum} aria-hidden="true">3</div>
                <div>
                  <h3>Watch your recovery unfold</h3>
                  <p>Your habit tracker fills with green as habit-free days stack up. Recovery analytics update instantly — streaks, scores, money saved.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* ── CTA banner ──────────────────────────────────────────── */}
        <section className={styles.ctaBanner} aria-labelledby="cta-heading">
          <div className={styles.ctaBannerGlow} aria-hidden="true" />
          <h2 id="cta-heading">Ready to quit your bad habits?</h2>
          <p>Join HabitBack — the free addiction recovery tracker. Always free.</p>
          <Link href="/login" className={styles.ctaBannerBtn}>
            Start Your Recovery Today
          </Link>
        </section>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <span aria-hidden="true">🌿</span> HabitBack
            </div>
            <p className={styles.footerTag}>
              The free bad habit tracker. Track your recovery, one day at a time.
            </p>
            {/* Internal links — help Google understand site structure */}
            <nav aria-label="Footer navigation" className={styles.footerLinks}>
              <Link href="/">Home</Link>
              <Link href="#features">Features</Link>
              <Link href="#how-it-works">How It Works</Link>
              <Link href="/login">Sign In</Link>
              <Link href="/login">Register Free</Link>
            </nav>
            <p className={styles.footerCopy}>
              © {new Date().getFullYear()} HabitBack. Free bad habit tracker. All rights reserved.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}

// Sample calendar data for the visual preview
const CAL_DAYS = [
  "empty","green","green","green","red","yellow","yellow",
  "yellow","green","green","green","green","green","red",
  "yellow","yellow","green","green","green","green","green",
  "green","green","green","green","red","yellow","yellow",
  "green","green","green",
];
