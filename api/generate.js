export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY is missing in Vercel Env Vars" });

    const prompt = req.body?.prompt || "test prompt";

    const resp = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await resp.json();
    console.log("Gemini response:", data);

    if (!resp.ok) {
      return res.status(500).json({ error: "GEMINI_FAILED", geminiMessage: data.error?.message, full: data });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ text });

  } catch (e) {
    return res.status(500).json({ error: "SERVER_CRASH", message: e.message, stack: e.stack });
  }
}
