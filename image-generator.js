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

module.exports = { buildImageUrl };
