export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt, words = 200, style = "Authentic" } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) return res.status(500).json({ error: 'GOOGLE_API_KEY not set in Vercel' });

  const wordCount = parseInt(words) || 200;

  const systemPrompt = `You are an essay writer. Write exactly ${wordCount} words in ${style} style. Topic: ${prompt}. Start writing immediately, no preamble.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt }] }],
        generationConfig: {
          maxOutputTokens: wordCount * 3,
          temperature: 0.9,
        }
      })
    });

    const data = await response.json();

    if (data.error) return res.status(500).json({ error: `Google Error: ${JSON.stringify(data.error)}` });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) return res.status(500).json({ error: 'No text returned', raw: data });

    return res.status(200).json({ essay: text });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
