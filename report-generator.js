const db = require("./db");
const social = require("./social");
const { recommendObjective } = require("./strategist");
const { sendEmail } = require("./email");

function isoDaysAgo(days) {
  return new Date(Date.now() - days * 86400000).toISOString();
}

async function collectMetrics(startIso, endIso) {
  const internal = db.getInternalMetrics(startIso, endIso);

  let social_ = {};
  if (social.isConfigured()) {
    try {
      const channels = await social.getChannels();
      social_ = await social.getAggregatedMetrics({
        channelIds: channels.map((c) => c.id),
        startDateTime: startIso,
        endDateTime: endIso,
      });
    } catch (err) {
      console.error("[report-generator] Buffer metrics unavailable:", err.message);
    }
  }

  return { ...internal, ...social_ };
}

async function generateMonthlyReport({ periodDays = 30, notifyEmail } = {}) {
  const periodEndIso = new Date().toISOString();
  const periodStartIso = isoDaysAgo(periodDays);
  const prevPeriodEndIso = periodStartIso;
  const prevPeriodStartIso = isoDaysAgo(periodDays * 2);

  const metrics = await collectMetrics(periodStartIso, periodEndIso);

  const priorReport = db.getLatestMonthlyReport();
  let previousMetrics = null;
  if (priorReport) {
    // Reuse the prior report's own "metrics" as the comparison baseline —
    // consistent period-over-period, rather than re-querying and risking
    // slightly different windows.
    previousMetrics = JSON.parse(priorReport.metrics);
  } else {
    // No prior report yet: still try to compute a real previous-period
    // comparison from raw data, in case there's historical data to compare
    // against even on the first run.
    const prevInternal = db.getInternalMetrics(prevPeriodStartIso, prevPeriodEndIso);
    const hasPriorData = prevInternal.scanCount > 0 || prevInternal.leadCount > 0;
    previousMetrics = hasPriorData ? prevInternal : null;
  }

  const { objective, reasoning, courseOfAction } = recommendObjective(metrics, previousMetrics);

  const reportId = db.saveMonthlyReport({
    periodStart: periodStartIso,
    periodEnd: periodEndIso,
    metrics,
    previousMetrics,
    recommendedObjective: objective,
    reasoning,
    courseOfAction,
  });

  if (notifyEmail && sendEmailIsConfigured()) {
    try {
      await sendEmail({
        to: notifyEmail,
        subject: `TechWokx Monthly Report — Recommended focus: ${objective}`,
        bodyTemplate: buildEmailBody({ metrics, objective, reasoning, courseOfAction }),
        vars: {},
      });
    } catch (err) {
      console.error("[report-generator] failed to email report:", err.message);
    }
  }

  return { reportId, objective, reasoning, courseOfAction, metrics, previousMetrics };
}

function sendEmailIsConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function buildEmailBody({ metrics, objective, reasoning, courseOfAction }) {
  const lines = [
    `Here's this period's progress and the recommended focus for your next campaign cycle.`,
    ``,
    `KEY METRICS`,
    `- Scans: ${metrics.scanCount ?? "n/a"} (avg readiness score ${metrics.avgReadinessScore ?? "n/a"})`,
    `- Leads: ${metrics.leadCount ?? "n/a"} (scan-to-lead rate ${metrics.scanToLeadRate ?? "n/a"}%)`,
    `- Email sequence completion rate: ${metrics.sequenceCompletionRate ?? "n/a"}%`,
    `- Social posts: ${metrics.postCount ?? "n/a"}, reactions ${metrics.reactions ?? "n/a"}, comments ${metrics.comments ?? "n/a"}, reach ${metrics.reach ?? "n/a"}`,
    ``,
    `RECOMMENDED FOCUS: ${objective.toUpperCase()}`,
    reasoning,
    ``,
    `COURSE OF ACTION`,
    ...courseOfAction.map((a) => `- ${a}`),
    ``,
    `— TechWokx AI Layer`,
  ];
  return lines.join("\n");
}

function startReportWorker({ intervalMs = 24 * 60 * 60 * 1000, notifyEmail } = {}) {
  const check = async () => {
    const latest = db.getLatestMonthlyReport();
    const daysSinceLast = latest
      ? (Date.now() - new Date(latest.created_at + "Z").getTime()) / 86400000
      : Infinity;
    if (daysSinceLast >= 30) {
      try {
        const result = await generateMonthlyReport({ notifyEmail });
        console.log(
          `[report-worker] generated monthly report #${result.reportId} — recommended: ${result.objective}`
        );
      } catch (err) {
        console.error("[report-worker] failed to generate report:", err.message);
      }
    }
  };
  setTimeout(check, 30_000);
  setInterval(check, intervalMs);
}

module.exports = { generateMonthlyReport, startReportWorker };
