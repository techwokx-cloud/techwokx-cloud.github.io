const fs = require("fs");
const path = require("path");

const LIBRARY_DIR = process.env.IMAGE_LIBRARY_DIR || path.join(__dirname, "..", "..", "data", "image-library");

// Category -> keywords used to match a post's topic to the right
// category. "general" is the fallback when nothing matches.
const CATEGORIES = {
  hospitality: ["hotel", "restaurant", "guest", "booking", "reservation", "spa", "travel", "hospitality"],
  healthcare: ["clinic", "health", "patient", "doctor", "medical", "wellness", "dental"],
  retail: ["shop", "store", "retail", "product", "customer", "checkout", "ecommerce", "e-commerce"],
  "professional-services": ["consult", "law", "legal", "accounting", "agency", "office", "professional"],
  education: ["school", "student", "class", "course", "education", "training", "teacher"],
  "real-estate": ["property", "real estate", "apartment", "house", "listing", "realtor", "tenant"],
  technology: ["ai", "tech", "software", "app", "website", "digital", "automation"],
  general: [],
};

function getCategoryForTopic(topic) {
  const lower = (topic || "").toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    if (category === "general") continue;
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return "general";
}

function pickLibraryImage(category) {
  const resolvedCategory = category && CATEGORIES[category] ? category : "general";
  const dir = path.join(LIBRARY_DIR, resolvedCategory);
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g)$/i.test(f));
  if (files.length === 0) {
    // This category is empty — fall back to "general" if we weren't
    // already there.
    if (resolvedCategory !== "general") return pickLibraryImage("general");
    return null;
  }

  const chosen = files[Math.floor(Math.random() * files.length)];
  return fs.readFileSync(path.join(dir, chosen));
}

module.exports = { CATEGORIES, LIBRARY_DIR, getCategoryForTopic, pickLibraryImage };
