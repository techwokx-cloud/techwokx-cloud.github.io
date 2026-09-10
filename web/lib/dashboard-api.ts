import { siteConfig } from "@/lib/site-config";
import { getToken } from "@/lib/dashboard-auth";

async function adminFetch<T>(path: string): Promise<T> {
  const token = getToken();
  const res = await fetch(`${siteConfig.apiBaseUrl}${path}`, {
    headers: { "x-admin-token": token || "" },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export type Overview = {
  totalLeads: number;
  totalScans: number;
  avgReadinessScore: number;
  leadsThisWeek: number;
  scansThisWeek: number;
  activeCampaigns: number;
  activeEnrollments: number;
  emailsSent: number;
  emailsFailed: number;
  socialPostsPublished: number;
  socialPostsFailed: number;
  conversations: number;
  topOpportunityAreas: Record<string, number>;
};

export type Lead = {
  id: number;
  business_name: string;
  email: string;
  whatsapp_country_code: string | null;
  whatsapp_number: string | null;
  source_url: string | null;
  created_at: string;
  readiness_score: number | null;
  scanned_at: string | null;
  campaign_count: number;
  campaign_status: string | null;
};

export type Scan = {
  id: number;
  url: string;
  readiness_score: number;
  opportunities: { area: string; level: string; reason: string }[];
  scanned_at: string;
  lead_id: number | null;
};

export type ConversationSummary = {
  id: number;
  session_id: string;
  started_at: string;
  last_message_at: string;
  site_name: string;
  business_name: string | null;
  lead_email: string | null;
  message_count: number;
  last_message: string;
};

export type ConversationThread = ConversationSummary & {
  messages: { role: string; content: string; provider: string | null; created_at: string }[];
};

export const getOverview = () => adminFetch<Overview>("/api/admin/overview");
export const getLeads = () => adminFetch<Lead[]>("/api/admin/leads");
export const getScans = () => adminFetch<Scan[]>("/api/admin/scans");
export const getConversations = () => adminFetch<ConversationSummary[]>("/api/admin/conversations");
export const getConversationThread = (id: number) =>
  adminFetch<ConversationThread>(`/api/admin/conversations/${id}`);
