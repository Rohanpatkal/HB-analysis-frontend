// app/layout.js
import "./globals.css";
import { UserProvider } from "./context/UserContext";

export const metadata = {
  title: "HabitBack — Habit Analytics Dashboard",
  description: "Track your recovery, one day at a time",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body>
        {/* UserProvider makes userId available to every page */}
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
