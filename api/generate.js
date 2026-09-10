export default async function handler(req, res) {
  try {
    const { text, tone, limit } = req.body || {};
    const topic = (text || "").trim();
    if (!topic) return res.json({ result: "Please enter a topic first." });

    const GROQ_KEY = (process.env.GROQ_API_KEY || "").trim();
    const wordLimit = parseInt(limit) || 250;
    const neededTokens = Math.min(350, Math.max(120, Math.round(wordLimit * 1.4)));

    // retry 3 times if rate limit hits
    let lastError = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + GROQ_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b",
          messages: [{ role: "user", content: `Write a ${tone||'informal'} essay on '${topic}' in ${wordLimit} words.` }],
          max_tokens: neededTokens,
          temperature: 0.7
        }),
      });

      const d = await r.json();

      if (r.ok) {
        return res.json({ result: d.choices[0].message.content, text: d.choices[0].message.content });
      }

      // if rate limited, wait and retry
      if (d.error?.code === "rate_limit_exceeded" || JSON.stringify(d).includes("rate_limit")) {
        lastError = d;
        const waitSec = parseFloat(d.error?.message?.match(/try again in ([\d.]+)s/)?.[1] || "3.5");
        await new Promise(r => setTimeout(r, (waitSec + 0.5) * 1000));
        continue; // retry loop
      } else {
        return res.json({ result: "GROQ ERROR: " + JSON.stringify(d) });
      }
    }

    // if still fails after 3 retries
    return res.json({ result: `Server is busy right now (many people using it). Please wait 5 seconds and click Generate again. ✨` });

  } catch (e) {
    return res.json({ result: "FAIL: " + e.message });
  }
}
