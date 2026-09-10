let lastCall = 0;

export default async function handler(req, res) {
  try {
    const { text, tone, limit } = req.body || {};
    const topic = (text || "").trim();
    if (!topic) return res.json({ result: "Please enter a topic first." });

    // --- 3 FREE KEYS ROTATION ---
    const KEYS = [
      process.env.GROQ_API_KEY,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3
    ].filter(Boolean).map(k => k.trim());

    const GROQ_KEY = KEYS[Math.floor(Math.random() * KEYS.length)];

    const wordLimit = Math.min(250, parseInt(limit) || 150);
    const neededTokens = 200; // hard cap for free tier

    // --- QUEUE: 1 person at a time, 1.5 sec gap ---
    const now = Date.now();
    const waitNeeded = Math.max(0, lastCall + 1500 - now);
    if (waitNeeded > 0) await new Promise(r => setTimeout(r, waitNeeded));
    lastCall = Date.now();

    for (let attempt = 0; attempt < 4; attempt++) {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": "Bearer " + GROQ_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [{ role: "user", content: `Write a ${tone||'informal'} essay on '${topic}' in ${wordLimit} words.` }],
          max_tokens: neededTokens,
          temperature: 0.7
        }),
      });

      const d = await r.json();
      if (r.ok) return res.json({ result: d.choices[0].message.content, text: d.choices[0].message.content });

      if (JSON.stringify(d).includes("rate_limit")) {
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }
      return res.json({ result: "Error: " + JSON.stringify(d) });
    }

    return res.json({ result: "Server busy! Many students generating. Wait 5 sec and try again ✨" });

  } catch (e) {
    return res.json({ result: "FAIL: " + e.message });
  }
}
