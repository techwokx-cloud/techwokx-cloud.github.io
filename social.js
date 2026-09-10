const BUFFER_API_URL = "https://api.buffer.com";

function isConfigured() {
  return Boolean(process.env.BUFFER_ACCESS_TOKEN);
}

async function graphqlRequest(query) {
  if (!isConfigured()) {
    throw new Error("BUFFER_ACCESS_TOKEN is not configured on the server.");
  }
  const res = await fetch(BUFFER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.BUFFER_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });
  const data = await res.json();
  if (data.errors && data.errors.length > 0) {
    throw new Error(data.errors[0].message || "Buffer GraphQL error");
  }
  return data.data;
}

async function getOrganizationId() {
  const data = await graphqlRequest(`
    query {
      account {
        id
        organizations { id name }
      }
    }
  `);
  const org = data?.account?.organizations?.[0];
  if (!org) throw new Error("No Buffer organization found for this API key.");
  return org.id;
}

// "Channels" is Buffer's new name for what used to be called "profiles" —
// the connected social accounts (Facebook, Instagram, X, etc.).
async function getChannels() {
  const organizationId = await getOrganizationId();
  const data = await graphqlRequest(`
    query {
      channels(input: { organizationId: "${organizationId}" }) {
        id
        name
        service
        avatar
        isQueuePaused
      }
    }
  `);
  return data.channels;
}

// mode: "addToQueue" (next open slot) | "shareNow" (immediately) |
// "customScheduled" (needs dueAt, an ISO 8601 UTC timestamp)
async function createPost({ channelId, text, mode = "addToQueue", dueAt }) {
  const dueAtField =
    mode === "customScheduled" && dueAt ? `dueAt: "${dueAt.toISOString()}"` : "";

  const query = `
    mutation {
      createPost(input: {
        text: ${JSON.stringify(text)}
        channelId: "${channelId}"
        schedulingType: automatic
        mode: ${mode}
        ${dueAtField}
      }) {
        ... on PostActionSuccess {
          post { id text status }
        }
        ... on MutationError {
          message
        }
      }
    }
  `;
  const data = await graphqlRequest(query);
  const result = data.createPost;
  if (result?.message) {
    throw new Error(result.message);
  }
  return result.post;
}

// Aggregated engagement metrics across a date window — the real data the
// campaign strategist uses to decide what to focus on next. Buffer only
// includes metric types that EVERY channel in the filter supports, so we
// query per-channel and merge, rather than passing all channels in one
// call (a mixed set would silently drop network-specific metrics like
// Instagram's `follows`).
async function getAggregatedMetrics({ channelIds, startDateTime, endDateTime }) {
  const organizationId = await getOrganizationId();
  const merged = {};

  for (const channelId of channelIds) {
    const query = `
      query {
        aggregatedPostMetrics(input: {
          organizationId: "${organizationId}"
          startDateTime: "${startDateTime}"
          endDateTime: "${endDateTime}"
          channelIds: ["${channelId}"]
        }) {
          metrics { type value unit }
          metricsUpdatedAt
        }
      }
    `;
    const data = await graphqlRequest(query);
    const metrics = data.aggregatedPostMetrics?.metrics || [];
    for (const m of metrics) {
      merged[m.type] = (merged[m.type] || 0) + m.value;
    }
  }

  return merged; // e.g. { postCount, reactions, comments, reposts, impressions, reach, engagementRate, follows }
}

module.exports = {
  isConfigured,
  getOrganizationId,
  getChannels,
  createPost,
  getAggregatedMetrics,
};
