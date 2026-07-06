// app/login/page.js
// Server Component — exports metadata and renders the client LoginForm.
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Sign In",
  description:
    "Sign in to HabitBack to track your smoking recovery, log daily habits, and monitor your smoke-free streak.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Sign In — HabitBack",
    description: "Sign in to your HabitBack recovery dashboard.",
    type: "website",
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
