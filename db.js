const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "..", "data", "techwokx.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL"); // safer + faster for concurrent reads while writing

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp_country_code TEXT,
    whatsapp_number TEXT,
    source_url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS scans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER REFERENCES leads(id),
    url TEXT NOT NULL,
    readiness_score INTEGER NOT NULL,
    score_breakdown TEXT NOT NULL,   -- JSON
    opportunities TEXT NOT NULL,     -- JSON
    response_time_ms INTEGER,
    scanned_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft', -- draft | active | completed | paused
    duration_days INTEGER NOT NULL DEFAULT 10,  -- minimum 10-day campaigns
    cadence_days INTEGER NOT NULL DEFAULT 7,    -- 5-10 days between campaign launches
    started_at TEXT,
    ends_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS email_sequence_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL REFERENCES campaigns(id),
    day_offset INTEGER NOT NULL,  -- 0 = send immediately, 3 = 3 days after enrollment, etc.
    subject TEXT NOT NULL,
    body_template TEXT NOT NULL, -- may include {{business_name}}, {{score}}, etc.
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS campaign_enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL REFERENCES campaigns(id),
    lead_id INTEGER NOT NULL REFERENCES leads(id),
    enrolled_at TEXT NOT NULL DEFAULT (datetime('now')),
    status TEXT NOT NULL DEFAULT 'active', -- active | completed | unsubscribed
    UNIQUE(campaign_id, lead_id)
  );

  CREATE TABLE IF NOT EXISTS email_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enrollment_id INTEGER NOT NULL REFERENCES campaign_enrollments(id),
    step_id INTEGER NOT NULL REFERENCES email_sequence_steps(id),
    sent_at TEXT NOT NULL DEFAULT (datetime('now')),
    resend_message_id TEXT,
    status TEXT NOT NULL DEFAULT 'sent' -- sent | failed
  );

  CREATE TABLE IF NOT EXISTS social_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER REFERENCES campaigns(id),
    profile_id TEXT NOT NULL,     -- Buffer profile id (which social account)
    content TEXT NOT NULL,
    scheduled_for TEXT,           -- NULL = post ASAP
    posted_at TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending | posted | failed
    buffer_update_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS monthly_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    period_start TEXT NOT NULL,
    period_end TEXT NOT NULL,
    metrics TEXT NOT NULL,
    previous_metrics TEXT,
    recommended_objective TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    course_of_action TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER NOT NULL REFERENCES sites(id),
    conversation_id INTEGER REFERENCES conversations(id),
    lead_id INTEGER REFERENCES leads(id),
    client_name TEXT NOT NULL,
    client_contact TEXT NOT NULL,
    requested_time TEXT NOT NULL,   -- human-readable, e.g. "Tuesday 10am" — no calendar system yet
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | cancelled
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER REFERENCES leads(id),
    business_name TEXT NOT NULL,
    package_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'not_started', -- not_started | in_progress | review | live
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS content_drafts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT,
    content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft', -- draft | queued | discarded
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_key TEXT NOT NULL UNIQUE,   -- public identifier used by the embed script
    name TEXT NOT NULL,
    domain TEXT,
    system_prompt TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER NOT NULL REFERENCES sites(id),
    session_id TEXT NOT NULL,
    lead_id INTEGER REFERENCES leads(id),
    started_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_message_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id),
    role TEXT NOT NULL,    -- user | assistant
    content TEXT NOT NULL,
    provider TEXT,         -- which LLM actually answered (groq | gemini | null for user msgs)
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_scans_lead ON scans(lead_id);
  CREATE INDEX IF NOT EXISTS idx_enrollments_campaign ON campaign_enrollments(campaign_id);
  CREATE INDEX IF NOT EXISTS idx_enrollments_lead ON campaign_enrollments(lead_id);
  CREATE INDEX IF NOT EXISTS idx_email_log_enrollment ON email_log(enrollment_id);
  CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
  CREATE INDEX IF NOT EXISTS idx_conversations_site ON conversations(site_id);
  CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
  CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
