const cron = require("node-cron");
const { generateDailyBatch } = require("./content-generator");
const { sendWhatsAppMessage, getStatus, isConfigured: isWhatsAppConfigured } = require("./whatsapp");

const NOTIFY_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER;
// Default: 7am Accra/UTC daily. Override with CONTENT_CRON_SCHEDULE if needed.
const CRON_SCHEDULE = process.env.CONTENT_CRON_SCHEDULE || "0 7 * * *";

async function notifyBatchReady({ objective, topic, drafts }) {
  if (!isWhatsAppConfigured() || getStatus() !== "connected" || !NOTIFY_NUMBER) return;
  if (drafts.length === 0) return;
  try {
    const channelList = drafts.map((d) => `• ${d.channelService}`).join("\n");
    await sendWhatsAppMessage(
      NOTIFY_NUMBER,
      `📝 Today's content is ready for review (topic: "${topic}", focus: ${objective}):\n\n${channelList}\n\n` +
        `Review and approve/discard each one in the dashboard's Social & Content page — nothing posts without your OK.`
    );
  } catch (err) {
    console.error("[content-worker] WhatsApp notify failed:", err.message);
  }
}

async function runDailyGeneration() {
  try {
    const result = await generateDailyBatch({});
    console.log(
      `[content-worker] generated ${result.drafts.length}/3 channel drafts for today (objective: ${result.objective}, topic: "${result.topic}")`
    );
    await notifyBatchReady(result);
    return result;
  } catch (err) {
    console.error("[content-worker] daily generation failed:", err.message);
    return null;
  }
}

function startContentWorker() {
  cron.schedule(CRON_SCHEDULE, runDailyGeneration, { timezone: "UTC" });
  console.log(`[content-worker] scheduled daily generation: "${CRON_SCHEDULE}" (UTC)`);
}

module.exports = { runDailyGeneration, startContentWorker };
