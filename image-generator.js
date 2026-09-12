// Two image providers:
//  - Fal.ai (FAL_API_KEY): paid, production-grade, fast — used when configured.
//  - Pollinations: free, no key, no SLA — automatic fallback.
//
// After getting a base image from either provider, we composite a real
// text banner (CTA) onto it ourselves with sharp + an SVG overlay,
// rather than trusting the AI model to render text inside the image
// (unreliable even with good models). The result is saved to the
// persistent data volume and served back out by this same gateway.

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const GENERATED_DIR =
  process.env.GENERATED_IMAGES_DIR ||
  path.join(__dirname, "..", "..", "data", "generated-images");

const API_BASE = process.env.PUBLIC_API_BASE || "https://api.techwokx.online";

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

// Wraps text onto multiple lines so it doesn't overflow the banner —
// SVG <text> doesn't wrap on its own.
function wrapLines(text, maxCharsPerLine = 34) {
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
  return lines.slice(0, 2); // cap at 2 lines, keep the banner a fixed height
}

function buildOverlaySvg(text, width, height) {
  const lines = wrapLines(text);
  const bannerHeight = 90 + lines.length * 48;
  const startY = height - bannerHeight + 55;

  const textLines = lines
    .map(
      (line, i) =>
        `<text x="${width / 2}" y="${startY + i * 48}" font-family="Arial, sans-serif" font-size="38" font-weight="700" fill="#ffffff" text-anchor="middle">${escapeXml(line)}</text>`
    )
    .join("");

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="${height - bannerHeight}" width="${width}" height="${bannerHeight}" fill="rgba(15,10,40,0.78)" />
    ${textLines}
  </svg>`;
}

async function overlayTextOnImage(imageBuffer, text) {
  const base = sharp(imageBuffer);
  const metadata = await base.metadata();
  const width = metadata.width || 1024;
  const height = metadata.height || 1024;
  const svg = buildOverlaySvg(text, width, height);
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

// ctaText is optional — when provided, a real text banner is composited
// onto the image via sharp. Returns null (graceful text-only fallback)
// if image generation/download/overlay fails after retries.
async function buildVerifiedImageUrl(prompt, ctaText) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const variedPrompt = attempt === 0 ? prompt : `${prompt} (v${attempt})`;
    try {
      const baseUrl = await getBaseImageUrl(variedPrompt);
      const buffer = await fetchImageBuffer(baseUrl);
      const finalBuffer = ctaText ? await overlayTextOnImage(buffer, ctaText) : buffer;
      return saveGeneratedImage(finalBuffer);
    } catch (err) {
      console.error(`[image-generator] attempt ${attempt + 1} failed:`, err.message);
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  return null;
}

module.exports = { buildVerifiedImageUrl, isFalConfigured, GENERATED_DIR };
