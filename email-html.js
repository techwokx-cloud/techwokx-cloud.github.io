// Converts the plain-text email bodies (single source of truth, used as
// the `text` fallback for spam filters and text-only clients) into a
// properly branded HTML version for everything else.

const UNSUBSCRIBE_TRAILER_RE = /\n*---\s*\nDon't want these emails\? Unsubscribe: (\S+)\s*$/i;

function textToHtmlEmail(filledText) {
  let unsubscribeUrl = null;
  let body = filledText;

  const match = filledText.match(UNSUBSCRIBE_TRAILER_RE);
  if (match) {
    unsubscribeUrl = match[1];
    body = filledText.slice(0, match.index).trim();
  }

  const paragraphs = body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 16px;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f8f9fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
    <div style="background:linear-gradient(135deg,#7c3aed,#3b82f6);border-radius:16px 16px 0 0;padding:24px 32px;">
      <span style="color:#fff;font-size:18px;font-weight:700;letter-spacing:-0.02em;">TechWokx</span>
    </div>
    <div style="background:#fff;border-radius:0 0 16px 16px;padding:32px;box-shadow:0 4px 20px rgba(0,0,0,0.04);">
      <div style="font-size:15px;line-height:1.6;color:#1a1a2e;">
        ${paragraphs}
      </div>
    </div>
    <div style="text-align:center;padding:24px 0;">
      <p style="font-size:12px;color:#94a3b8;margin:0 0 6px;">TechWokx AI Solutions · Accra, Ghana</p>
      ${
        unsubscribeUrl
          ? `<p style="font-size:12px;margin:0;"><a href="${unsubscribeUrl}" style="color:#94a3b8;text-decoration:underline;">Unsubscribe from these emails</a></p>`
          : ""
      }
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

module.exports = { textToHtmlEmail };
