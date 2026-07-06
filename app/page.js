// app/page.js — Public landing page (Server Component, fully indexable by Google)
import Link from "next/link";
import styles from "./landing.module.css";

export const metadata = {
  title: "HabitBack — Smoke-Free Habit Tracker & Recovery Analytics",
  description:
    "HabitBack helps you track your smoking recovery journey. Log daily habits, monitor smoke-free streaks, visualise progress with a contribution calendar, and celebrate milestones.",
  keywords: [
    "quit smoking tracker",
    "smoking recovery app",
    "smoke-free streak",
    "habit tracker",
    "recovery analytics",
    "cigarette log",
    "daily habit log",
  ],
  openGraph: {
    title: "HabitBack — Smoke-Free Habit Tracker",
    description:
      "Track your smoking recovery journey. Log habits, monitor streaks, and visualise your progress.",
    type: "website",
  },
};

// JSON-LD structured data — WebSite + SoftwareApplication
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "HabitBack",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://hb-analysis-frontend.vercel.app",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  description:
    "HabitBack is a free personal analytics dashboard for tracking your smoking recovery. Log daily habits, visualise smoke-free streaks on a contribution calendar, and track money saved.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  featureList: [
    "Daily habit logging",
    "Smoke-free streak tracking",
    "Monthly contribution calendar",
    "Recovery score analytics",
    "Money saved calculator",
    "Mood tracking",
  ],
};

const FEATURES = [
  {
    icon: "📅",
    title: "Contribution Calendar",
    desc: "See every day of your journey at a glance. Green = smoke-free, yellow = reduced, red = smoked.",
  },
  {
    icon: "🔥",
    title: "Streak Tracking",
    desc: "Track your current and longest smoke-free streaks. Every day counts.",
  },
  {
    icon: "📊",
    title: "Monthly & Yearly Analytics",
    desc: "Detailed breakdowns by month and year — recovery score, best months, toughest days.",
  },
  {
    icon: "💰",
    title: "Money Saved",
    desc: "See how much money you've saved by not smoking. Motivation you can feel.",
  },
  {
    icon: "😊",
    title: "Mood Logging",
    desc: "Log how you feel each day alongside your habit data for richer insights.",
  },
  {
    icon: "🏆",
    title: "Badges & Levels",
    desc: "Unlock achievements as you progress. Celebrate every milestone on the road to recovery.",
  },
];

const STATS = [
  { value: "100%", label: "Free to use" },
  { value: "365", label: "Days you can track" },
  { value: "₹0", label: "Cost forever" },
  { value: "∞", label: "Streaks possible" },
];

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.page}>

        {/* ── Nav ─────────────────────────────────────────────────── */}
        <header className={styles.nav}>
          <div className={styles.navInner}>
            <div className={styles.brand}>
              <span aria-hidden="true">🌿</span>
              <span>HabitBack</span>
            </div>
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
        <section className={styles.hero} aria-labelledby="hero-heading">
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span aria-hidden="true">🌿</span> Free · No ads · Private
            </div>
            <h1 id="hero-heading" className={styles.heroTitle}>
              Your Smoke-Free<br />
              <span className={styles.heroGradient}>Journey Starts Here</span>
            </h1>
            <p className={styles.heroSub}>
              HabitBack is a personal analytics dashboard that helps you track
              your smoking recovery — one day at a time. Log habits, watch
              your streaks grow, and celebrate every smoke-free day.
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

          {/* Mini calendar preview */}
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
                <span><span className={styles.legendDot} style={{ background: "#22c55e" }} />Smoke-free</span>
                <span><span className={styles.legendDot} style={{ background: "#fbbf24" }} />Reduced</span>
                <span><span className={styles.legendDot} style={{ background: "#f87171" }} />Smoked</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ─────────────────────────────────────────── */}
        <section className={styles.statsStrip} aria-label="App highlights">
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
            <h2 id="features-heading" className={styles.sectionTitle}>
              Everything you need to stay on track
            </h2>
            <p className={styles.sectionSub}>
              Built for real recovery — simple enough to use every day,
              detailed enough to actually understand your progress.
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
              Three steps to clarity
            </h2>

            <ol className={styles.steps}>
              <li className={styles.step}>
                <div className={styles.stepNum} aria-hidden="true">1</div>
                <div>
                  <h3>Create a free account</h3>
                  <p>Sign up with your email in under 30 seconds. No credit card, no subscriptions.</p>
                </div>
              </li>
              <li className={styles.step}>
                <div className={styles.stepNum} aria-hidden="true">2</div>
                <div>
                  <h3>Log your daily habit</h3>
                  <p>Each day, tap "Log Habit" and record how many cigarettes you smoked (zero counts too). Add mood and notes if you like.</p>
                </div>
              </li>
              <li className={styles.step}>
                <div className={styles.stepNum} aria-hidden="true">3</div>
                <div>
                  <h3>Watch your recovery unfold</h3>
                  <p>Your calendar fills with green as smoke-free days stack up. Stats update instantly — streaks, scores, money saved.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* ── CTA banner ──────────────────────────────────────────── */}
        <section className={styles.ctaBanner} aria-labelledby="cta-heading">
          <div className={styles.ctaBannerGlow} aria-hidden="true" />
          <h2 id="cta-heading">Ready to start your recovery?</h2>
          <p>Join HabitBack today. It&apos;s free, always.</p>
          <Link href="/login" className={styles.ctaBannerBtn}>
            Create Free Account
          </Link>
        </section>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerBrand}>
              <span aria-hidden="true">🌿</span> HabitBack
            </div>
            <p className={styles.footerTag}>
              Track your recovery, one day at a time.
            </p>
            <nav aria-label="Footer navigation" className={styles.footerLinks}>
              <Link href="/login">Sign In</Link>
              <Link href="/login">Register</Link>
            </nav>
            <p className={styles.footerCopy}>
              © {new Date().getFullYear()} HabitBack. All rights reserved.
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
