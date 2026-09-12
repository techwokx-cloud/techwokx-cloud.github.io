// Two providers:
//  - Fal.ai (FAL_API_KEY): paid, production-grade, fast, and its Flux
//    models render in-image text far more reliably than most — used
//    when configured.
//  - Pollinations: free, no key, no SLA — automatic fallback if Fal.ai
//    isn't configured or a call fails.

function seedFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 1000000;
}

function isFalConfigured() {
  return Boolean(process.env.FAL_API_KEY);
}

async function callFalAi(prompt) {
  const res = await fetch("https://fal.run/fal-ai/flux/schnell", {
    method: "POST",
    headers: {
      Authorization: `Key ${process.env.FAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      image_size: "square_hd",
      num_images: 1,
      enable_safety_checker: true,
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || data.message || `Fal.ai error (${res.status})`);
  }
  const url = data.images?.[0]?.url;
  if (!url) throw new Error("Fal.ai returned no image URL");
  return url;
}

function buildPollinationsUrl(prompt, { width = 1024, height = 1024 } = {}) {
  const seed = seedFromString(prompt);
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;
}

// Confirms a URL actually serves an image before we hand it to a draft or
// a Buffer post — neither provider has a guarantee good enough to skip
// this. Retries with backoff; returns null (graceful text-only fallback)
// if it never succeeds.
async function verifyImageUrl(url, attempts = 2) {
  for (let i = 0; i < attempts; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15_000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.startsWith("image/")) return true;
      console.error(
        `[image-generator] verify attempt ${i + 1} did not return an image (status ${res.status}, content-type ${contentType})`
      );
    } catch (err) {
      console.error(`[image-generator] verify attempt ${i + 1} failed:`, err.message);
    }
    if (i < attempts - 1) await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return false;
}

async function buildVerifiedImageUrl(prompt) {
  if (isFalConfigured()) {
    try {
      const url = await callFalAi(prompt);
      if (await verifyImageUrl(url)) return url;
      console.error("[image-generator] Fal.ai image failed verification, falling back to Pollinations");
    } catch (err) {
      console.error("[image-generator] Fal.ai failed, falling back to Pollinations:", err.message);
    }
  }

  // Pollinations fallback — regenerate-on-fetch with a fixed seed, so
  // retries with a fresh seed genuinely produce a different attempt.
  for (let i = 0; i < 3; i++) {
    const url = buildPollinationsUrl(i === 0 ? prompt : `${prompt} (v${i})`);
    if (await verifyImageUrl(url, 1)) return url;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return null;
}

module.exports = { buildVerifiedImageUrl, isFalConfigured };
