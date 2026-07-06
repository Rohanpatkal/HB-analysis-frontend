"use client";

// UserContext — stores the logged-in userId and JWT token globally.
// Both are persisted in localStorage so the user stays logged in on refresh.

import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [token, setToken]   = useState(null);
  const [ready, setReady]   = useState(false); // true after localStorage is read

  // Read userId + token from localStorage on first mount (client-side only).
  useEffect(() => {
    const storedId    = localStorage.getItem("hb_userId");
    const storedToken = localStorage.getItem("hb_token");
    if (storedId)    setUserId(storedId);
    if (storedToken) setToken(storedToken);
    setReady(true);
  }, []);

  function login(id, jwt) {
    localStorage.setItem("hb_userId", id);
    if (jwt) localStorage.setItem("hb_token", jwt);
    setUserId(id);
    setToken(jwt || null);
  }

  function logout() {
    localStorage.removeItem("hb_userId");
    localStorage.removeItem("hb_token");
    setUserId(null);
    setToken(null);
  }

  return (
    <UserContext.Provider value={{ userId, token, login, logout, ready }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
