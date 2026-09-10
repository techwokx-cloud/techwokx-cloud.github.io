const db = require("./db");
const { sendEmail, isConfigured } = require("./email");

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
      try {
        const businessCase = item.business_case ? JSON.parse(item.business_case) : null;
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
          },
        });
        db.logEmailSent({
          enrollmentId: item.enrollment_id,
          stepId: item.step_id,
          resendMessageId: messageId,
          status: "sent",
        });
        sent += 1;
      } catch (err) {
        db.logEmailSent({
          enrollmentId: item.enrollment_id,
          stepId: item.step_id,
          status: "failed",
        });
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
  // Run once shortly after boot, then on a fixed interval.
  setTimeout(() => processCampaigns().then(logResult), 10_000);
  setInterval(() => processCampaigns().then(logResult), intervalMs);
}

function logResult(result) {
  if (result.skipped) return; // stay quiet if Resend isn't configured yet
  if (result.sent > 0 || result.failed > 0) {
    console.log(
      `[campaign-worker] checked ${result.campaignsChecked} campaign(s): ${result.sent} sent, ${result.failed} failed`
    );
  }
}

module.exports = { processCampaigns, startCampaignWorker };
