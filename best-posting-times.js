// General best-practice posting hours (Accra/GMT is UTC+0 year-round,
// so these hours are used directly as UTC — no timezone conversion
// needed). These are reasonable defaults, not audience-specific data —
// swap in real analytics-driven times later if available.
const BEST_HOUR_UTC = {
  facebook: 13, // early-to-mid afternoon
  instagram: 11, // late morning
  twitter: 9, // morning
};

// Returns the next occurrence of that channel's best hour — today if
// it hasn't passed yet, otherwise tomorrow.
function nextBestTime(channelService, now = new Date()) {
  const hour = BEST_HOUR_UTC[channelService] ?? 12;
  const candidate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hour, 0, 0)
  );
  if (candidate <= now) {
    candidate.setUTCDate(candidate.getUTCDate() + 1);
  }
  return candidate;
}

module.exports = { nextBestTime, BEST_HOUR_UTC };
