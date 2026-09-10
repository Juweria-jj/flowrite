export default async function handler(req, res) {
  if (req.method!== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { prompt, topic, type } = req.body;
    const finalPrompt = prompt || topic || 'Write an essay';

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not set in Vercel' });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: finalPrompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Error:", data);
      return res.status(500).json({ error: data.error?.message || 'Gemini failed', details: data });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI";
    return res.status(200).json({ text: text, output: text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
