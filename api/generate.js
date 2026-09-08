export const config = { maxDuration: 10 }

export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { text, tone, limit } = req.body
  const topic = text.replace(/essay on/gi, '').trim() || text
  const key = process.env.GEMINI_API_KEY

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000) // 15 sec max

  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Write a ${tone} essay on "${topic}" in exactly ${limit} words. Short paragraphs.` }] }],
        generationConfig: { maxOutputTokens: 800, temperature: 0.7 }
      })
    })
    clearTimeout(timeout)
    const d = await r.json()
    const essay = d.candidates?.[0]?.content?.parts?.[0]?.text || "Failed - " + JSON.stringify(d.error)
    return res.status(200).json({ result: essay })
  } catch (e) {
    clearTimeout(timeout)
    return res.status(200).json({ result: "Generation timed out. Try again with shorter word count (100 words)." })
  }
}
