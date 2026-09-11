const db = require("./db");
const { sendEmail, isConfigured } = require("./email");
const { buildActionPlanDocx } = require("./docx-generator");
const { buildScanReportPdf } = require("./pdf-generator");

const API_BASE = process.env.PUBLIC_API_BASE || "https://api.techwokx.online";

// Which day_offset gets which attachment.
const SCAN_REPORT_DAY_OFFSET = 0; // PDF of the scan result — attached directly, no link
const ACTION_PLAN_DAY_OFFSET = 3; // DOCX action plan

async function buildAttachments(item) {
  if (!item.scan_id) return undefined; // no scan on file, nothing to attach

  const scan = db.getScanById(item.scan_id);
  if (!scan || !scan.business_case) return undefined;

  if (item.day_offset === SCAN_REPORT_DAY_OFFSET) {
    try {
      const buffer = await buildScanReportPdf({
        businessName: item.business_name,
        websiteUrl: scan.url,
        score: scan.readiness_score,
        opportunities: scan.opportunities,
        businessCase: scan.business_case,
      });
      return [
        {
          filename: `TechWokx-AI-Readiness-Report-${item.business_name.replace(/[^a-z0-9]+/gi, "-")}.pdf`,
          content: buffer.toString("base64"),
        },
      ];
    } catch (err) {
      console.error(`[campaign-worker] failed to build scan report PDF for enrollment ${item.enrollment_id}:`, err.message);
      return undefined;
    }
  }

  if (item.day_offset === ACTION_PLAN_DAY_OFFSET) {
    try {
      const buffer = await buildActionPlanDocx({
        businessName: item.business_name,
        websiteUrl: scan.url,
        score: scan.readiness_score,
        opportunities: scan.opportunities,
        businessCase: scan.business_case,
        goal: item.goal,
      });
      return [
        {
          filename: `TechWokx-Action-Plan-${item.business_name.replace(/[^a-z0-9]+/gi, "-")}.docx`,
          content: buffer.toString("base64"),
        },
      ];
    } catch (err) {
      console.error(`[campaign-worker] failed to build action plan for enrollment ${item.enrollment_id}:`, err.message);
      return undefined;
    }
  }

  return undefined;
}

async function processCampaigns() {
  if (!isConfigured()) {
    return { skipped: true, reason: "RESEND_API_KEY not configured" };
  }

  const campaigns = db.getActiveCampaigns();
  let sent = 0;
  let failed = 0;

  for (const campaign of campaigns) {
    const due = db.getDueSequenceSends(campaign.id);
    for (const item of due) {
      // Reserve BEFORE sending — if this process gets killed mid-send (a
      // deploy, a restart), the next worker run sees this row already
      // exists and will not send the same email twice.
      const logId = db.reserveEmailLog({
        enrollmentId: item.enrollment_id,
        stepId: item.step_id,
      });
      if (logId === null) continue; // already reserved/sent by a prior run

      try {
        const businessCase = item.business_case ? JSON.parse(item.business_case) : null;
        const attachments = await buildAttachments(item);

        const messageId = await sendEmail({
          to: item.email,
          subject: item.subject,
          bodyTemplate: item.body_template,
          vars: {
            business_name: item.business_name,
            score: item.readiness_score ?? "N/A",
            package: businessCase?.recommendedPackage?.name ?? "AI Assistant",
            price: businessCase?.recommendedPackage?.price ?? "$79",
            timeline: businessCase?.estimatedTimeline ?? "1-2 weeks",
            outcomes: businessCase?.projectedOutcomes?.join("; ") ?? "",
            summary: businessCase?.summary ?? "",
            goal: item.goal || "growing your business with AI",
            unsubscribe_link: `${API_BASE}/unsubscribe/${item.enrollment_id}`,
          },
          attachments,
          idempotencyKey: `enrollment-${item.enrollment_id}-step-${item.step_id}`,
        });

        db.updateEmailLogStatus(logId, { status: "sent", resendMessageId: messageId });
        sent += 1;
      } catch (err) {
        db.updateEmailLogStatus(logId, { status: "failed" });
        failed += 1;
        console.error(
          `[campaign-worker] failed to send step ${item.step_id} to ${item.email}:`,
          err.message
        );
      }
    }
  }

  return { skipped: false, campaignsChecked: campaigns.length, sent, failed };
}

function startCampaignWorker(intervalMs = 5 * 60 * 1000) {
  setTimeout(() => processCampaigns().then(logResult), 10_000);
  setInterval(() => processCampaigns().then(logResult), intervalMs);
}

function logResult(result) {
  if (result.skipped) return;
  if (result.sent > 0 || result.failed > 0) {
    console.log(
      `[campaign-worker] checked ${result.campaignsChecked} campaign(s): ${result.sent} sent, ${result.failed} failed`
    );
  }
}

module.exports = { processCampaigns, startCampaignWorker };
