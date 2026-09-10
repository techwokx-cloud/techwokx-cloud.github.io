const OBJECTIVES = ["engagement", "followers", "leads", "customers"];

const ACTION_LIBRARY = {
  engagement: [
    "Shift next cycle's content mix toward polls and quizzes — they reliably drive more comments/reactions than announcement-style posts.",
    "Reply to every comment on the last cycle's posts within 24 hours; reply-rate is one of the biggest engagement-rate levers.",
    "Post at the times your channel's own history shows the highest reaction rate, not just a fixed daily slot.",
  ],
  followers: [
    "Run 1-2 posts this cycle explicitly inviting follows (e.g. 'follow for weekly AI tips'), rather than assuming it happens passively.",
    "Cross-promote the strongest-performing post from last cycle on the channel(s) with the lowest follower growth.",
    "Add a follow-oriented call to action to bios/link-in-bio pointing at the free website scan as the hook.",
  ],
  leads: [
    "Increase how often the scan CTA appears in posts and email footers this cycle — leads track closely with scan volume.",
    "Test a stronger, more specific headline on the scan landing widget (e.g. naming a concrete opportunity area) to lift scan-to-lead conversion.",
    "Prioritize content formats (case study snippets, before/after scores) that have historically driven the most link clicks to the scanner.",
  ],
  customers: [
    "Review the email sequence step with the lowest completion/reply rate and rewrite its subject line and opening line.",
    "Add a WhatsApp touchpoint partway through the sequence for leads who haven't opened the last two emails.",
    "Shorten the sequence or move the strongest CTA earlier if most drop-off happens before day 7.",
  ],
};

function pctChange(current, previous) {
  if (previous === null || previous === undefined) return null;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function buildObjectiveScores(metrics, previousMetrics) {
  const engagementNow = metrics.engagementRate ?? metrics.reactions ?? 0;
  const engagementPrev = previousMetrics
    ? previousMetrics.engagementRate ?? previousMetrics.reactions ?? 0
    : null;

  const followersNow = metrics.follows ?? 0;
  const followersPrev = previousMetrics ? previousMetrics.follows ?? 0 : null;

  const leadsNow = metrics.scanToLeadRate ?? 0;
  const leadsPrev = previousMetrics ? previousMetrics.scanToLeadRate ?? 0 : null;

  const customersNow = metrics.sequenceCompletionRate ?? 0;
  const customersPrev = previousMetrics ? previousMetrics.sequenceCompletionRate ?? 0 : null;

  return {
    engagement: { value: engagementNow, change: pctChange(engagementNow, engagementPrev) },
    followers: { value: followersNow, change: pctChange(followersNow, followersPrev) },
    leads: { value: leadsNow, change: pctChange(leadsNow, leadsPrev) },
    customers: { value: customersNow, change: pctChange(customersNow, customersPrev) },
  };
}

function recommendObjective(metrics, previousMetrics) {
  const scores = buildObjectiveScores(metrics, previousMetrics);

  // No prior period to compare against — first report, default to the
  // core of the funnel and say so plainly.
  const hasBaseline = Object.values(scores).some((s) => s.change !== null);
  if (!hasBaseline) {
    return {
      objective: "leads",
      reasoning:
        "This is the first monthly report, so there's no prior period to compare against yet. " +
        "Defaulting to a lead-generation focus since that's the top of the funnel everything else depends on. " +
        "Next month's report will be able to compare against this baseline.",
      courseOfAction: ACTION_LIBRARY.leads,
      scores,
    };
  }

  // Pick the objective with the worst (most negative, or least positive)
  // change — the thing most in need of attention next cycle.
  let worst = null;
  for (const obj of OBJECTIVES) {
    const change = scores[obj].change;
    if (change === null) continue;
    if (worst === null || change < scores[worst].change) {
      worst = obj;
    }
  }

  const worstScore = scores[worst];
  const direction = worstScore.change < 0 ? "declined" : "grew the least";
  const reasoning =
    `Compared to the previous period, ${worst} ${direction} ` +
    `(${worstScore.change > 0 ? "+" : ""}${worstScore.change}%), the weakest movement among the four ` +
    `objectives tracked (engagement ${scores.engagement.change}%, followers ${scores.followers.change}%, ` +
    `leads ${scores.leads.change}%, customers ${scores.customers.change}%). ` +
    `Recommending ${worst} as the focus for the next campaign cycle.`;

  return {
    objective: worst,
    reasoning,
    courseOfAction: ACTION_LIBRARY[worst],
    scores,
  };
}

module.exports = { recommendObjective, buildObjectiveScores, OBJECTIVES };
