export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { text, tone, limit } = req.body
  const topic = text.replace(/essay on/gi, '').trim() || text

  const key = process.env.GEMINI_API_KEY
  if (!key) return res.status(200).json({ result: "Please add GEMINI_API_KEY in Vercel Environment Variables" })

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Write a ${tone} essay on "${topic}" in about ${limit} words. Paragraphs only, well structured.` }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 1500 }
      })
    })
    const d = await r.json()
    const essay = d.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(d)
    return res.status(200).json({ result: essay })
  } catch (e) {
    return res.status(500).json({ result: "Error: " + e.message })
  }
}
