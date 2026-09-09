export default async function handler(req, res) {
  const { text, tone, limit } = req.body || {};
  const topic = (text || '').trim() || "pollution";

  // PASTE YOUR GROQ KEY HERE - DIRECTLY
  const GROQ_KEY = "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";

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: `Write a ${tone || 'Authentic'} essay on "${topic}" in ${limit || 300} words.` }],
        max_tokens: 700,
        temperature: 0.7
      })
    });

    const d = await r.json();
    console.log("GROQ response:", JSON.stringify(d));

    if (d.error) {
      return res.json({ result: `Groq Error: ${d.error.message}`, text: `Groq Error: ${d.error.message}` });
    }

    const essay = d.choices?.[0]?.message?.content;
    if (essay) {
      return res.json({ result: essay, text: essay });
    } else {
      return res.json({ result: "No essay from Groq, check key", text: "No essay from Groq" });
    }
  } catch (e) {
    return res.json({ result: `CODE FAIL: ${e.message}`, text: `CODE FAIL: ${e.message}` });
  }
}
