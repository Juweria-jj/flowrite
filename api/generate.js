export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY || "PASTE_YOUR_KEY_HERE_IF_ENV_FAILS";
  const { text, tone, limit } = req.body || {};
  const topic = (text || '').replace(/essay on/gi, '').trim().slice(0,100);

  // Try fastest to slowest - if one is busy, next one works
  const MODELS = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-2.5-flash-lite"
  ];

  for (const model of MODELS) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Write a ${tone || 'Authentic'} essay on "${topic}" in ${limit || 300} words.` }] }],
          generationConfig: { maxOutputTokens: 600, temperature: 0.7 }
        })
      });
      const d = await r.json();
      if (d.error) {
        console.log(`${model} failed: ${d.error.message}`);
        continue; // try next model
      }
      const essay = d.candidates?.[0]?.content?.parts?.[0]?.text;
      if (essay) return res.status(200).json({ result: essay, text: essay });
    } catch (e) {
      continue;
    }
  }
  return res.status(200).json({ result: "All models busy, please retry in 5 sec", text: "All models busy, please retry in 5 sec" });
}
