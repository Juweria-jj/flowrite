export default async function handler(req, res) {
  if (req.method!== 'POST') {
    return res.status(200).json({ text: "API is working, use POST" });
  }
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ error: "GEMINI_API_KEY missing in Vercel" });
    }
    const prompt = req.body?.prompt || req.body?.topic || "Write a 200 word essay";

    const resp = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
          "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await resp.json();
    if (!resp.ok) {
      return res.status(500).json({ error: data.error?.message || "Gemini error", data });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return res.status(200).json({ text: text, output: text });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
