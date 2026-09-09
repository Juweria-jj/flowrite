export default async function handler(req, res) {
  const { text, tone, limit } = req.body || {};
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.json({ result: "KEY missing in Vercel Settings" });

  const topic = (text || '').replace(/essay on/gi, '').trim().slice(0,100);

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Write a ${tone || 'formal'} essay on "${topic}" in ${limit || 200} words` }] }]
      })
    });

    const d = await r.json();
    if (d.error) return res.json({ result: d.error.message, text: d.error.message });

    const essay = d.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.json({ result: essay, text: essay });

  } catch (e) {
    return res.json({ result: e.message, text: e.message });
  }
}
