"use client";

/**
 * Dashboard auth — the "password" is literally the backend's
 * ADMIN_API_TOKEN. It's entered once at login, stored in this
 * browser's localStorage, and sent as the x-admin-token header on
 * every dashboard API call. It is NEVER baked into the site's public
 * JS bundle — only ever typed in by whoever logs in, and only lives
 * in their own browser storage.
 *
 * This is a single-admin setup, not a multi-user auth system — fine
 * for now, but doesn't scale to multiple team members with different
 * permissions. Swap for real session-based auth when that's needed.
 */

import { siteConfig } from "@/lib/site-config";

const TOKEN_KEY = "techwokx_dashboard_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getSession(): { token: string } | null {
  const token = getToken();
  return token ? { token } : null;
}

/** Validates a token against the real backend before storing it. */
export async function login(token: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`${siteConfig.apiBaseUrl}/api/admin/overview`, {
      headers: { "x-admin-token": token },
    });
    if (res.status === 401) {
      return { ok: false, error: "Incorrect access key." };
    }
    if (!res.ok) {
      return { ok: false, error: "Couldn't reach the server. Please try again." };
    }
    setToken(token);
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't reach the server. Please check your connection." };
  }
}
