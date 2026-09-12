const { generateContentDraft } = require("./content-generator");
const { sendWhatsAppMessage, getStatus, isConfigured: isWhatsAppConfigured } = require("./whatsapp");

const NOTIFY_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER;
const DRAFTS_PER_BATCH = 5;

async function notifyBatchReady(drafts) {
  if (!isWhatsAppConfigured() || getStatus() !== "connected" || !NOTIFY_NUMBER) return;
  if (drafts.length === 0) return;
  try {
    const topics = drafts.map((d) => `• ${d.topic}`).join("\n");
    await sendWhatsAppMessage(
      NOTIFY_NUMBER,
      `📝 ${drafts.length} new AI content draft${drafts.length > 1 ? "s" : ""} ready for review this week:\n\n${topics}\n\nReview and approve/discard them in the dashboard's Social & Content page — nothing posts without your OK.`
    );
  } catch (err) {
    console.error("[content-worker] WhatsApp notify failed:", err.message);
  }
}

async function generateWeeklyBatch() {
  const drafts = [];
  for (let i = 0; i < DRAFTS_PER_BATCH; i++) {
    try {
      const draft = await generateContentDraft({});
      drafts.push(draft);
      console.log(`[content-worker] generated draft #${draft.id}: "${draft.topic}"`);
    } catch (err) {
      console.error(`[content-worker] failed to generate draft ${i + 1}/${DRAFTS_PER_BATCH}:`, err.message);
    }
  }
  await notifyBatchReady(drafts);
  return drafts;
}

function startContentWorker(intervalMs = 7 * 24 * 60 * 60 * 1000) {
  setTimeout(generateWeeklyBatch, 60_000); // give other startup tasks room to settle first
  setInterval(generateWeeklyBatch, intervalMs);
}

module.exports = { generateWeeklyBatch, startContentWorker };
