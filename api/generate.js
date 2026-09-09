export default async function handler(req, res) {
  try {
    const { text, tone, limit } = req.body || {};
    const topic = (text || '').trim();
    if (!topic) return res.json({ result: "Please enter a topic first." });

    // EMERGENCY - hardcoded so live site works RIGHT NOW
    const GROQ_KEY = "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";

    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + GROQ_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: `Write a ${tone||'informal'} essay on '${topic}' in ${limit||250} words.` }],
        max_tokens: 800
      })
    });

    const d = await r.json();
    if (!r.ok) {
      return res.json({ result: "GROQ ERROR: " + JSON.stringify(d) });
    }
    const essay = d.choices[0].message.content;
    return res.json({ result: essay, text: essay });

  } catch (e) {
    return res.json({ result: "FAIL: " + e.message });
  }
}
