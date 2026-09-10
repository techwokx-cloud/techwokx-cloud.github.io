// Run once to set up the first campaign:
//   docker compose exec gateway node seed-campaign.js
const db = require("./db");

const existing = db.getActiveCampaigns().find((c) => c.name === "Scan Report Welcome Sequence");
if (existing) {
  console.log("Campaign already exists and is active:", existing.id);
  process.exit(0);
}

const campaignId = db.createCampaign({
  name: "Scan Report Welcome Sequence",
  durationDays: 10,
  cadenceDays: 7,
});

db.addSequenceStep({
  campaignId,
  dayOffset: 0,
  subject: "Your AI Readiness Score: {{score}}/100",
  bodyTemplate:
    "Hi {{business_name}},\n\n" +
    "Thanks for scanning your website with TechWokx! Here's what we found:\n\n" +
    "Your AI Readiness Score: {{score}}/100\n\n" +
    "{{summary}}\n\n" +
    "Recommended: {{package}} ({{price}}, one-time) — estimated {{timeline}} to launch.\n\n" +
    "What this means for you: {{outcomes}}\n\n" +
    "Reply to this email any time if you have questions about what we found.\n\n" +
    "— TechWokx",
});

db.addSequenceStep({
  campaignId,
  dayOffset: 3,
  subject: "Still thinking it over?",
  bodyTemplate:
    "Hi {{business_name}},\n\nJust checking in — a few days ago we scanned your website " +
    "and found some real opportunities to add AI. Want to chat through what a retrofit " +
    "would actually look like for your business?\n\n— TechWokx",
});

db.addSequenceStep({
  campaignId,
  dayOffset: 7,
  subject: "What AI retrofits look like in practice",
  bodyTemplate:
    "Hi {{business_name}},\n\nHere's what businesses like yours typically see after " +
    "an AI retrofit: faster response times, more qualified leads, and less manual work " +
    "answering the same questions over and over. Want to see how this would apply to you?\n\n— TechWokx",
});

db.addSequenceStep({
  campaignId,
  dayOffset: 10,
  subject: "Last check-in from us",
  bodyTemplate:
    "Hi {{business_name}},\n\nThis is the last note in this sequence — we don't want to " +
    "clutter your inbox. If you'd like to revisit your AI Readiness Score or talk through " +
    "next steps any time, just reply to this email.\n\n— TechWokx",
});

db.activateCampaign(campaignId);
console.log("Created and activated campaign:", campaignId);
