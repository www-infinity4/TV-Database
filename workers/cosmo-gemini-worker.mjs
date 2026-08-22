const DEFAULT_MODEL = "gemini-3.7-flash";
const MAX_INPUT = 4000;
const MAX_SYSTEM = 14000;
const ALLOWED_ORIGINS = new Set([
  "https://www-infinity4.github.io",
  "http://localhost:8000",
  "http://127.0.0.1:8000",
]);

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : "https://www-infinity4.github.io";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function json(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) },
  });
}

function sanitizeConversation(value) {
  if (!Array.isArray(value)) return [];
  return value.slice(-12).map((message) => ({
    role: message && message.role === "assistant" ? "model" : "user",
    parts: [{ text: String(message && (message.content || message.text) || "").slice(0, 2000) }],
  })).filter((message) => message.parts[0].text);
}

export async function handleRequest(request, env) {
  const origin = request.headers.get("Origin") || "";
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
  if (request.method !== "POST") return json({ error: "POST required" }, 405, origin);
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: "Origin not allowed" }, 403, origin);
  if (!env || !env.GEMINI_API_KEY) return json({ error: "GEMINI_API_KEY is not configured" }, 503, origin);

  let body;
  try { body = await request.json(); } catch (_) { return json({ error: "Invalid JSON" }, 400, origin); }
  const input = String(body && body.input || "").trim().slice(0, MAX_INPUT);
  if (!input) return json({ error: "input is required" }, 400, origin);
  const context = body && body.context || {};
  const suppliedSystem = String(context.system || "").slice(0, MAX_SYSTEM);
  const safetySystem = [
    "You are Cosmo, the StarQuest viewing companion.",
    "Use only context deliberately supplied by StarQuest or the viewer.",
    "Never claim to read minds, private thoughts, other tabs, browser history, inaccessible video, or private messages.",
    "Never claim actors, filmmakers, media, or Hollywood are responding to the viewer personally.",
    "Do not fabricate scene awareness, timestamps, facts, availability, transactions, or prices.",
    "If a watch-along request lacks grounded evidence, respond exactly NO_COMMENT.",
    "Do not execute payments, mint currency, or claim an external action succeeded.",
  ].join(" ");
  const contents = sanitizeConversation(context.conversation);
  contents.push({ role: "user", parts: [{ text: input }] });
  const model = String(env.GEMINI_MODEL || DEFAULT_MODEL).replace(/[^a-zA-Z0-9._-]/g, "") || DEFAULT_MODEL;

  const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: safetySystem + "\n" + suppliedSystem }] },
      contents,
      generationConfig: { temperature: 0.55, maxOutputTokens: 700 },
    }),
  });
  if (!upstream.ok) {
    const errorText = (await upstream.text()).slice(0, 500);
    return json({ error: "Gemini request failed", status: upstream.status, detail: errorText }, 502, origin);
  }
  const result = await upstream.json();
  const output = (((result.candidates || [])[0] || {}).content || {}).parts || [];
  const text = output.map((part) => part.text || "").join("\n").trim();
  if (!text) return json({ error: "Gemini returned no text" }, 502, origin);
  return json({ output: text, provider: "gemini", model }, 200, origin);
}

export default { fetch: handleRequest };
