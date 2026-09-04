"use client";

/**
 * PLACEHOLDER AUTH
 * ----------------------------------------------------------------
 * There's no backend yet, so this just remembers "logged in" in the
 * browser's localStorage. Any email/password combination works. Once
 * the VPS backend exists, replace this with real authentication
 * (session cookies, JWT, etc.) — every function signature here is
 * written so that swap should be mostly a drop-in.
 */

const SESSION_KEY = "techwokx_dashboard_session";

export type DashboardUser = {
  name: string;
  email: string;
};

export function login(email: string): DashboardUser {
  const user: DashboardUser = {
    name: email.split("@")[0] || "Admin",
    email,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
  return user;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

export function getSession(): DashboardUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
