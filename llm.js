const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

const GEMINI_MODEL = "gemini-3.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function callGroq({ systemPrompt, history, message }) {
  if (!process.env.GROQ_API_KEY) throw new Error("GROQ_API_KEY not configured");

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((h) => ({ role: h.role === "assistant" ? "assistant" : "user", content: h.content })),
    { role: "user", content: message },
  ];

  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({ model: GROQ_MODEL, messages, temperature: 0.6, max_tokens: 400 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Groq error (${res.status})`);
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq returned an empty response");
  return text;
}

async function callGemini({ systemPrompt, history, message }) {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

  const contents = [
    ...history.map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || `Gemini error (${res.status})`);
  const parts = data.candidates?.[0]?.content?.parts || [];
  const text = parts.map((p) => p.text || "").join("");
  if (!text) throw new Error("Gemini returned an empty response");
  return text;
}

// Tries each configured provider in order, returns the first success.
// Throws only if every provider fails (or none are configured).
async function chatCompletion({ systemPrompt, history = [], message }) {
  const providers = [
    { name: "groq", fn: callGroq },
    { name: "gemini", fn: callGemini },
  ];

  const errors = [];
  for (const provider of providers) {
    try {
      const text = await provider.fn({ systemPrompt, history, message });
      return { text, provider: provider.name };
    } catch (err) {
      errors.push(`${provider.name}: ${err.message}`);
    }
  }
  throw new Error(`All LLM providers failed — ${errors.join(" | ")}`);
}

module.exports = { chatCompletion };
