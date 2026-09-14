const db = require("./db");
const { chatCompletion } = require("./llm");
const { buildVerifiedImageUrl } = require("./image-generator");
const { getCategoryForTopic } = require("./image-library");
const social = require("./social");

const CTA_TEXT = "Scan Your Website Free — techwokx.online";
const CTA_LINE = "\n\nScan your website free at techwokx.online.";
const LEADS_CTA_LINE = "\n\nGet your free AI Readiness Score — scan your website now at techwokx.online.";

const X_CHAR_LIMIT = 280;

const OBJECTIVES = ["engagement", "followers", "leads"];

const OBJECTIVE_GUIDANCE = {
  engagement:
    "Write to spark replies and comments — ask a genuine question or invite people to share their own experience. " +
    "This post's goal is engagement (likes, comments, shares), not a hard sell.",
  followers:
    "Write to earn a follow — tease ongoing value ('follow for weekly AI tips') and give a real reason to want more " +
    "from this account. This post's goal is growing followers.",
  leads:
    "Write to drive people to try TechWokx's free lead magnet: the Scan Your Website tool, a genuine 60-second free " +
    "AI Readiness audit of their own site. This post's goal is leads/signups — make the free tool the clear draw.",
};

// Picks a deterministic objective per day so a given day's batch is
// internally consistent, and it rotates through all three over time.
function pickObjective() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  return OBJECTIVES[dayOfYear % OBJECTIVES.length];
}

function buildSystemPrompt({ objective, maxChars }) {
  return (
    "You write short, engaging social media posts for TechWokx, a company that adds AI (chat, lead capture, booking) " +
    "to small business websites. " +
    OBJECTIVE_GUIDANCE[objective] +
    " " +
    (maxChars
      ? `HARD LIMIT: the post text must be under ${maxChars} characters total, no exceptions — count carefully. `
      : "") +
    "No hashtag spam (max 2 relevant ones). No emojis unless they genuinely add something. Match the tone of a " +
    "helpful, confident, not-salesy startup.\n\n" +
    "After the post text, on its own new line, add exactly:\n" +
    "IMAGE: <a short visual scene description for an AI image generator to illustrate this post — describe a " +
    "real-world scene, never include text, words, letters, or logos in the image description>\n\n" +
    "Output only the post text and the IMAGE line, nothing else."
  );
}

function parseGeneration(raw) {
  const match = raw.match(/\nIMAGE:\s*(.+)$/is);
  if (!match) return { content: raw.trim(), imagePrompt: null };
  const content = raw.slice(0, match.index).trim();
  const imagePrompt = match[1].trim();
  return { content, imagePrompt };
}

function truncateToLimit(text, maxChars) {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars - 1).trim() + "…";
}

// Guarantees a real, working CTA regardless of what the LLM actually
// wrote, respecting a hard character limit when one applies (X).
function ensureCta(content, objective, maxChars) {
  if (content.toLowerCase().includes("techwokx.online")) {
    return maxChars ? truncateToLimit(content, maxChars) : content;
  }

  const cta = objective === "leads" ? LEADS_CTA_LINE : CTA_LINE;
  const combined = content + cta;

  if (!maxChars || combined.length <= maxChars) return combined;

  // Doesn't fit — trim the post body first and keep the CTA whole,
  // since the CTA is the one thing that must survive.
  const roomForBody = maxChars - cta.length;
  if (roomForBody > 20) {
    return content.slice(0, roomForBody - 1).trim() + "…" + cta;
  }
  // CTA itself barely fits or doesn't — fall back to a hard truncate
  // of the combined text rather than producing something broken.
  return truncateToLimit(combined, maxChars);
}

async function pickTopic() {
  const recentTopics = db.getRecentContentTopics(10);
  const { text } = await chatCompletion({
    systemPrompt:
      "You suggest a single fresh social media post topic for TechWokx (an AI-for-websites company: AI chat, lead " +
      "capture, booking, industries served include hospitality, healthcare, retail, professional services, " +
      "education, real estate). Reply with ONLY the topic, one short phrase, nothing else.",
    history: [],
    message:
      recentTopics.length > 0
        ? `Avoid repeating these recent topics: ${recentTopics.join("; ")}`
        : "Suggest a good topic for today's post.",
  });
  return text.trim();
}

async function getChannelId(service) {
  try {
    const channels = await social.getChannels();
    return channels.find((c) => c.service === service)?.id || null;
  } catch {
    return null;
  }
}

// Generates one post tailored to a specific channel, respecting that
// platform's real constraints. sharedImageUrl, if provided, is reused
// instead of generating a fresh image for this specific channel.
async function generateForChannel({ channelService, topic, objective, sharedImageUrl }) {
  const maxChars = channelService === "twitter" ? X_CHAR_LIMIT - 10 : null;
  const systemPrompt = buildSystemPrompt({ objective, maxChars });

  const { text: raw } = await chatCompletion({
    systemPrompt,
    history: [],
    message: `Write a post about: ${topic}`,
  });
  const { content, imagePrompt } = parseGeneration(raw);
  const finalContent = ensureCta(content, objective, channelService === "twitter" ? X_CHAR_LIMIT : null);

  let imageUrl = sharedImageUrl;
  if (imageUrl === undefined) {
    imageUrl = imagePrompt
      ? await buildVerifiedImageUrl(imagePrompt, CTA_TEXT, {
          objective,
          libraryCategory: getCategoryForTopic(topic),
        })
      : null;
  }

  // Instagram cannot post without media — if there's genuinely no image,
  // this channel's draft can't exist.
  if (channelService === "instagram" && !imageUrl) {
    return null;
  }

  const channelId = await getChannelId(channelService);
  const id = db.createContentDraft({
    topic,
    content: finalContent,
    imageUrl: imageUrl || null,
    channelService,
  });
  return { id, topic, content: finalContent, imageUrl: imageUrl || null, channelService, channelId, objective };
}

// One post per connected channel (Facebook, Instagram, X) — not a
// single generic post you then have to pick a channel for. Shares one
// generated image across all three when possible (cheaper than 3
// separate generations, and Instagram needs one regardless).
async function generateDailyBatch({ topic } = {}) {
  const resolvedTopic = topic || (await pickTopic());
  const objective = pickObjective();

  const sharedImageUrl = await buildVerifiedImageUrl(
    `A real-world scene representing: ${resolvedTopic}, professional photo style`,
    CTA_TEXT,
    { objective, libraryCategory: getCategoryForTopic(resolvedTopic) }
  );

  const results = [];
  for (const channelService of ["facebook", "twitter", "instagram"]) {
    try {
      const draft = await generateForChannel({ channelService, topic: resolvedTopic, objective, sharedImageUrl });
      if (draft) {
        results.push(draft);
      } else {
        console.error(
          `[content-generator] skipped ${channelService} — requires an image and none could be generated.`
        );
      }
    } catch (err) {
      console.error(`[content-generator] failed to generate ${channelService} draft:`, err.message);
    }
  }
  return { objective, topic: resolvedTopic, drafts: results };
}

// Single-channel generation, used by the Content page's manual
// "Generate" button (defaults to Facebook — the most flexible platform).
async function generateContentDraft({ topic, channelService = "facebook" } = {}) {
  const resolvedTopic = topic || (await pickTopic());
  const objective = pickObjective();
  const draft = await generateForChannel({ channelService, topic: resolvedTopic, objective, sharedImageUrl: undefined });
  if (!draft) {
    throw new Error(`Could not generate a ${channelService} draft — image generation failed and this platform requires one.`);
  }
  return draft;
}

module.exports = { generateContentDraft, generateDailyBatch };
