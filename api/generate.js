export const config = { maxDuration: 10 }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method!== 'POST') return res.status(200).json({ result: 'Use POST', text: 'Use POST' });

  try {
    const body = req.body || {};
    const prompt = body.text || body.prompt || body.topic || 'test';
    const tone = body.tone || 'Formal';
    const limit = body.limit || '300';
    const key = process.env.GEMINI_API_KEY;

    if (!key) return res.status(200).json({ result: 'API KEY MISSING in Vercel', text: 'API KEY MISSING in Vercel' });

    const topic = prompt.replace(/essay on/gi,'').trim();

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Write a ${tone} essay on "${topic}" in about ${limit} words.` }] }],
        generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
      })
    });

    const d = await r.json();
    if (d.error) {
      return res.status(200).json({ result: d.error.message, text: d.error.message });
    }
    const essay = d.candidates?.[0]?.content?.parts?.[0]?.text || 'No text';
    return res.status(200).json({ result: essay, text: essay });

  } catch (e) {
    return res.status(200).json({ result: 'Server error: ' + e.message, text: 'Server error: ' + e.message });
  }
}