`);

// Lightweight migration: add columns to tables that already existed before
// this field was introduced. ALTER TABLE ADD COLUMN throws if the column
// is already there — safe to ignore that specific case.
try {
  db.exec("ALTER TABLE scans ADD COLUMN business_case TEXT");
} catch (e) {
  if (!/duplicate column/i.test(e.message)) throw e;
}
try {
  db.exec("ALTER TABLE leads ADD COLUMN goal TEXT");
} catch (e) {
  if (!/duplicate column/i.test(e.message)) throw e;
}
try {
  db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_email_log_unique ON email_log(enrollment_id, step_id)");
} catch (e) {
  // If duplicate rows already exist from the earlier race-condition bug,
  // this index creation will fail — that's fine, the reservation logic in
  // campaign-worker.js still protects against NEW duplicates either way.
  console.error("[db] could not create unique email_log index (likely pre-existing duplicates):", e.message);
}
try {
  db.exec("ALTER TABLE sites ADD COLUMN daily_message_limit INTEGER NOT NULL DEFAULT 500");
} catch (e) {
  if (!/duplicate column/i.test(e.message)) throw e;
}

// ---- Leads ----
function createLead({ businessName, email, whatsappCountryCode, whatsappNumber, sourceUrl, goal }) {
  const stmt = db.prepare(`
    INSERT INTO leads (business_name, email, whatsapp_country_code, whatsapp_number, source_url, goal)
    VALUES (@businessName, @email, @whatsappCountryCode, @whatsappNumber, @sourceUrl, @goal)
  `);
  const info = stmt.run({
    businessName,
    email,
    whatsappCountryCode: whatsappCountryCode || null,
    whatsappNumber: whatsappNumber || null,
    sourceUrl: sourceUrl || null,
    goal: goal || null,
  });
  return info.lastInsertRowid;
}

function findLeadByEmail(email) {
  return db.prepare("SELECT * FROM leads WHERE email = ? ORDER BY id DESC LIMIT 1").get(email);
}

// ---- Scans ----
function saveScan({ leadId, url, readinessScore, scoreBreakdown, opportunities, responseTimeMs, businessCase }) {
  const stmt = db.prepare(`
    INSERT INTO scans (lead_id, url, readiness_score, score_breakdown, opportunities, response_time_ms, business_case)
    VALUES (@leadId, @url, @readinessScore, @scoreBreakdown, @opportunities, @responseTimeMs, @businessCase)
  `);
  const info = stmt.run({
    leadId: leadId || null,
    url,
    readinessScore,
    scoreBreakdown: JSON.stringify(scoreBreakdown),
    opportunities: JSON.stringify(opportunities),
    responseTimeMs: responseTimeMs || null,
    businessCase: businessCase ? JSON.stringify(businessCase) : null,
  });
  return info.lastInsertRowid;
}

function linkScanToLead(scanId, leadId) {
  db.prepare("UPDATE scans SET lead_id = ? WHERE id = ?").run(leadId, scanId);
}

function getRecentScans(limit = 50) {
  return db.prepare("SELECT * FROM scans ORDER BY id DESC LIMIT ?").all(limit);
}

// ---- Campaigns ----
function createCampaign({ name, durationDays = 10, cadenceDays = 7 }) {
  const stmt = db.prepare(`
    INSERT INTO campaigns (name, duration_days, cadence_days)
    VALUES (@name, @durationDays, @cadenceDays)
  `);
  const info = stmt.run({ name, durationDays, cadenceDays });
  return info.lastInsertRowid;
}

function addSequenceStep({ campaignId, dayOffset, subject, bodyTemplate }) {
  const stmt = db.prepare(`
    INSERT INTO email_sequence_steps (campaign_id, day_offset, subject, body_template)
    VALUES (@campaignId, @dayOffset, @subject, @bodyTemplate)
  `);
  const info = stmt.run({ campaignId, dayOffset, subject, bodyTemplate });
  return info.lastInsertRowid;
}

function activateCampaign(campaignId) {
  const now = new Date();
  const campaign = db.prepare("SELECT * FROM campaigns WHERE id = ?").get(campaignId);
  if (!campaign) throw new Error("Campaign not found");
  const endsAt = new Date(now.getTime() + campaign.duration_days * 86400000);
  db.prepare(
    "UPDATE campaigns SET status = 'active', started_at = ?, ends_at = ? WHERE id = ?"
  ).run(now.toISOString(), endsAt.toISOString(), campaignId);
}

function enrollLead(campaignId, leadId) {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO campaign_enrollments (campaign_id, lead_id)
    VALUES (?, ?)
  `);
  const info = stmt.run(campaignId, leadId);
  return info.lastInsertRowid;
}

