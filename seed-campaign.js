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
    "You told us your priority right now is: {{goal}}. Good to know — I'll keep that in mind.\n\n" +
    "Full report (share it with your team if useful): {{report_url}}\n\n" +
    "Reply to this email any time if you have questions about what we found.\n\n" +
    "— TechWokx\n\n" +
    "---\n" +
    "Don't want these emails? Unsubscribe: {{unsubscribe_link}}",
});

db.addSequenceStep({
  campaignId,
  dayOffset: 3,
  subject: "Your AI Action Plan for {{business_name}}",
  bodyTemplate:
    "Hi {{business_name}},\n\n" +
    "Based on your scan and your focus on {{goal}}, I've put together a tailored action plan " +
    "(attached as a Word doc) — what we found, what we'd recommend first, and real pricing.\n\n" +
    "Quick version: {{package}} ({{price}}, one-time) would be the right starting point, with an " +
    "estimated {{timeline}} to launch.\n\n" +
    "What this means for you: {{outcomes}}\n\n" +
    "No pressure — take a look, reply with any questions, or we can hop on a quick call to walk " +
    "through it together.\n\n" +
    "— TechWokx\n\n" +
    "---\n" +
    "Don't want these emails? Unsubscribe: {{unsubscribe_link}}",
});

db.addSequenceStep({
  campaignId,
  dayOffset: 7,
  subject: "What AI retrofits look like in practice",
  bodyTemplate:
    "Hi {{business_name}},\n\n" +
    "Here's what businesses like yours typically see after an AI retrofit: faster response times, " +
    "more qualified leads, and less manual work answering the same questions over and over.\n\n" +
    "Given you mentioned {{goal}} as your priority, that's usually one of the first things to improve.\n\n" +
    "Still have your report handy? {{report_url}}\n\n" +
    "Want to see how this would apply to you specifically? Just reply.\n\n" +
    "— TechWokx\n\n" +
    "---\n" +
    "Don't want these emails? Unsubscribe: {{unsubscribe_link}}",
});

db.addSequenceStep({
  campaignId,
  dayOffset: 10,
  subject: "Last check-in from us",
  bodyTemplate:
    "Hi {{business_name}},\n\n" +
    "This is the last note in this sequence — we don't want to clutter your inbox.\n\n" +
    "If you'd like to revisit your AI Readiness Score ({{report_url}}) or talk through next steps " +
    "for {{goal}} any time, just reply to this email.\n\n" +
    "— TechWokx\n\n" +
    "---\n" +
    "Don't want these emails? Unsubscribe: {{unsubscribe_link}}",
});

db.activateCampaign(campaignId);
console.log("Created and activated campaign:", campaignId);
