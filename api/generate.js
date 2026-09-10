let lastCall = 0;
export default async function handler(req, res) {
  try {
    const { text, tone, limit } = req.body || {};
    const topic = (text || "").trim();
    if (!topic) return res.json({ result: "Please enter a topic first." });

    const KEYS = [
      process.env.GROQ_API_KEY,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3
    ].filter(Boolean).map(k => k.trim());
    const GROQ_KEY = KEYS[Math.floor(Math.random() * KEYS.length)];

    const wordLimit = Math.min(250, parseInt(limit) || 150);

    // tiny queue 0.8 sec only
    const now = Date.now();
    const waitNeeded = Math.max(0, lastCall + 800 - now);
    if (waitNeeded > 0) await new Promise(r => setTimeout(r, waitNeeded));
    lastCall = Date.now();

    // ONE try only - no long retry loop
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + GROQ_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: `Write ${tone||'informal'} essay on '${topic}' in ${wordLimit} words.` }],
        max_tokens: 180,
        temperature: 0.7
      }),
    });

    const d = await r.json();

    if (r.ok) return res.json({ result: d.choices[0].message.content });

    // if rate limit, tell user instantly, don't keep loading
    if (JSON.stringify(d).toLowerCase().includes("rate_limit") || JSON.stringify(d).includes("429")) {
      return res.json({ result: "Too many students at once! Wait 10 sec and try again. Your turn is next ✨" });
    }

    return res.json({ result: "Error: " + JSON.stringify(d) });

  } catch (e) {
    return res.json({ result: "FAIL: " + e.message });
  }
}