function getActiveCampaigns() {
  return db.prepare("SELECT * FROM campaigns WHERE status = 'active'").all();
}

function getDueSequenceSends(campaignId) {
  // Enrollments where a step's day_offset has arrived but hasn't been sent yet.
  // Left-joins each lead's most recent scan so email templates can use
  // {{score}}, {{package}}, {{timeline}}, etc. — not just {{business_name}}.
  return db
    .prepare(
      `
    SELECT
      e.id AS enrollment_id,
      e.lead_id,
      l.business_name,
      l.email,
      l.goal,
      s.id AS step_id,
      s.day_offset,
      s.subject,
      s.body_template,
      sc.id AS scan_id,
      sc.readiness_score,
      sc.business_case
    FROM campaign_enrollments e
    JOIN leads l ON l.id = e.lead_id
    JOIN email_sequence_steps s ON s.campaign_id = e.campaign_id
    LEFT JOIN scans sc ON sc.id = (
      SELECT id FROM scans WHERE lead_id = l.id ORDER BY id DESC LIMIT 1
    )
    WHERE e.campaign_id = ?
      AND e.status = 'active'
      AND julianday('now') - julianday(e.enrolled_at) >= s.day_offset
      AND NOT EXISTS (
        SELECT 1 FROM email_log el
        WHERE el.enrollment_id = e.id AND el.step_id = s.id
      )
  `
    )
    .all(campaignId);
}

// Reserves a log row BEFORE sending, so if the process is killed mid-send
// (e.g. a container restart during deploy), the next worker run sees the
// row already exists and won't send the same email twice. Returns the log
// id, or null if a row already exists for this (enrollment, step) pair —
// meaning it's already been sent, failed, or is being sent right now.
function reserveEmailLog({ enrollmentId, stepId }) {
  const existing = db
    .prepare("SELECT id FROM email_log WHERE enrollment_id = ? AND step_id = ?")
    .get(enrollmentId, stepId);
  if (existing) return null;
  const info = db
    .prepare(
      `INSERT INTO email_log (enrollment_id, step_id, status) VALUES (?, ?, 'sending')`
    )
    .run(enrollmentId, stepId);
  return info.lastInsertRowid;
}

function updateEmailLogStatus(logId, { status, resendMessageId }) {
  db.prepare(
    `UPDATE email_log SET status = ?, resend_message_id = ? WHERE id = ?`
  ).run(status, resendMessageId || null, logId);
}

function logEmailSent({ enrollmentId, stepId, resendMessageId, status = "sent" }) {
  db.prepare(
    `INSERT INTO email_log (enrollment_id, step_id, resend_message_id, status) VALUES (?, ?, ?, ?)`
  ).run(enrollmentId, stepId, resendMessageId || null, status);
}

function unsubscribeEnrollment(enrollmentId) {
  const result = db
    .prepare(`UPDATE campaign_enrollments SET status = 'unsubscribed' WHERE id = ?`)
    .run(enrollmentId);
  return result.changes > 0;
}

function getScanById(scanId) {
  const scan = db.prepare("SELECT * FROM scans WHERE id = ?").get(scanId);
  if (!scan) return null;
  return {
    ...scan,
    opportunities: JSON.parse(scan.opportunities),
    business_case: scan.business_case ? JSON.parse(scan.business_case) : null,
  };
}

