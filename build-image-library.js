// Run once to build the fallback image library:
//   docker compose exec gateway node build-image-library.js
//
// Generates 4 raw (no overlay) images per category using the same
// Fal.ai/Pollinations pipeline as live generation, saved to
// /data/image-library/<category>/. These are used as a last-resort
// fallback when live generation fails — the CTA/logo overlay is
// applied fresh at use time, not baked into the library images.

const fs = require("fs");
const path = require("path");
const { getBaseImageUrl, fetchImageBuffer } = require("./image-generator");
const { CATEGORIES, LIBRARY_DIR } = require("./image-library");

const PROMPTS = {
  hospitality: ["hotel lobby", "hotel reception desk", "restaurant table setting", "spa interior"],
  healthcare: ["medical clinic waiting room", "healthcare reception", "dental office", "wellness center"],
  retail: ["retail store interior", "shop checkout counter", "clothing store", "online shopping"],
  "professional-services": ["office meeting room", "consulting office", "lawyer desk documents", "business handshake"],
  education: ["classroom students", "university lecture hall", "online learning laptop", "school library"],
  "real-estate": ["house for sale", "apartment living room", "real estate agent property", "modern kitchen"],
  technology: ["laptop chat interface", "tech office computers", "smartphone mobile app", "technology abstract"],
  general: ["small business storefront", "professional desk laptop", "customer service representative", "small business owner shop"],
};

async function buildLibrary() {
  let total = 0;
  let failed = 0;

  for (const category of Object.keys(CATEGORIES)) {
    const dir = path.join(LIBRARY_DIR, category);
    fs.mkdirSync(dir, { recursive: true });

    const prompts = PROMPTS[category] || PROMPTS.general;
    for (let i = 0; i < prompts.length; i++) {
      const filename = `${category}-${i + 1}.png`;
      const filepath = path.join(dir, filename);
      if (fs.existsSync(filepath)) {
        console.log(`[build-image-library] ${filename} already exists, skipping`);
        continue;
      }
      try {
        const url = await getBaseImageUrl(prompts[i]);
        const buffer = await fetchImageBuffer(url);
        fs.writeFileSync(filepath, buffer);
        console.log(`[build-image-library] saved ${filename}`);
        total++;
      } catch (err) {
        console.error(`[build-image-library] failed to generate ${filename}:`, err.message);
        failed++;
      }
      // Be polite to free-tier providers between requests.
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  console.log(`\n[build-image-library] done — ${total} images saved, ${failed} failed.`);
}

buildLibrary();
