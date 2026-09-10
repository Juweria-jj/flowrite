export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method!== 'POST') return res.status(200).json({ essay: 'Use POST' });

  try {
    const body = typeof req.body === 'string'? JSON.parse(req.body) : req.body;
    const prompt = body.prompt || 'purpose of life';
    const words = parseInt(body.words) || 200;

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return res.status(500).json({ essay: 'ERROR: GOOGLE_API_KEY missing in Vercel' });

    // Use 2.0-flash - this is the only one that works with AQ keys
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Write ${words} word essay on: ${prompt}. Write only essay.` }] }],
        generationConfig: { maxOutputTokens: 2000, temperature: 0.7 }
      })
    });

    const data = await resp.json();

    if (data.error) {
      return res.status(200).json({ essay: `GOOGLE ERROR: ${JSON.stringify(data.error)}` });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(200).json({ essay: `NO TEXT. Full response: ${JSON.stringify(data).slice(0,1000)}` });
    }

    return res.status(200).json({ essay: text });

  } catch (e) {
    return res.status(200).json({ essay: `CODE ERROR: ${e.message}` });
  }
}