// ---- Social posts ----
function createSocialPost({ campaignId, profileId, content, scheduledFor }) {
  const stmt = db.prepare(`
    INSERT INTO social_posts (campaign_id, profile_id, content, scheduled_for)
    VALUES (@campaignId, @profileId, @content, @scheduledFor)
  `);
  const info = stmt.run({
    campaignId: campaignId || null,
    profileId,
    content,
    scheduledFor: scheduledFor ? scheduledFor.toISOString() : null,
  });
  return info.lastInsertRowid;
}

function getDueSocialPosts() {
  // Due = scheduled_for is null (ASAP) or in the past, and still pending.
  return db
    .prepare(
      `
    SELECT * FROM social_posts
    WHERE status = 'pending'
      AND (scheduled_for IS NULL OR datetime(scheduled_for) <= datetime('now'))
    ORDER BY id ASC
  `
    )
    .all();
}

function markSocialPostResult(id, { status, bufferUpdateId }) {
  db.prepare(
    `UPDATE social_posts SET status = ?, buffer_update_id = ?, posted_at = datetime('now') WHERE id = ?`
  ).run(status, bufferUpdateId || null, id);
}

function getRecentSocialPosts(limit = 50) {
  return db.prepare("SELECT * FROM social_posts ORDER BY id DESC LIMIT ?").all(limit);
}

// ---- Dashboard admin queries ----
function getOverviewStats() {
  const totalLeads = db.prepare("SELECT COUNT(*) AS n FROM leads").get().n;
  const totalScans = db.prepare("SELECT COUNT(*) AS n FROM scans").get().n;
  const avgScore = db.prepare("SELECT AVG(readiness_score) AS avg FROM scans").get().avg;

  const leadsThisWeek = db
    .prepare("SELECT COUNT(*) AS n FROM leads WHERE created_at >= datetime('now', '-7 days')")
    .get().n;
  const scansThisWeek = db
    .prepare("SELECT COUNT(*) AS n FROM scans WHERE scanned_at >= datetime('now', '-7 days')")
    .get().n;

  const activeCampaigns = db
    .prepare("SELECT COUNT(*) AS n FROM campaigns WHERE status = 'active'")
    .get().n;
  const activeEnrollments = db
    .prepare("SELECT COUNT(*) AS n FROM campaign_enrollments WHERE status = 'active'")
    .get().n;

  const emails = db
    .prepare(
      "SELECT SUM(CASE WHEN status='sent' THEN 1 ELSE 0 END) AS sent, SUM(CASE WHEN status='failed' THEN 1 ELSE 0 END) AS failed FROM email_log"
    )
    .get();

  const socialPosts = db
    .prepare(
      "SELECT SUM(CASE WHEN status='posted' THEN 1 ELSE 0 END) AS posted, SUM(CASE WHEN status='failed' THEN 1 ELSE 0 END) AS failed FROM social_posts"
    )
    .get();

  const conversations = db.prepare("SELECT COUNT(*) AS n FROM conversations").get().n;

  const opportunityCounts = db
    .prepare(
      `SELECT opportunities FROM scans ORDER BY id DESC LIMIT 200`
    )
    .all()
    .flatMap((row) => {
      try {
        return JSON.parse(row.opportunities);
      } catch {
        return [];
      }
    })
    .reduce((acc, o) => {
      if (o.level === "HIGH") acc[o.area] = (acc[o.area] || 0) + 1;
      return acc;
    }, {});

  return {
    totalLeads,
    totalScans,
    avgReadinessScore: avgScore ? Math.round(avgScore) : 0,
    leadsThisWeek,
    scansThisWeek,
    activeCampaigns,
    activeEnrollments,
    emailsSent: emails.sent || 0,
    emailsFailed: emails.failed || 0,
    socialPostsPublished: socialPosts.posted || 0,
    socialPostsFailed: socialPosts.failed || 0,
    conversations,
    topOpportunityAreas: opportunityCounts,
  };
}

