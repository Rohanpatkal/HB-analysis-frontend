"use client";

// UserContext — stores the logged-in userId, JWT token, and userName globally.
// All three are persisted in localStorage so the user stays logged in on refresh.

import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userId,   setUserId]   = useState(null);
  const [token,    setToken]    = useState(null);
  const [userName, setUserName] = useState("");
  const [ready,    setReady]    = useState(false); // true after localStorage is read

  // Read from localStorage on first mount (client-side only).
  useEffect(() => {
    const storedId   = localStorage.getItem("hb_userId");
    const storedToken = localStorage.getItem("hb_token");
    const storedName = localStorage.getItem("hb_userName");
    if (storedId)   setUserId(storedId);
    if (storedToken) setToken(storedToken);
    if (storedName) setUserName(storedName);
    setReady(true);
  }, []);

  function login(id, jwt, name = "") {
    localStorage.setItem("hb_userId", id);
    if (jwt)  localStorage.setItem("hb_token", jwt);
    if (name) localStorage.setItem("hb_userName", name);
    setUserId(id);
    setToken(jwt || null);
    setUserName(name);
  }

  function logout() {
    localStorage.removeItem("hb_userId");
    localStorage.removeItem("hb_token");
    localStorage.removeItem("hb_userName");
    setUserId(null);
    setToken(null);
    setUserName("");
  }

  return (
    <UserContext.Provider value={{ userId, token, userName, login, logout, ready }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
}
