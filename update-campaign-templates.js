// Run once to upgrade the day-0 email template to include score, package,
// price, timeline, and projected outcomes:
//   docker compose exec gateway node update-campaign-templates.js
const { db } = require("./db");

const campaign = db
  .prepare("SELECT * FROM campaigns WHERE name = 'Scan Report Welcome Sequence'")
  .get();

if (!campaign) {
  console.log("Campaign not found — nothing to update. Run seed-campaign.js first.");
  process.exit(0);
}

const newSubject = "Your AI Readiness Score: {{score}}/100";
const newBody =
  "Hi {{business_name}},\n\n" +
  "Thanks for scanning your website with TechWokx! Here's what we found:\n\n" +
  "Your AI Readiness Score: {{score}}/100\n\n" +
  "{{summary}}\n\n" +
  "Recommended: {{package}} ({{price}}, one-time) — estimated {{timeline}} to launch.\n\n" +
  "What this means for you: {{outcomes}}\n\n" +
  "Reply to this email any time if you have questions about what we found.\n\n" +
  "— TechWokx";

const result = db
  .prepare(
    "UPDATE email_sequence_steps SET subject = ?, body_template = ? WHERE campaign_id = ? AND day_offset = 0"
  )
  .run(newSubject, newBody, campaign.id);

console.log(`Updated ${result.changes} row(s) for campaign #${campaign.id}, day 0.`);
