const db = require("./db");
const { chatCompletion } = require("./llm");
const { buildVerifiedImageUrl } = require("./image-generator");

const SYSTEM_PROMPT =
  "You write short, engaging social media posts for TechWokx, a company that adds AI (chat, lead capture, booking) to " +
  "small business websites. Write ONE post, 2-4 sentences, no hashtags spam (max 2 relevant ones), no emojis unless " +
  "they genuinely add something. Match the tone of a helpful, confident, not-salesy startup. Always end with a short, " +
  "natural call to action pointing to techwokx.online (e.g. 'Scan your site free at techwokx.online') — make it read " +
  "like a genuine invitation, not a slapped-on link.\n\n" +
  "After the post text, on its own new line, add exactly:\n" +
  "IMAGE: <a short visual scene description for an AI image generator to illustrate this post — describe a real-world " +
  "scene (e.g. a hotel front desk, a retail shop, a phone screen with a chat bubble), never include text, words, " +
  "letters, or logos in the image description>\n\n" +
  "Output only the post text and the IMAGE line, nothing else.";

const CTA_TEXT = "Scan Your Website Free — techwokx.online";
const CTA_LINE = "\n\nScan your website free at techwokx.online.";

function parseGeneration(raw) {
  const match = raw.match(/\nIMAGE:\s*(.+)$/is);
  if (!match) return { content: raw.trim(), imagePrompt: null };
  const content = raw.slice(0, match.index).trim();
  const imagePrompt = match[1].trim();
  return { content, imagePrompt };
}

async function pickTopic() {
  const recentTopics = db.getRecentContentTopics(10);
  const { text } = await chatCompletion({
    systemPrompt:
      "You suggest a single fresh social media post topic for TechWokx (an AI-for-websites company: AI chat, lead " +
      "capture, booking, industries served include hospitality, healthcare, retail, professional services, education, " +
      "real estate). Reply with ONLY the topic, one short phrase, nothing else.",
    history: [],
    message:
      recentTopics.length > 0
        ? `Avoid repeating these recent topics: ${recentTopics.join("; ")}`
        : "Suggest a good topic for today's post.",
  });
  return text.trim();
}

async function generateContentDraft({ topic } = {}) {
  const resolvedTopic = topic || (await pickTopic());

  const { text: raw } = await chatCompletion({
    systemPrompt: SYSTEM_PROMPT,
    history: [],
    message: `Write a post about: ${resolvedTopic}`,
  });

  const { content, imagePrompt } = parseGeneration(raw);

  // Guarantee a real, working CTA regardless of what the LLM actually
  // wrote — don't just hope it included one. Only append if it's not
  // already clearly there, to avoid a redundant double CTA.
  const finalContent = content.toLowerCase().includes("techwokx.online")
    ? content
    : content + CTA_LINE;

  const imageUrl = imagePrompt ? await buildVerifiedImageUrl(imagePrompt, CTA_TEXT) : null;

  const id = db.createContentDraft({ topic: resolvedTopic, content: finalContent, imageUrl });
  return { id, topic: resolvedTopic, content: finalContent, imageUrl };
}

module.exports = { generateContentDraft };
