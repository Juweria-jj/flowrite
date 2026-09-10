export default async function handler(req, res) {
  try {
    const { text, tone, limit } = req.body || {};
    const topic = (text || "").trim();
    if (!topic) return res.json({ result: "Please enter a topic first." });

    const GOOGLE_KEY = (process.env.GOOGLE_API_KEY || "").trim();
    const wordLimit = parseInt(limit) || 200;

    const prompt = `Write a ${tone||'informal'} essay on '${topic}' in exactly ${wordLimit} words. Be authentic, human-like, no AI phrases.`;

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GOOGLE_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.7 }
        }),
      }
    );

    const d = await r.json();

    if (!r.ok) {
      return res.json({ result: `Google Error: ${JSON.stringify(d)}` });
    }

    const textOut = d.candidates?.[0]?.content?.parts?.[0]?.text || "No result";
    return res.json({ result: textOut, text: textOut });

  } catch (e) {
    return res.json({ result: "FAIL: " + e.message });
  }
}
