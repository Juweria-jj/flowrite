export default async function handler(req, res) {
  const { text, tone, limit } = req.body || {};
  const topic = (text || '').trim() || "pollution";
  const GROQ_KEY = process.env.GROQ_API_KEY;

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + GROQ_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b", // THIS ONE WORKS FOR YOU - 1000 tok/sec
        messages: [{ role: "user", content: "Write a " + (tone||'Informal') + " essay on '" + topic + "' in " + (limit||250) + " words. Simple English." }],
        max_tokens: 600,
        temperature: 0.6
      })
    });
    const d = await r.json();
    if (!r.ok) return res.json({ result: "Groq Error: " + (d.error?.message || JSON.stringify(d)) });
    const essay = d.choices[0].message.content;
    return res.json({ result: essay, text: essay });
  } catch (e) {
    return res.json({ result: "FAIL: " + e.message });
  }
}
