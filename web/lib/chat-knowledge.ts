export type KnowledgeEntry = {
  keywords: string[];
  answer: string;
};

export const knowledgeBase: KnowledgeEntry[] = [
  {
    keywords: ["price", "pricing", "cost", "how much", "plan", "plans", "subscription"],
    answer:
      "We have three plans: Starter (AI Assistant) at $79/month, Growth (AI Business) at $199/month — our most popular — and Scale (AI Business Platform) with custom pricing for larger teams. Want me to open the Pricing page for you?",
  },
  {
    keywords: ["scan", "audit", "60 second", "60-second", "readiness score", "how does it work", "how it works"],
    answer:
      "The AI Website Scanner analyzes your site in about 60 seconds and gives you an AI Readiness Score plus your top opportunities — free, no credit card. It's almost ready to launch; enter your URL on this page and we'll email your report the moment it's live.",
  },
  {
    keywords: ["what is techwokx", "what do you do", "what does techwokx do", "about techwokx", "who are you"],
    answer:
      "TechWokx adds an AI layer to your existing website so it can understand, engage and help your customers 24/7 — without a rebuild. Think AI sales agent, support agent, booking agent and knowledge search, all working from your own content.",
  },
  {
    keywords: ["industry", "industries", "hospitality", "healthcare", "retail", "education", "real estate", "professional services"],
    answer:
      "We build for Hospitality, Healthcare, Retail & E-commerce, Professional Services, Education and Real Estate — each with its own AI assistant setup. Which one is closest to your business?",
  },
  {
    keywords: ["solution", "solutions", "feature", "features", "what can ai do", "leads", "bookings", "support agent"],
    answer:
      "Our AI can generate more leads, increase sales, automate customer support, automate bookings, unlock knowledge search across your content, and automate repetitive operations. Check the Solutions page for the full breakdown.",
  },
  {
    keywords: ["contact", "email", "phone", "location", "address", "where are you", "based"],
    answer:
      "We're based in Accra, Ghana. You can reach us at hello@techwokx.com or +233 20 123 4567 — or I can connect you with the team on WhatsApp right now if that's easier.",
  },
  {
    keywords: ["free", "trial", "demo", "credit card"],
    answer:
      "The website scan is 100% free with no credit card required — that's the best way to see what AI could do for your specific site before you commit to anything.",
  },
  {
    keywords: ["team", "who built", "company", "mission"],
    answer:
      "TechWokx is a small team on a mission to make every business website intelligent enough to understand, engage and help its customers. You can read more on our About page.",
  },
];

export function findAnswer(message: string): string | null {
  const text = message.toLowerCase();
  for (const entry of knowledgeBase) {
    if (entry.keywords.some((k) => text.includes(k))) {
      return entry.answer;
    }
  }
  return null;
}
