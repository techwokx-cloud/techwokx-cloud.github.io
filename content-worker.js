const { generateContentDraft } = require("./content-generator");
const { sendWhatsAppMessage, getStatus, isConfigured: isWhatsAppConfigured } = require("./whatsapp");

const NOTIFY_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER;

async function notifyNewDraft(draft) {
  if (!isWhatsAppConfigured() || getStatus() !== "connected" || !NOTIFY_NUMBER) return;
  try {
    const preview = draft.content.length > 150 ? draft.content.slice(0, 150) + "..." : draft.content;
    await sendWhatsAppMessage(
      NOTIFY_NUMBER,
      `📝 New AI content draft ready for review (topic: ${draft.topic}):\n\n"${preview}"\n\nApprove or discard it in the dashboard's Social & Content page.`
    );
  } catch (err) {
    console.error("[content-worker] WhatsApp notify failed:", err.message);
  }
}

async function generateDailyDraft() {
  try {
    const draft = await generateContentDraft({});
    console.log(`[content-worker] generated daily draft #${draft.id}: "${draft.topic}"`);
    await notifyNewDraft(draft);
    return draft;
  } catch (err) {
    console.error("[content-worker] failed to generate daily draft:", err.message);
    return null;
  }
}

function startContentWorker(intervalMs = 24 * 60 * 60 * 1000) {
  setTimeout(generateDailyDraft, 60_000); // give other startup tasks room to settle first
  setInterval(generateDailyDraft, intervalMs);
}

module.exports = { generateDailyDraft, startContentWorker };