function getLeadsWithScans(limit = 100) {
  return db
    .prepare(
      `
    SELECT
      l.id, l.business_name, l.email, l.whatsapp_country_code, l.whatsapp_number,
      l.source_url, l.created_at,
      sc.readiness_score, sc.scanned_at,
      (SELECT COUNT(*) FROM campaign_enrollments ce WHERE ce.lead_id = l.id) AS campaign_count,
      (SELECT status FROM campaign_enrollments ce WHERE ce.lead_id = l.id ORDER BY id DESC LIMIT 1) AS campaign_status
    FROM leads l
    LEFT JOIN scans sc ON sc.id = (
      SELECT id FROM scans WHERE lead_id = l.id ORDER BY id DESC LIMIT 1
    )
    ORDER BY l.id DESC
    LIMIT ?
  `
    )
    .all(limit);
}

function getScansForDashboard(limit = 200) {
  return db
    .prepare(
      `SELECT id, url, readiness_score, opportunities, scanned_at, lead_id
       FROM scans ORDER BY id DESC LIMIT ?`
    )
    .all(limit);
}

function getConversationsList(limit = 100) {
  return db
    .prepare(
      `
    SELECT
      c.id, c.session_id, c.started_at, c.last_message_at,
      s.name AS site_name,
      l.business_name, l.email AS lead_email,
      (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id) AS message_count,
      (SELECT content FROM messages m WHERE m.conversation_id = c.id ORDER BY id DESC LIMIT 1) AS last_message
    FROM conversations c
    JOIN sites s ON s.id = c.site_id
    LEFT JOIN leads l ON l.id = c.lead_id
    ORDER BY c.last_message_at DESC
    LIMIT ?
  `
    )
    .all(limit);
}

function getConversationThread(conversationId) {
  const conversation = db
    .prepare(
      `SELECT c.*, s.name AS site_name FROM conversations c JOIN sites s ON s.id = c.site_id WHERE c.id = ?`
    )
    .get(conversationId);
  if (!conversation) return null;
  const messages = db
    .prepare("SELECT role, content, provider, created_at FROM messages WHERE conversation_id = ? ORDER BY id ASC")
    .all(conversationId);
  return { ...conversation, messages };
}

