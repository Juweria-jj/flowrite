export const config = { maxDuration: 10 }

export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { text, tone, limit } = req.body
  const topic = text.replace(/essay on/gi, '').trim() || text
  const key = process.env.GEMINI_API_KEY

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Write a ${tone} essay on "${topic}" in about ${limit} words. Well structured paragraphs only.` }] }],
        generationConfig: { maxOutputTokens: 350, temperature: 0.7 } // 350 = FAST, under 10 sec
      })
    })

    const d = await r.json()
    if (d.error) {
      return res.status(200).json({ result: `Error: ${d.error.message}` })
    }
    const essay = d.candidates?.[0]?.content?.parts?.[0]?.text || "No essay generated"
    return res.status(200).json({ result: essay })

  } catch (e) {
    return res.status(200).json({ result: "Error: " + e.message })
  }
}
