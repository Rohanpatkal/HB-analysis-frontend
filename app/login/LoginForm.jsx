"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { createUser, loginUser } from "../../lib/api";
import styles from "./Login.module.css";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useUser();

  const [mode, setMode]         = useState("login");   // "login" | "register"
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;

      if (mode === "register") {
        res = await createUser({ name, email, password });
      } else {
        res = await loginUser({ email, password });
      }

      // Both endpoints return { success, userId, token, user }
      login(res.userId, res.token);
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* JSON-LD for the login page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "HabitBack Sign In",
            description: "Sign in to your HabitBack smoking recovery dashboard.",
            url: `${process.env.NEXT_PUBLIC_APP_URL || "https://habitback.app"}/login`,
          }),
        }}
      />

      <div className={styles.card}>

        {/* Brand */}
        <div className={styles.brand}>
          <span className={styles.brandIcon} aria-hidden="true">🌿</span>
          <h1>HabitBack</h1>
          <p>Track your recovery, one day at a time</p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist" aria-label="Authentication mode">
          <button
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? styles.tabActive : styles.tab}
            onClick={() => { setMode("login"); setError(""); }}
            type="button"
          >
            Sign In
          </button>
          <button
            role="tab"
            aria-selected={mode === "register"}
            className={mode === "register" ? styles.tabActive : styles.tab}
            onClick={() => { setMode("register"); setError(""); }}
            type="button"
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className={styles.form}
          aria-label={mode === "register" ? "Create account" : "Sign in"}
          noValidate
        >

          {mode === "register" && (
            <div className={styles.field}>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                aria-required="true"
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              aria-required="true"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              aria-required="true"
            />
          </div>

          {error && (
            <p role="alert" aria-live="assertive" className={styles.error}>
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
            aria-busy={loading}
          >
            {loading
              ? <span className={styles.spinner} aria-hidden="true" />
              : mode === "register" ? "Create Account" : "Sign In"
            }
            {loading && <span className="sr-only">Processing…</span>}
          </button>

        </form>
      </div>
    </div>
  );
}