// ---- Appointments (AI booking agent) ----
function createAppointment({ siteId, conversationId, leadId, clientName, clientContact, requestedTime, note }) {
  const info = db
    .prepare(
      `INSERT INTO appointments (site_id, conversation_id, lead_id, client_name, client_contact, requested_time, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(siteId, conversationId || null, leadId || null, clientName, clientContact, requestedTime, note || null);
  return info.lastInsertRowid;
}

function getAppointmentById(id) {
  return db
    .prepare(
      `SELECT a.*, s.name AS site_name FROM appointments a JOIN sites s ON s.id = a.site_id WHERE a.id = ?`
    )
    .get(id);
}

function getAppointments() {
  return db
    .prepare(
      `SELECT a.*, s.name AS site_name FROM appointments a JOIN sites s ON s.id = a.site_id ORDER BY a.id DESC`
    )
    .all();
}

function updateAppointmentStatus(id, status) {
  db.prepare("UPDATE appointments SET status = ? WHERE id = ?").run(status, id);
}


function createProject({ leadId, businessName, packageName, notes }) {
  const info = db
    .prepare(
      `INSERT INTO projects (lead_id, business_name, package_name, notes) VALUES (?, ?, ?, ?)`
    )
    .run(leadId || null, businessName, packageName, notes || null);
  return info.lastInsertRowid;
}

function getProjects() {
  return db.prepare("SELECT * FROM projects ORDER BY id DESC").all();
}

function updateProjectStatus(id, status) {
  db.prepare(
    `UPDATE projects SET status = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(status, id);
}

function updateProjectNotes(id, notes) {
  db.prepare(
    `UPDATE projects SET notes = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(notes, id);
}

// ---- Campaign / site controls (for the Automation page) ----
function getAllCampaignsWithStats() {
  return db
    .prepare(
      `
    SELECT
      c.*,
      (SELECT COUNT(*) FROM email_sequence_steps WHERE campaign_id = c.id) AS step_count,
      (SELECT COUNT(*) FROM campaign_enrollments WHERE campaign_id = c.id) AS enrollment_count,
      (SELECT COUNT(*) FROM campaign_enrollments WHERE campaign_id = c.id AND status = 'active') AS active_enrollment_count
    FROM campaigns c
    ORDER BY c.id DESC
  `
    )
    .all();
}

function setCampaignStatus(id, status) {
  db.prepare("UPDATE campaigns SET status = ? WHERE id = ?").run(status, id);
}

function setSiteActive(id, isActive) {
  db.prepare("UPDATE sites SET is_active = ? WHERE id = ?").run(isActive ? 1 : 0, id);
}

// ---- Content drafts (for the Social & Content page) ----
function createContentDraft({ topic, content }) {
  const info = db
    .prepare("INSERT INTO content_drafts (topic, content) VALUES (?, ?)")
    .run(topic || null, content);
  return info.lastInsertRowid;
}

function getContentDrafts() {
  return db.prepare("SELECT * FROM content_drafts ORDER BY id DESC LIMIT 50").all();
}

function updateContentDraftStatus(id, status) {
  db.prepare("UPDATE content_drafts SET status = ? WHERE id = ?").run(status, id);
}

// ---- Internal metrics (our own funnel, independent of Buffer) ----
function getInternalMetrics(startIso, endIso) {
  const scans = db
    .prepare(
      `SELECT COUNT(*) AS n, AVG(readiness_score) AS avgScore FROM scans
       WHERE scanned_at >= ? AND scanned_at < ?`
    )
    .get(startIso, endIso);

  const leads = db
    .prepare(`SELECT COUNT(*) AS n FROM leads WHERE created_at >= ? AND created_at < ?`)
    .get(startIso, endIso);

  const enrollments = db
    .prepare(
      `SELECT
         COUNT(*) AS total,
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed
       FROM campaign_enrollments
       WHERE enrolled_at >= ? AND enrolled_at < ?`
    )
    .get(startIso, endIso);

  return {
    scanCount: scans.n || 0,
    avgReadinessScore: scans.avgScore ? Math.round(scans.avgScore) : 0,
    leadCount: leads.n || 0,
    scanToLeadRate: scans.n ? Math.round((leads.n / scans.n) * 100) : 0,
    enrollments: enrollments.total || 0,
    sequenceCompletionRate: enrollments.total
      ? Math.round(((enrollments.completed || 0) / enrollments.total) * 100)
      : 0,
  };
}

// ---- Monthly reports ----
function saveMonthlyReport({
  periodStart,
  periodEnd,
  metrics,
  previousMetrics,
  recommendedObjective,
  reasoning,
  courseOfAction,
}) {
  const stmt = db.prepare(`
    INSERT INTO monthly_reports
      (period_start, period_end, metrics, previous_metrics, recommended_objective, reasoning, course_of_action)
    VALUES (@periodStart, @periodEnd, @metrics, @previousMetrics, @recommendedObjective, @reasoning, @courseOfAction)
  `);
  const info = stmt.run({
    periodStart,
    periodEnd,
    metrics: JSON.stringify(metrics),
    previousMetrics: previousMetrics ? JSON.stringify(previousMetrics) : null,
    recommendedObjective,
    reasoning,
    courseOfAction: JSON.stringify(courseOfAction),
  });
  return info.lastInsertRowid;
}

function getLatestMonthlyReport() {
  return db.prepare("SELECT * FROM monthly_reports ORDER BY id DESC LIMIT 1").get();
}

function getMonthlyReports(limit = 12) {
  return db.prepare("SELECT * FROM monthly_reports ORDER BY id DESC LIMIT ?").all(limit);
}

// ---- Sites (multi-tenant chat) ----
function createSite({ siteKey, name, domain, systemPrompt }) {
  const stmt = db.prepare(`
    INSERT INTO sites (site_key, name, domain, system_prompt)
    VALUES (@siteKey, @name, @domain, @systemPrompt)
  `);
  const info = stmt.run({ siteKey, name, domain: domain || null, systemPrompt });
  return info.lastInsertRowid;
}

function getSiteByKey(siteKey) {
  return db.prepare("SELECT * FROM sites WHERE site_key = ? AND is_active = 1").get(siteKey);
}

function getTodayMessageCount(siteId) {
  const row = db
    .prepare(
      `SELECT COUNT(*) AS n FROM messages m
       JOIN conversations c ON c.id = m.conversation_id
       WHERE c.site_id = ? AND m.role = 'user' AND m.created_at >= date('now')`
    )
    .get(siteId);
  return row.n || 0;
}

function updateSiteSecurity(id, { domain, dailyMessageLimit }) {
  if (domain !== undefined) {
    db.prepare("UPDATE sites SET domain = ? WHERE id = ?").run(domain || null, id);
  }
  if (dailyMessageLimit !== undefined) {
    db.prepare("UPDATE sites SET daily_message_limit = ? WHERE id = ?").run(dailyMessageLimit, id);
  }
}

function getAllSites() {
  return db.prepare("SELECT * FROM sites ORDER BY id ASC").all();
}

// ---- Conversations & messages ----
function getOrCreateConversation({ siteId, sessionId }) {
  let conv = db
    .prepare("SELECT * FROM conversations WHERE site_id = ? AND session_id = ?")
    .get(siteId, sessionId);
  if (!conv) {
    const info = db
      .prepare("INSERT INTO conversations (site_id, session_id) VALUES (?, ?)")
      .run(siteId, sessionId);
    conv = db.prepare("SELECT * FROM conversations WHERE id = ?").get(info.lastInsertRowid);
  }
  return conv;
}

function getConversationHistory(conversationId, limit = 20) {
  return db
    .prepare(
      "SELECT role, content FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT ?"
    )
    .all(conversationId, limit)
    .reverse();
}

function saveMessage({ conversationId, role, content, provider }) {
  db.prepare(
    "INSERT INTO messages (conversation_id, role, content, provider) VALUES (?, ?, ?, ?)"
  ).run(conversationId, role, content, provider || null);
  db.prepare("UPDATE conversations SET last_message_at = datetime('now') WHERE id = ?").run(
    conversationId
  );
}

function linkConversationToLead(conversationId, leadId) {
  db.prepare("UPDATE conversations SET lead_id = ? WHERE id = ?").run(leadId, conversationId);
}

module.exports = {
  db,
  createLead,
  findLeadByEmail,
  saveScan,
  linkScanToLead,
  getRecentScans,
  createCampaign,
  addSequenceStep,
  activateCampaign,
  enrollLead,
  getActiveCampaigns,
  getDueSequenceSends,
  reserveEmailLog,
  updateEmailLogStatus,
  logEmailSent,
  unsubscribeEnrollment,
  getScanById,
  createSocialPost,
  getDueSocialPosts,
  markSocialPostResult,
  getRecentSocialPosts,
  getInternalMetrics,
  saveMonthlyReport,
  getLatestMonthlyReport,
  getMonthlyReports,
  createSite,
  getSiteByKey,
  getAllSites,
  getTodayMessageCount,
  updateSiteSecurity,
  getOrCreateConversation,
  getConversationHistory,
  saveMessage,
  linkConversationToLead,
  getOverviewStats,
  getLeadsWithScans,
  getScansForDashboard,
  getConversationsList,
  getConversationThread,
  createProject,
  getProjects,
  updateProjectStatus,
  updateProjectNotes,
  getAllCampaignsWithStats,
  setCampaignStatus,
  setSiteActive,
  createContentDraft,
  getContentDrafts,
  updateContentDraftStatus,
  createAppointment,
  getAppointmentById,
  getAppointments,
  updateAppointmentStatus,
};
