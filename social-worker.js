const db = require("./db");
const social = require("./social");

async function processSocialPosts() {
  if (!social.isConfigured()) {
    return { skipped: true, reason: "BUFFER_ACCESS_TOKEN not configured" };
  }

  const due = db.getDueSocialPosts();
  let posted = 0;
  let failed = 0;

  for (const post of due) {
    try {
      const result = await social.createPost({
        channelId: post.profile_id,
        text: post.content,
        mode: "addToQueue",
      });
      db.markSocialPostResult(post.id, { status: "posted", bufferUpdateId: result?.id });
      posted += 1;
    } catch (err) {
      db.markSocialPostResult(post.id, { status: "failed" });
      failed += 1;
      console.error(`[social-worker] failed to post #${post.id}:`, err.message);
    }
  }

  return { skipped: false, checked: due.length, posted, failed };
}

function startSocialWorker(intervalMs = 5 * 60 * 1000) {
  setTimeout(() => processSocialPosts().then(logResult), 15_000);
  setInterval(() => processSocialPosts().then(logResult), intervalMs);
}

function logResult(result) {
  if (result.skipped) return;
  if (result.posted > 0 || result.failed > 0) {
    console.log(
      `[social-worker] checked ${result.checked} post(s): ${result.posted} posted, ${result.failed} failed`
    );
  }
}

module.exports = { processSocialPosts, startSocialWorker };
