const PACKAGES = {
  assistant: {
    name: "AI Assistant",
    price: "$79",
    period: "one-time",
    timeline: "1-2 weeks",
  },
  business: {
    name: "AI Business",
    price: "$199",
    period: "one-time",
    timeline: "2-3 weeks",
  },
  platform: {
    name: "AI Business Platform",
    price: "Custom quote",
    period: "one-time",
    timeline: "3-6 weeks",
  },
};

const OUTCOME_LIBRARY = {
  "AI Sales": "More qualified leads captured automatically, even outside business hours.",
  "AI Support": "Instant answers to common questions around the clock, freeing up staff time.",
  "AI Search": "Visitors find what they need faster instead of digging through pages, reducing drop-off.",
  "AI Booking": "Appointments and bookings captured without back-and-forth emails or calls.",
};

function recommendPackage(opportunities) {
  const highCount = opportunities.filter((o) => o.level === "HIGH").length;
  if (highCount >= 3) return PACKAGES.platform;
  if (highCount === 2) return PACKAGES.business;
  return PACKAGES.assistant;
}

function buildProjectedOutcomes(opportunities) {
  return opportunities
    .filter((o) => o.level === "HIGH" || o.level === "MEDIUM")
    .map((o) => OUTCOME_LIBRARY[o.area])
    .filter(Boolean);
}

function buildCourseOfAction(pkg) {
  return [
    "Review this report and decide which opportunity area matters most to your business right now.",
    "Reply to this email with any questions — no obligation.",
    "Book a free 15-minute call so we can scope the exact retrofit.",
    `We build and launch within ${pkg.timeline}, starting from your highest-impact area first.`,
  ];
}

function buildBusinessCase({ readinessScore, opportunities }) {
  const recommendedPackage = recommendPackage(opportunities);
  const projectedOutcomes = buildProjectedOutcomes(opportunities);
  const courseOfAction = buildCourseOfAction(recommendedPackage);

  const highCount = opportunities.filter((o) => o.level === "HIGH").length;
  const summary =
    highCount === 0
      ? "Your website already covers most of the basics — a lighter-touch AI Assistant would still sharpen response times and lead capture."
      : `We found ${highCount} high-impact opportunity area${highCount > 1 ? "s" : ""} where AI would make an immediate difference.`;

  return {
    summary,
    recommendedPackage: {
      name: recommendedPackage.name,
      price: recommendedPackage.price,
      period: recommendedPackage.period,
    },
    estimatedTimeline: recommendedPackage.timeline,
    projectedOutcomes,
    courseOfAction,
  };
}

module.exports = { buildBusinessCase };
