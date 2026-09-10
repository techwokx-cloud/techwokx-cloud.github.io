const cheerio = require("cheerio");
const { buildBusinessCase } = require("./business-case");

const FETCH_TIMEOUT_MS = 8000;
const MAX_HTML_BYTES = 2 * 1024 * 1024; // 2MB cap, keep memory bounded on a 1GB box

const CHAT_WIDGET_SIGNATURES = [
  "intercom",
  "drift.com",
  "tawk.to",
  "crisp.chat",
  "zendesk",
  "tidio",
  "freshchat",
  "livechatinc",
  "customerchat", // Facebook Messenger plugin
  "wa.me",
  "api.whatsapp.com",
  "widget.techwokx", // our own widget, if a client already has it installed
];

const BOOKING_SIGNATURES = [
  "calendly.com",
  "acuityscheduling.com",
  "squareup.com/appointments",
  "setmore.com",
  "booksy.com",
  "simplybook.me",
];

const SERVICE_KEYWORDS = [
  "book an appointment",
  "book a consultation",
  "schedule a",
  "our services",
  "book now",
  "make an appointment",
];

function normalizeUrl(input) {
  let url = (input || "").trim();
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    const parsed = new URL(url);
    return parsed.toString();
  } catch {
    return null;
  }
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const start = Date.now();

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TechWokxScanner/1.0; +https://techwokx.online)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    const responseTimeMs = Date.now() - start;
    const finalUrl = res.url || url;
    const usedHttps = finalUrl.startsWith("https://");

    const reader = res.body?.getReader?.();
    let html = "";
    if (reader) {
      let received = 0;
      const decoder = new TextDecoder();
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        received += value.length;
        html += decoder.decode(value, { stream: true });
        if (received > MAX_HTML_BYTES) {
          controller.abort();
          break;
        }
      }
    } else {
      html = await res.text();
    }

    return {
      ok: res.ok,
      status: res.status,
      html: html.slice(0, MAX_HTML_BYTES),
      responseTimeMs,
      usedHttps,
      finalUrl,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function detectSignatures(html, list) {
  const lower = html.toLowerCase();
  return list.some((sig) => lower.includes(sig));
}

function analyzeHtml(html) {
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim();
  const metaDescription = $('meta[name="description"]').attr("content")?.trim() || "";
  const viewport = $('meta[name="viewport"]').attr("content") || "";
  const ogTitle = $('meta[property="og:title"]').attr("content") || "";
  const ogImage = $('meta[property="og:image"]').attr("content") || "";
  const structuredData = $('script[type="application/ld+json"]').length > 0;

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.split(" ").filter(Boolean).length;

  const hasForm = $("form").length > 0;
  const hasMailto = $('a[href^="mailto:"]').length > 0;
  const hasTel = $('a[href^="tel:"]').length > 0;
  const hasSearchInput =
    $('input[type="search"]').length > 0 ||
    $('input[name*="search" i]').length > 0 ||
    $('[class*="search-box" i], [id*="search-box" i]').length > 0;

  const hasChatWidget = detectSignatures(html, CHAT_WIDGET_SIGNATURES);
  const hasBookingWidget = detectSignatures(html, BOOKING_SIGNATURES);
  const hasServiceLanguage = detectSignatures(html, SERVICE_KEYWORDS);

  return {
    title,
    titleLength: title.length,
    hasGoodTitle: title.length >= 10 && title.length <= 70,
    metaDescription,
    hasMetaDescription: metaDescription.length > 0,
    hasViewport: viewport.length > 0,
    hasOgTags: Boolean(ogTitle || ogImage),
    hasStructuredData: structuredData,
    wordCount,
    hasContactMethod: hasForm || hasMailto || hasTel,
    hasChatWidget,
    hasBookingWidget,
    hasSearchInput,
    hasServiceLanguage,
  };
}

function scoreSite({ usedHttps, responseTimeMs, signals }) {
  const breakdown = {};

  // Technical Health — 30 pts
  breakdown.ssl = usedHttps ? 10 : 0;
  breakdown.mobileViewport = signals.hasViewport ? 10 : 0;
  breakdown.responseTime = responseTimeMs < 2000 ? 10 : responseTimeMs < 4000 ? 5 : 0;

  // Content / SEO — 25 pts
  breakdown.title = signals.hasGoodTitle ? 10 : signals.title ? 4 : 0;
  breakdown.metaDescription = signals.hasMetaDescription ? 10 : 0;
  breakdown.ogTags = signals.hasOgTags ? 5 : 0;

  // Conversion Readiness — 20 pts
  breakdown.contactMethod = signals.hasContactMethod ? 10 : 0;
  breakdown.bookingOrWhatsapp = signals.hasBookingWidget || signals.hasChatWidget ? 10 : 0;

  // AI Readiness — 25 pts
  breakdown.chatWidget = signals.hasChatWidget ? 15 : 0;
  breakdown.structuredData = signals.hasStructuredData ? 10 : 0;

  const total = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  return { total, breakdown };
}

function buildOpportunities(signals) {
  const opportunities = [];

  opportunities.push({
    area: "AI Sales",
    level: !signals.hasContactMethod && !signals.hasBookingWidget ? "HIGH" : "MEDIUM",
    reason: !signals.hasContactMethod
      ? "No lead-capture form, email, or phone link detected — visitors have no easy way to convert."
      : "Basic contact methods exist, but there's no AI qualifying or following up on leads.",
  });

  opportunities.push({
    area: "AI Support",
    level: signals.hasChatWidget ? "MEDIUM" : "HIGH",
    reason: signals.hasChatWidget
      ? "A chat widget is present, but likely isn't AI-powered — still routes everything to a human."
      : "No live chat or messaging widget detected — every question requires a phone call or email.",
  });

  opportunities.push({
    area: "AI Search",
    level: signals.wordCount > 800 && !signals.hasSearchInput ? "MEDIUM" : "LOW",
    reason:
      signals.wordCount > 800 && !signals.hasSearchInput
        ? "Substantial content on the page but no way to search it — visitors have to read everything."
        : "Content volume is light enough that search isn't the highest-impact opportunity yet.",
  });

  opportunities.push({
    area: "AI Booking",
    level: !signals.hasBookingWidget && signals.hasServiceLanguage ? "HIGH" : signals.hasBookingWidget ? "LOW" : "MEDIUM",
    reason: signals.hasBookingWidget
      ? "A booking/scheduling tool is already in place."
      : signals.hasServiceLanguage
      ? "Service/appointment language found on the page, but no booking system — likely phone or email only."
      : "No clear service-booking need detected, but AI booking could still reduce admin overhead.",
  });

  return opportunities;
}

async function scanWebsite(rawUrl) {
  const url = normalizeUrl(rawUrl);
  if (!url) {
    const err = new Error("Invalid URL");
    err.statusCode = 400;
    throw err;
  }

  let fetched;
  try {
    fetched = await fetchHtml(url);
  } catch (e) {
    const err = new Error(
      e.name === "AbortError"
        ? "The website took too long to respond (timed out)."
        : `Could not reach that website: ${e.message}`
    );
    err.statusCode = 502;
    throw err;
  }

  if (!fetched.ok) {
    const err = new Error(`Website responded with HTTP ${fetched.status}`);
    err.statusCode = 502;
    throw err;
  }

  const signals = analyzeHtml(fetched.html);
  const score = scoreSite({
    usedHttps: fetched.usedHttps,
    responseTimeMs: fetched.responseTimeMs,
    signals,
  });
  const opportunities = buildOpportunities(signals);
  const businessCase = buildBusinessCase({ readinessScore: score.total, opportunities });

  return {
    url: fetched.finalUrl,
    scannedAt: new Date().toISOString(),
    readinessScore: score.total,
    scoreBreakdown: score.breakdown,
    responseTimeMs: fetched.responseTimeMs,
    signals: {
      https: fetched.usedHttps,
      mobileFriendly: signals.hasViewport,
      title: signals.title,
      hasMetaDescription: signals.hasMetaDescription,
      hasOpenGraphTags: signals.hasOgTags,
      hasStructuredData: signals.hasStructuredData,
      hasContactMethod: signals.hasContactMethod,
      hasChatWidget: signals.hasChatWidget,
      hasBookingWidget: signals.hasBookingWidget,
      wordCount: signals.wordCount,
    },
    opportunities,
    businessCase,
  };
}

module.exports = { scanWebsite, normalizeUrl };
