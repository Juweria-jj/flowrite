export const config = { maxDuration: 10 };

export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(200).json({ result: 'POST only', text: 'POST only' });

  const { text, tone, limit } = req.body || {};
  const key = process.env.GEMINI_API_KEY;

  if (!key) return res.status(200).json({ result: 'API KEY missing in Vercel', text: 'API KEY missing' });

  const topic = (text || 'test').replace(/essay on/gi, '').trim().slice(0, 100);

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Write a ${tone || 'formal'} essay on "${topic}" in ${limit || 200} words. Short paragraphs only.` }] }],
        generationConfig: { maxOutputTokens: 200, temperature: 0.6 }
      })
    });

    const d = await r.json();
    if (d.error) return res.status(200).json({ result: d.error.message, text: d.error.message });

    const essay = d.candidates?.[0]?.content?.parts?.[0]?.text || "No essay, try again";
    return res.status(200).json({ result: essay, text: essay });

  } catch (e) {
    return res.status(200).json({ result: "Please try again: " + e.message, text: "Please try again" });
  }
}
