"use client";

/**
 * PLACEHOLDER SETTINGS STORAGE
 * ----------------------------------------------------------------
 * No backend yet, so this just persists to the browser's localStorage
 * on this device — it is NOT shared across devices/users and is NOT
 * secure storage for real secrets. Treat every field here as a UI
 * mockup of what the real settings page will manage once the VPS
 * backend exists (real secrets belong in server-side environment
 * variables, never in browser storage).
 */

export type DashboardSettings = {
  aiPrimaryModel: string;
  aiFallbackModel: string;
  anthropicApiKey: string;
  openaiApiKey: string;
  googleApiKey: string;
  bufferApiKey: string;
  metaPixelId: string;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  smtpFromName: string;
  smtpFromEmail: string;
  whatsappCountryCode: string;
  whatsappNumber: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  socialLinkedIn: string;
  socialYouTube: string;
  socialTikTok: string;
};

const KEY = "techwokx_dashboard_settings";

export const defaultSettings: DashboardSettings = {
  aiPrimaryModel: "gemini-flash",
  aiFallbackModel: "claude",
  anthropicApiKey: "",
  openaiApiKey: "",
  googleApiKey: "",
  bufferApiKey: "",
  metaPixelId: "440897446242409",
  smtpHost: "",
  smtpPort: "587",
  smtpUsername: "",
  smtpPassword: "",
  smtpFromName: "TechWokx",
  smtpFromEmail: "hello@techwokx.com",
  whatsappCountryCode: "+233",
  whatsappNumber: "201234567",
  socialFacebook: "",
  socialInstagram: "",
  socialTwitter: "",
  socialLinkedIn: "",
  socialYouTube: "",
  socialTikTok: "",
};

export function getSettings(): DashboardSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: DashboardSettings) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(settings));
  }
}
