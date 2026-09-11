const BOOKING_MARKER_RE = /\[BOOKING:\s*([^\]]+)\]/i;

function extractBooking(replyText) {
  const match = replyText.match(BOOKING_MARKER_RE);
  if (!match) return { cleanedText: replyText, booking: null };

  const fields = {};
  match[1].split(";").forEach((pair) => {
    const [key, ...rest] = pair.split("=");
    if (!key || rest.length === 0) return;
    fields[key.trim().toLowerCase()] = rest.join("=").trim();
  });

  const cleanedText = replyText.replace(BOOKING_MARKER_RE, "").replace(/[ \t]+/g, " ").trim();

  if (!fields.name || !fields.contact || !fields.time) {
    // Marker was malformed / incomplete — don't create a broken appointment,
    // just show the cleaned reply as normal.
    return { cleanedText, booking: null };
  }

  return {
    cleanedText,
    booking: {
      clientName: fields.name,
      clientContact: fields.contact,
      requestedTime: fields.time,
      note: fields.note || null,
    },
  };
}

module.exports = { extractBooking };
