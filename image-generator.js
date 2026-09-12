// Pollinations.ai — genuinely free, no API key required. The image is
// generated on-demand when the URL is fetched, so we don't download or
// host anything ourselves; we hand the URL straight to Buffer, which
// fetches it directly when the post actually goes out.
//
// A fixed seed (derived from the prompt) makes repeated fetches of the
// same URL regenerate the same image, so it looks consistent if Buffer
// fetches it later than we generated it (e.g. a queued post).

function seedFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 1000000;
}

function buildImageUrl(prompt, { width = 1024, height = 1024 } = {}) {
  const seed = seedFromString(prompt);
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;
}

// Pollinations has no uptime SLA, so verify the image actually comes back
// before handing the URL to a draft/post — otherwise a failed generation
// shows up as a broken image in the dashboard (or, worse, a failed Buffer
// post later). Retries with a short backoff; gives up and returns null
// after a few attempts so the caller can fall back to a text-only post
// rather than storing a URL that doesn't work.
async function buildVerifiedImageUrl(prompt, options = {}, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    const url = buildImageUrl(prompt, options);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15_000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      const contentType = res.headers.get("content-type") || "";
      if (res.ok && contentType.startsWith("image/")) {
        return url;
      }
      console.error(
        `[image-generator] attempt ${i + 1} did not return an image (status ${res.status}, content-type ${contentType})`
      );
    } catch (err) {
      console.error(`[image-generator] attempt ${i + 1} failed:`, err.message);
    }
    if (i < attempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
  return null;
}

module.exports = { buildImageUrl, buildVerifiedImageUrl };
