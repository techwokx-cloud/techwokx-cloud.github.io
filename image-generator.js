// Two image providers:
//  - Fal.ai (FAL_API_KEY): paid, production-grade, fast — used when configured.
//  - Pollinations: free, no key, no SLA — automatic fallback.
//  - Local image library: categorized stock images, used as a last
//    resort if both providers fail (see image-library.js).
//
// After getting a base image, we composite a real branded overlay onto
// it ourselves with sharp + SVG: a colored CTA banner (color varies by
// objective), the TechWokx logo in a corner, and dynamically-sized text
// — rather than trusting the AI model to render any of this reliably.

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const GENERATED_DIR =
  process.env.GENERATED_IMAGES_DIR ||
  path.join(__dirname, "..", "..", "data", "generated-images");

const API_BASE = process.env.PUBLIC_API_BASE || "https://api.techwokx.online";

const LOGO_PATH = path.join(__dirname, "assets", "logo.png");
let logoBase64Cache = null;
function getLogoBase64() {
  if (!logoBase64Cache) {
    logoBase64Cache = fs.readFileSync(LOGO_PATH).toString("base64");
  }
  return logoBase64Cache;
}

// A few brand-consistent banner colors, rotated by objective so posts
// don't all look identical while staying on-brand.
const BANNER_THEMES = {
  engagement: "rgba(124,58,237,0.82)", // violet
  followers: "rgba(30,64,175,0.82)", // deep blue
  leads: "rgba(15,10,40,0.82)", // near-black navy
};
const DEFAULT_THEME = "rgba(15,10,40,0.82)";

function seedFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 1000000;
}

function isFalConfigured() {
  return Boolean(process.env.FAL_API_KEY);
}

async function callFalAi(prompt) {
  const res = await fetch("https://fal.run/fal-ai/flux/schnell", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      image_size: "square_hd",
      num_images: 1,
      enable_safety_checker: true,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.message || `Fal.ai error (${res.status})`);
  }
  const url = data.images?.[0]?.url;
  if (!url) throw new Error("Fal.ai returned no image URL");
  return url;
}

function buildPollinationsUrl(prompt, { width = 1024, height = 1024 } = {}) {
  const seed = seedFromString(prompt);
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;
}

async function fetchImageBuffer(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok || !contentType.startsWith("image/")) {
      throw new Error(`did not return an image (status ${res.status}, content-type ${contentType})`);
    }
    return Buffer.from(await res.arrayBuffer());
  } finally {
    clearTimeout(timeout);
  }
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Wraps text onto lines so it doesn't overflow the banner — SVG <text>
// doesn't wrap on its own. maxCharsPerLine scales with font size.
function wrapLines(text, maxCharsPerLine) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxCharsPerLine && current) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2); // cap at 2 lines, keep the banner a bounded height
}

// Shorter text gets a bigger, punchier font; longer text scales down so
// it still fits within 2 lines.
function fontSizeFor(text) {
  if (text.length <= 20) return 46;
  if (text.length <= 40) return 38;
  return 30;
}

function buildOverlaySvg(text, width, height, theme) {
  const fontSize = fontSizeFor(text);
  const maxCharsPerLine = Math.round(width / (fontSize * 0.62));
  const lines = wrapLines(text, maxCharsPerLine);
  const lineHeight = fontSize + 12;
  const bannerHeight = 70 + lines.length * lineHeight;
  const startY = height - bannerHeight + fontSize + 20;

  const textLines = lines
    .map(
      (line, i) =>
        `<text x="${width / 2}" y="${startY + i * lineHeight}" font-family="'Noto Emoji', Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff" text-anchor="middle">${escapeXml(line)}</text>`
    )
    .join("");

  // Logo badge, top-right — a white rounded card since the logo itself
  // has a solid white background (not transparent).
  const logoW = 150;
  const logoH = 43;
  const pad = 22;
  const cardW = logoW + 22;
  const cardH = logoH + 18;
  const cardX = width - cardW - pad;
  const cardY = pad;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="${height - bannerHeight}" width="${width}" height="${bannerHeight}" fill="${theme}" />
    ${textLines}
    <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="9" fill="white" opacity="0.96" />
    <image x="${cardX + 11}" y="${cardY + 9}" width="${logoW}" height="${logoH}" href="data:image/png;base64,${getLogoBase64()}" />
  </svg>`;
}

async function overlayTextOnImage(imageBuffer, text, objective) {
  const base = sharp(imageBuffer);
  const metadata = await base.metadata();
  const width = metadata.width || 1024;
  const height = metadata.height || 1024;
  const theme = BANNER_THEMES[objective] || DEFAULT_THEME;
  const svg = buildOverlaySvg(text, width, height, theme);
  return base.composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).png().toBuffer();
}

function saveGeneratedImage(buffer) {
  if (!fs.existsSync(GENERATED_DIR)) fs.mkdirSync(GENERATED_DIR, { recursive: true });
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
  fs.writeFileSync(path.join(GENERATED_DIR, filename), buffer);
  return `${API_BASE}/generated-images/${filename}`;
}

async function getBaseImageUrl(prompt) {
  if (isFalConfigured()) {
    try {
      return await callFalAi(prompt);
    } catch (err) {
      console.error("[image-generator] Fal.ai failed, falling back to Pollinations:", err.message);
    }
  }
  return buildPollinationsUrl(prompt);
}

// ctaText is optional — when provided, a real branded overlay
// (banner + logo + text) is composited via sharp. objective picks the
// banner color theme. Falls back to the local categorized image library
// (see image-library.js) if live generation fails after retries, and
// only returns null if that also has nothing usable.
async function buildVerifiedImageUrl(prompt, ctaText, { objective, libraryCategory } = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const variedPrompt = attempt === 0 ? prompt : `${prompt} (v${attempt})`;
    try {
      const baseUrl = await getBaseImageUrl(variedPrompt);
      const buffer = await fetchImageBuffer(baseUrl);
      const finalBuffer = ctaText ? await overlayTextOnImage(buffer, ctaText, objective) : buffer;
      return saveGeneratedImage(finalBuffer);
    } catch (err) {
      console.error(`[image-generator] attempt ${attempt + 1} failed:`, err.message);
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Live generation exhausted — fall back to the local library.
  try {
    const { pickLibraryImage } = require("./image-library");
    const libraryBuffer = pickLibraryImage(libraryCategory);
    if (libraryBuffer) {
      const finalBuffer = ctaText ? await overlayTextOnImage(libraryBuffer, ctaText, objective) : libraryBuffer;
      return saveGeneratedImage(finalBuffer);
    }
  } catch (err) {
    console.error("[image-generator] library fallback failed:", err.message);
  }

  return null;
}

module.exports = {
  buildVerifiedImageUrl,
  isFalConfigured,
  overlayTextOnImage,
  getBaseImageUrl,
  fetchImageBuffer,
  GENERATED_DIR,
};
