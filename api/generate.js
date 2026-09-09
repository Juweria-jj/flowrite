export default async function handler(req, res) {
  try {
    const { text, tone, limit } = req.body || {};
    const topic = (text || '').trim();

    if (!topic) {
      return res.json({ result: "Please enter a topic first." });
    }

    const GROQ_KEY = (process.env.GROQ_API_KEY || "").trim();
    if (!GROQ_KEY) {
      return res.json({ result: "ERROR: GROQ_API_KEY not found in Vercel" });
    }

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + GROQ_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: `Write a ${tone || 'Informal'} essay on '${topic}' in ${limit || 250} words.` }],
        max_tokens: 700
      })
    });

    const d = await r.json();
    if (!r.ok) {
      return res.json({ result: "GROQ ERROR: " + JSON.stringify(d) });
    }

    return res.json({ result: d.choices[0].message.content, text: d.choices[0].message.content });

  } catch (e) {
    return res.json({ result: "FAIL: " + e.message });
  }
}
