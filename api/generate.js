export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { prompt, words = 200, style = 'Authentic' } = req.body;
    const apiKey = process.env.GOOGLE_API_KEY?.trim();

    // YOUR exact model from your cURL
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;

    const r = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are a human student. Write ${words} words essay on "${prompt}" in ${style} tone. Start directly, no As an AI.` }] }],
        generationConfig: { maxOutputTokens: 2500, temperature: 0.8 }
      })
    });

    const data = await r.json();
    if (data.error) return res.status(200).json({ essay: `ERROR: ${data.error.message}` });
    const essay = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ essay: essay || 'Empty - try again' });
  } catch (e) {
    return res.status(200).json({ essay: e.message });
  }
}
