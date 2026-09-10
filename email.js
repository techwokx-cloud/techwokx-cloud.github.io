const { Resend } = require("resend");

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "TechWokx <hello@techwokx.online>";

function fillTemplate(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => (vars[key] ?? ""));
}

async function sendEmail({ to, subject, bodyTemplate, vars = {} }) {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured on the server.");
  }
  const text = fillTemplate(bodyTemplate, vars);
  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: fillTemplate(subject, vars),
    text,
  });
  if (result.error) {
    throw new Error(result.error.message || "Resend API error");
  }
  return result.data?.id || null;
}

module.exports = { sendEmail, fillTemplate, isConfigured: () => Boolean(resend) };
