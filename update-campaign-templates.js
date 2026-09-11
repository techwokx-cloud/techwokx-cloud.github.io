// Run once to upgrade all 4 email templates to the new version with
// report link, unsubscribe link, goal personalization, and (for day 3)
// a DOCX action plan attachment + real pricing:
//   docker compose exec gateway node update-campaign-templates.js
const { db } = require("./db");

const campaign = db
  .prepare("SELECT * FROM campaigns WHERE name = 'Scan Report Welcome Sequence'")
  .get();

if (!campaign) {
  console.log("Campaign not found — nothing to update. Run seed-campaign.js first.");
  process.exit(0);
}

const steps = [
  {
    dayOffset: 0,
    subject: "Your AI Readiness Score: {{score}}/100",
    bodyTemplate:
      "Hi {{business_name}},\n\n" +
      "Thanks for scanning your website with TechWokx! Here's what we found:\n\n" +
      "Your AI Readiness Score: {{score}}/100\n\n" +
      "{{summary}}\n\n" +
      "You told us your priority right now is: {{goal}}. Good to know — I'll keep that in mind.\n\n" +
      "Your full report is attached as a PDF — feel free to share it with your team.\n\n" +
      "Reply to this email any time if you have questions about what we found.\n\n" +
      "— TechWokx\n\n" +
      "---\n" +
      "Don't want these emails? Unsubscribe: {{unsubscribe_link}}",
  },
  {
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
  },
  {
    dayOffset: 7,
    subject: "What AI retrofits look like in practice",
    bodyTemplate:
      "Hi {{business_name}},\n\n" +
      "Here's what businesses like yours typically see after an AI retrofit: faster response times, " +
      "more qualified leads, and less manual work answering the same questions over and over.\n\n" +
      "Given you mentioned {{goal}} as your priority, that's usually one of the first things to improve.\n\n" +
      "Still have that PDF report we sent? Worth another look.\n\n" +
      "Want to see how this would apply to you specifically? Just reply.\n\n" +
      "— TechWokx\n\n" +
      "---\n" +
      "Don't want these emails? Unsubscribe: {{unsubscribe_link}}",
  },
  {
    dayOffset: 10,
    subject: "Last check-in from us",
    bodyTemplate:
      "Hi {{business_name}},\n\n" +
      "This is the last note in this sequence — we don't want to clutter your inbox.\n\n" +
      "If you'd like to revisit your AI Readiness Score (check the PDF from our first email) or talk through next steps " +
      "for {{goal}} any time, just reply to this email.\n\n" +
      "— TechWokx\n\n" +
      "---\n" +
      "Don't want these emails? Unsubscribe: {{unsubscribe_link}}",
  },
];

let updated = 0;
for (const step of steps) {
  const result = db
    .prepare(
      "UPDATE email_sequence_steps SET subject = ?, body_template = ? WHERE campaign_id = ? AND day_offset = ?"
    )
    .run(step.subject, step.bodyTemplate, campaign.id, step.dayOffset);
  updated += result.changes;
}

console.log(`Updated ${updated} row(s) across ${steps.length} steps for campaign #${campaign.id}.`);
