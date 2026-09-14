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
  hospitality: [
    "a modern hotel lobby with warm lighting, professional photo",
    "a boutique hotel reception desk, professional photo",
    "a restaurant table set for dinner service, professional photo",
    "a relaxing spa interior with soft natural light, professional photo",
  ],
  healthcare: [
    "a clean modern medical clinic waiting room, professional photo",
    "a friendly healthcare reception area, professional photo",
    "a dental office interior, bright and modern, professional photo",
    "a wellness center interior, calm and welcoming, professional photo",
  ],
  retail: [
    "a modern retail store interior with product displays, professional photo",
    "a boutique shop checkout counter, professional photo",
    "a clothing store interior, well lit, professional photo",
    "an online shopping concept, laptop and packages, professional photo",
  ],
  "professional-services": [
    "a modern office meeting room, professional photo",
    "a consulting firm office interior, professional photo",
    "a lawyer's office desk with documents, professional photo",
    "a professional handshake in an office setting, professional photo",
  ],
  education: [
    "a modern classroom with students learning, professional photo",
    "a university lecture hall, professional photo",
    "an online learning setup, laptop and notebook, professional photo",
    "a school library interior, professional photo",
  ],
  "real-estate": [
    "a modern house exterior with a for-sale sign, professional photo",
    "a bright apartment living room, professional photo",
    "a real estate agent showing a property, professional photo",
    "a modern kitchen in a house listing, professional photo",
  ],
  technology: [
    "a laptop showing a chat interface on a desk, professional photo",
    "a modern tech office with computer screens, professional photo",
    "a smartphone displaying a mobile app, professional photo",
    "an abstract technology concept, clean and modern, professional photo",
  ],
  general: [
    "a modern small business storefront, professional photo",
    "a professional working at a desk with a laptop, professional photo",
    "a customer service representative smiling, professional photo",
    "a busy small business owner in their shop, professional photo",
  ],
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
