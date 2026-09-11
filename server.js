const express = require("express");
const path = require("path");
const { scanWebsite } = require("./scanner");
const db = require("./db");
const social = require("./social");
const { startCampaignWorker } = require("./campaign-worker");
const { startSocialWorker } = require("./social-worker");
const { generateMonthlyReport, startReportWorker } = require("./report-generator");
const { chatCompletion } = require("./llm");
const { startWhatsApp, sendWhatsAppMessage, getStatus: getWhatsAppStatus, isConfigured: isWhatsAppConfigured } = require("./whatsapp");

const app = express();
const PORT = process.env.PORT || 3000;

const ALLOWED_ORIGINS = [
  "https://techwokx.online",
  "https://www.techwokx.online",
  "http://localhost:3000", // local dev
];

// /api/chat and /widget.js need to be callable from ANY origin — they're
// what powers the embeddable widget on other businesses' websites, which
// could be literally any domain. Everything else (scan, leads, admin
// endpoints) stays restricted to our own site.
const OPEN_CORS_PATHS = ["/api/chat", "/widget.js"];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isOpenPath = OPEN_CORS_PATHS.some((p) => req.path.startsWith(p));

  if (isOpenPath) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-token");
  } else if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-admin-token");
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Very small in-memory rate limit: max 5 scans per IP per 10 minutes.
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMax = 5;
const hits = new Map();

function rateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const record = hits.get(ip) || { count: 0, windowStart: now };
  if (now - record.windowStart > rateLimitWindowMs) {
    record.count = 0;
    record.windowStart = now;
  }
  record.count += 1;
  hits.set(ip, record);
  if (record.count > rateLimitMax) {
    return res.status(429).json({
      error: "Too many scan requests. Please try again in a few minutes.",
    });
  }
  next();
}

// In-memory map of the last scan id per normalized URL, so a lead captured
// right after a scan gets linked to it without needing a scan id round-trip
// from the frontend. Small and process-local — fine for a single instance.
const lastScanByUrl = new Map();

