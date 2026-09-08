export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { text, tone, limit } = req.body
  const topic = text.replace(/essay on/gi, '').trim() || text
  const key = process.env.GEMINI_API_KEY
  if (!key) return res.status(200).json({ result: "Please add GEMINI_API_KEY in Vercel" })

  // Try new models in order - 2.5 is most stable, 3.6 for new API keys
  const models = ["gemini-2.5-flash", "gemini-3.6-flash", "gemini-2.5-flash-lite"]

  for (const model of models) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Write a ${tone} essay on "${topic}" in about ${limit} words. Clear paragraphs, well structured.` }] }]
        })
      })
      const d = await r.json()
      if (d.candidates?.[0]?.content?.parts?.[0]?.text) {
        return res.status(200).json({ result: d.candidates[0].content.parts[0].text })
      }
      if (d.error &&!d.error.message.includes("no longer available")) {
        return res.status(200).json({ result: "API Error: " + d.error.message })
      }
    } catch (e) {}
  }
  return res.status(200).json({ result: "All models failed. Check API key in Vercel." })
}
