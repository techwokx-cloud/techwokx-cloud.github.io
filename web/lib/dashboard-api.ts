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

export type SocialPost = {
  id: number;
  campaign_id: number | null;
  profile_id: string;
  content: string;
  scheduled_for: string | null;
  posted_at: string | null;
  status: "pending" | "posted" | "failed";
  buffer_update_id: string | null;
  created_at: string;
};

export type MonthlyReport = {
  id: number;
  period_start: string;
  period_end: string;
  metrics: Record<string, number>;
  previous_metrics: Record<string, number> | null;
  recommended_objective: string;
  reasoning: string;
  course_of_action: string[];
  created_at: string;
};

export const getOverview = () => adminFetch<Overview>("/api/admin/overview");
export const getLeads = () => adminFetch<Lead[]>("/api/admin/leads");
export const getScans = () => adminFetch<Scan[]>("/api/admin/scans");
export const getConversations = () => adminFetch<ConversationSummary[]>("/api/admin/conversations");
export const getConversationThread = (id: number) =>
  adminFetch<ConversationThread>(`/api/admin/conversations/${id}`);
export const getSocialPosts = () => adminFetch<SocialPost[]>("/api/admin/social-posts");
export const getLatestReport = () => adminFetch<MonthlyReport>("/api/reports/latest");

export type Project = {
  id: number;
  lead_id: number | null;
  business_name: string;
  package_name: string;
  status: "not_started" | "in_progress" | "review" | "live";
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Campaign = {
  id: number;
  name: string;
  status: "draft" | "active" | "paused" | "completed";
  duration_days: number;
  cadence_days: number;
  step_count: number;
  enrollment_count: number;
  active_enrollment_count: number;
};

export type Site = {
  id: number;
  site_key: string;
  name: string;
  domain: string | null;
  is_active: number;
};

export type ContentDraft = {
  id: number;
  topic: string | null;
  content: string;
  status: "draft" | "queued" | "discarded";
  created_at: string;
};

async function adminFetchWithBody<T>(
  path: string,
  method: "POST" | "PATCH",
  body?: unknown
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${siteConfig.apiBaseUrl}${path}`, {
    method,
    headers: { "Content-Type": "application/json", "x-admin-token": token || "" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return res.json();
}

export const getProjects = () => adminFetch<Project[]>("/api/admin/projects");
export const createProject = (body: {
  leadId?: number;
  businessName: string;
  packageName: string;
  notes?: string;
}) => adminFetchWithBody<{ id: number }>("/api/admin/projects", "POST", body);
export const updateProject = (id: number, body: { status?: string; notes?: string }) =>
  adminFetchWithBody<{ ok: true }>(`/api/admin/projects/${id}`, "PATCH", body);

export const getCampaigns = () => adminFetch<Campaign[]>("/api/admin/automation/campaigns");
export const setCampaignStatus = (id: number, status: "active" | "paused") =>
  adminFetchWithBody<{ ok: true }>(`/api/admin/automation/campaigns/${id}`, "PATCH", { status });

export const getSites = () => adminFetch<Site[]>("/api/admin/automation/sites");
export const setSiteActive = (id: number, isActive: boolean) =>
  adminFetchWithBody<{ ok: true }>(`/api/admin/automation/sites/${id}`, "PATCH", { isActive });

export const getContentDrafts = () => adminFetch<ContentDraft[]>("/api/admin/content-drafts");
export const generateContentDraft = (topic: string) =>
  adminFetchWithBody<{ id: number; content: string }>(
    "/api/admin/content-drafts/generate",
    "POST",
    { topic }
  );
export const queueContentDraft = (id: number, profileId: string) =>
  adminFetchWithBody<{ ok: true }>(`/api/admin/content-drafts/${id}/queue`, "POST", { profileId });
export const discardContentDraft = (id: number) =>
  adminFetchWithBody<{ ok: true }>(`/api/admin/content-drafts/${id}/discard`, "POST");