function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (!process.env.ADMIN_API_TOKEN || token !== process.env.ADMIN_API_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get("/", (req, res) => {
  res.json({
    service: "TechWokx AI Gateway",
    status: "ok",
    stage: "database-live",
    env: "production",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/api/scan", rateLimit, async (req, res) => {
  const { url } = req.body || {};
  if (!url) {
    return res.status(400).json({ error: "Missing 'url' in request body." });
  }
  try {
    const report = await scanWebsite(url);
    const scanId = db.saveScan({
      leadId: null,
      url: report.url,
      readinessScore: report.readinessScore,
      scoreBreakdown: report.scoreBreakdown,
      opportunities: report.opportunities,
      responseTimeMs: report.responseTimeMs,
    });
    lastScanByUrl.set(report.url, scanId);
    res.json(report);
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message || "Something went wrong scanning that website.",
    });
  }
});

app.post("/api/leads", rateLimit, (req, res) => {
  const { businessName, email, whatsappCountryCode, whatsappNumber, sourceUrl, goal } =
    req.body || {};

  if (!businessName || !email) {
    return res.status(400).json({ error: "businessName and email are required." });
  }

  try {
    const leadId = db.createLead({
      businessName,
      email,
      whatsappCountryCode,
      whatsappNumber,
      sourceUrl,
      goal,
    });

    // Link the most recent scan for this URL to the new lead, if we have one.
    if (sourceUrl && lastScanByUrl.has(sourceUrl)) {
      db.linkScanToLead(lastScanByUrl.get(sourceUrl), leadId);
    }

    // Enroll in the default welcome sequence if it exists and is active.
    const campaigns = db.getActiveCampaigns();
    const welcome = campaigns.find((c) => c.name === "Scan Report Welcome Sequence");
    if (welcome) {
      db.enrollLead(welcome.id, leadId);
    }

    res.status(201).json({ leadId, enrolledInCampaign: Boolean(welcome) });
  } catch (err) {
    res.status(500).json({ error: err.message || "Could not save lead." });
  }
});

app.get("/api/social/profiles", requireAdmin, async (req, res) => {
  try {
    const channels = await social.getChannels();
    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/social/post", requireAdmin, (req, res) => {
  const { profileId, content, scheduledFor } = req.body || {};
  if (!profileId || !content) {
    return res.status(400).json({ error: "profileId and content are required." });
  }
  try {
    const id = db.createSocialPost({
      campaignId: null,
      profileId,
      content,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
    });
    res.status(201).json({ id, status: "queued" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/reports/generate", requireAdmin, async (req, res) => {
  try {
    const { periodDays, notifyEmail } = req.body || {};
    const result = await generateMonthlyReport({
      periodDays: periodDays || 30,
      notifyEmail,
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/reports/latest", requireAdmin, (req, res) => {
  const report = db.getLatestMonthlyReport();
  if (!report) return res.status(404).json({ error: "No reports generated yet." });
  res.json({
    ...report,
    metrics: JSON.parse(report.metrics),
    previous_metrics: report.previous_metrics ? JSON.parse(report.previous_metrics) : null,
    course_of_action: JSON.parse(report.course_of_action),
  });
});

app.get("/api/reports", requireAdmin, (req, res) => {
  const reports = db.getMonthlyReports(12).map((r) => ({
    ...r,
    metrics: JSON.parse(r.metrics),
    previous_metrics: r.previous_metrics ? JSON.parse(r.previous_metrics) : null,
    course_of_action: JSON.parse(r.course_of_action),
  }));
  res.json(reports);
});

// A bit more generous than the scan limit — a real conversation is
// naturally several messages back and forth.
const chatRateLimitMax = 30;
const chatHits = new Map();

function chatRateLimit(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const record = chatHits.get(ip) || { count: 0, windowStart: now };
  if (now - record.windowStart > rateLimitWindowMs) {
    record.count = 0;
    record.windowStart = now;
  }
  record.count += 1;
  chatHits.set(ip, record);
  if (record.count > chatRateLimitMax) {
    return res.status(429).json({ error: "Too many messages. Please slow down a little." });
  }
  next();
}

app.post("/api/chat", chatRateLimit, async (req, res) => {
  const { siteKey, sessionId, message } = req.body || {};

  if (!siteKey || !sessionId || !message) {
    return res.status(400).json({ error: "siteKey, sessionId, and message are required." });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: "Message is too long (2000 characters max)." });
  }

  const site = db.getSiteByKey(siteKey);
  if (!site) {
    return res.status(404).json({ error: "Unknown siteKey." });
  }

  try {
    const conversation = db.getOrCreateConversation({ siteId: site.id, sessionId });
    const history = db.getConversationHistory(conversation.id, 20);

    db.saveMessage({ conversationId: conversation.id, role: "user", content: message });

    const { text, provider } = await chatCompletion({
      systemPrompt: site.system_prompt,
      history,
      message,
    });

    db.saveMessage({
      conversationId: conversation.id,
      role: "assistant",
      content: text,
      provider,
    });

    res.json({ reply: text, provider });
  } catch (err) {
    res.status(502).json({
      error: "The AI assistant is temporarily unavailable. Please try again shortly, or reach us on WhatsApp.",
    });
    console.error("[chat] error:", err.message);
  }
});

app.get("/api/admin/overview", requireAdmin, (req, res) => {
  try {
    res.json(db.getOverviewStats());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/leads", requireAdmin, (req, res) => {
  try {
    res.json(db.getLeadsWithScans(100));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/scans", requireAdmin, (req, res) => {
  try {
    const scans = db.getScansForDashboard(200).map((s) => ({
      ...s,
      opportunities: JSON.parse(s.opportunities),
    }));
    res.json(scans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/conversations", requireAdmin, (req, res) => {
  try {
    res.json(db.getConversationsList(100));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/conversations/:id", requireAdmin, (req, res) => {
  try {
    const thread = db.getConversationThread(Number(req.params.id));
    if (!thread) return res.status(404).json({ error: "Conversation not found." });
    res.json(thread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/admin/social-posts", requireAdmin, (req, res) => {
  try {
    res.json(db.getRecentSocialPosts(50));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/report/:scanId", (req, res) => {
  const scan = db.getScanById(Number(req.params.scanId));
  if (!scan) {
    return res.status(404).send("<h1>Report not found</h1>");
  }

  const pkg = scan.business_case?.recommendedPackage;
  const rows = scan.opportunities
    .map(
      (o) => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;">${o.area}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;">
          <span style="font-weight:600;color:${o.level === "HIGH" ? "#dc2626" : o.level === "MEDIUM" ? "#d97706" : "#64748b"}">${o.level}</span>
        </td>
        <td style="padding:10px 14px;border-bottom:1px solid #eee;color:#64748b;">${o.reason}</td>
      </tr>`
    )
    .join("");

  const outcomes = (scan.business_case?.projectedOutcomes || [])
    .map((o) => `<li style="margin-bottom:6px;">${o}</li>`)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AI Readiness Report — ${scan.url}</title>
</head>
<body style="margin:0;padding:40px 20px;background:#f8f9fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1a1a2e;">
  <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);">
    <div style="background:linear-gradient(135deg,#7c3aed,#3b82f6);padding:32px;color:#fff;">
      <p style="margin:0 0 6px;font-size:13px;opacity:0.85;text-transform:uppercase;letter-spacing:0.05em;">AI Readiness Report</p>
      <h1 style="margin:0;font-size:24px;">${scan.url.replace(/^https?:\/\//, "")}</h1>
      <div style="margin-top:20px;display:flex;align-items:baseline;gap:8px;">
        <span style="font-size:48px;font-weight:800;">${scan.readiness_score}</span>
        <span style="font-size:16px;opacity:0.85;">/ 100</span>
      </div>
    </div>
    <div style="padding:32px;">
      ${scan.business_case ? `<p style="font-size:15px;line-height:1.6;color:#334155;">${scan.business_case.summary}</p>` : ""}

      <h2 style="font-size:16px;margin:24px 0 12px;">Opportunity Areas</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${rows}
      </table>

      ${
        pkg
          ? `
      <h2 style="font-size:16px;margin:24px 0 12px;">Recommended Package</h2>
      <p style="font-size:15px;"><strong>${pkg.name}</strong> — ${pkg.price} (${pkg.period}), estimated ${scan.business_case.estimatedTimeline} to launch.</p>
      `
          : ""
      }

      ${
        outcomes
          ? `
      <h2 style="font-size:16px;margin:24px 0 12px;">What This Means For You</h2>
      <ul style="font-size:14px;color:#334155;padding-left:20px;">${outcomes}</ul>
      `
          : ""
      }

      <div style="margin-top:32px;padding-top:24px;border-top:1px solid #eee;text-align:center;">
        <a href="https://techwokx.online/#scan" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#3b82f6);color:#fff;text-decoration:none;padding:12px 28px;border-radius:10px;font-weight:600;font-size:14px;">Scan Another Website</a>
      </div>
    </div>
  </div>
  <p style="text-align:center;color:#94a3b8;font-size:12px;margin-top:20px;">TechWokx AI Solutions · techwokx.online</p>
</body>
</html>`;

  res.set("Content-Type", "text/html").send(html);
});

app.get("/unsubscribe/:enrollmentId", (req, res) => {
  const ok = db.unsubscribeEnrollment(Number(req.params.enrollmentId));
  res.set("Content-Type", "text/html").send(`<!DOCTYPE html>
<html><head><meta charset="UTF-8" /><title>Unsubscribed</title></head>
<body style="font-family:-apple-system,sans-serif;text-align:center;padding:60px 20px;color:#1a1a2e;">
  <h2>${ok ? "You've been unsubscribed" : "Nothing to unsubscribe"}</h2>
  <p style="color:#64748b;">${ok ? "You won't receive any further emails in this sequence." : "This link may have already been used."}</p>
</body></html>`);
});

app.get("/api/admin/whatsapp/status", requireAdmin, (req, res) => {
  res.json({ configured: isWhatsAppConfigured(), status: getWhatsAppStatus() });
});

app.post("/api/whatsapp/send", requireAdmin, async (req, res) => {
  const { to, text } = req.body || {};
  if (!to || !text) {
    return res.status(400).json({ error: "'to' and 'text' are required." });
  }
  try {
    await sendWhatsAppMessage(to, text);
    res.json({ status: "sent" });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`TechWokx gateway listening on port ${PORT}`);
  startCampaignWorker();
  startSocialWorker();
  startReportWorker({ notifyEmail: process.env.ADMIN_NOTIFY_EMAIL });
  startWhatsApp();
});
