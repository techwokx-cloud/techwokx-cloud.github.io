// Image sources, in order:
//  1. Pexels (PEXELS_API_KEY) — real stock photography, free API.
//  2. Pixabay (PIXABAY_API_KEY) — same, second source for coverage.
//  3. Pollinations — free, no key, AI-generated, last-resort live source.
//  4. Local categorized library (image-library.js) — manually uploaded
//     or pre-seeded images, used if all live sources fail.
//
// After getting a base image, we composite a real branded overlay onto
// it ourselves with sharp + SVG: a colored CTA banner (color varies by
// objective), the TechWokx logo in a corner, and dynamically-sized text.

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

function isPexelsConfigured() {
  return Boolean(process.env.PEXELS_API_KEY);
}
function isPixabayConfigured() {
  return Boolean(process.env.PIXABAY_API_KEY);
}

// Pexels' own docs explicitly warn: do NOT prefix the key with "Bearer".
async function searchPexels(query) {
  if (!isPexelsConfigured()) throw new Error("PEXELS_API_KEY not configured");
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=square`,
    { headers: { Authorization: process.env.PEXELS_API_KEY } }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Pexels error (${res.status})`);
  const photos = data.photos || [];
  if (photos.length === 0) throw new Error("Pexels returned no results");
  const chosen = photos[Math.floor(Math.random() * photos.length)];
  return chosen.src.large;
}

async function searchPixabay(query) {
  if (!isPixabayConfigured()) throw new Error("PIXABAY_API_KEY not configured");
  const res = await fetch(
    `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=5&safesearch=true`
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Pixabay error (${res.status})`);
  const hits = data.hits || [];
  if (hits.length === 0) throw new Error("Pixabay returned no results");
  const chosen = hits[Math.floor(Math.random() * hits.length)];
  return chosen.largeImageURL;
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
  return lines.slice(0, 2);
}

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
        `<text x="${width / 2}" y="${startY + i * lineHeight}" font-family="Arial, 'DejaVu Sans', sans-serif, 'Noto Emoji'" font-size="${fontSize}" font-weight="700" fill="#ffffff" text-anchor="middle">${escapeXml(line)}</text>`
    )
    .join("");

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

// Tries each live source in order, returns the first working image URL.
async function getBaseImageUrl(query) {
  const sources = [
    { name: "Pexels", fn: searchPexels, configured: isPexelsConfigured() },
    { name: "Pixabay", fn: searchPixabay, configured: isPixabayConfigured() },
  ];
  for (const source of sources) {
    if (!source.configured) continue;
    try {
      return await source.fn(query);
    } catch (err) {
      console.error(`[image-generator] ${source.name} failed:`, err.message);
    }
  }
  // Neither stock source configured or both failed — free AI fallback.
  return buildPollinationsUrl(query);
}

// ctaText is optional — when provided, a real branded overlay (banner +
// logo + text) is composited via sharp. objective picks the banner
// color theme. Falls back to the local categorized image library if
// every live source fails, and only returns null if that's also empty.
async function buildVerifiedImageUrl(query, ctaText, { objective, libraryCategory } = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const variedQuery = attempt === 0 ? query : `${query} ${attempt}`;
    try {
      const baseUrl = await getBaseImageUrl(variedQuery);
      const buffer = await fetchImageBuffer(baseUrl);
      const finalBuffer = ctaText ? await overlayTextOnImage(buffer, ctaText, objective) : buffer;
      return saveGeneratedImage(finalBuffer);
    } catch (err) {
      console.error(`[image-generator] attempt ${attempt + 1} failed:`, err.message);
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

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
  isPexelsConfigured,
  isPixabayConfigured,
  overlayTextOnImage,
  getBaseImageUrl,
  fetchImageBuffer,
  GENERATED_DIR,
};
