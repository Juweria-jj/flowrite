export default async function handler(req, res) {
  const { text, tone, limit } = req.body || {};
  const topic = (text || '').trim() || "pollution";
  const GROQ_KEY = process.env.GROQ_API_KEY || "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";

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: `Write a ${tone || 'Authentic'} essay on "${topic}" in ${limit || 300} words.` }],
        max_tokens: 800,
        temperature: 0.7
      })
    });
    const d = await r.json();
    if (!r.ok) return res.json({ result: `GROQ ERROR: ${d.error?.message}` });
    const essay = d.choices?.[0]?.message?.content;
    if (!essay) return res.json({ result: `No essay: ${JSON.stringify(d)}` });
    return res.json({ result: essay, text: essay });
  } catch (e) {
    return res.json({ result: `FAIL: ${e.message}` });
  }
}
