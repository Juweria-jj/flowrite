export default async function handler(req, res) {
  const { text, tone, limit } = req.body || {};
  const topic = (text || '').trim() || "pollution";
  const GROQ_KEY = "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"; // your same key

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
        max_tokens: 700,
        temperature: 0.7
      })
    });
    const d = await r.json();
    // SHOW FULL GROQ RESPONSE ON SCREEN
    return res.json({ result: JSON.stringify(d, null, 2), text: JSON.stringify(d, null, 2) });
  } catch (e) {
    return res.json({ result: `CODE FAIL: ${e.message}`, text: `CODE FAIL: ${e.message}` });
  }
}
