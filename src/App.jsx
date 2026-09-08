import { useState } from 'react'
import './App.css'

function App() {
  const [bullets, setBullets] = useState('')
  const [essay, setEssay] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!bullets.trim()) return
    setLoading(true)
    setEssay('')
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `You are a vintage college counselor. Write a 450-word warm, personal, chic college essay from these points: ${bullets}. Make it sound human, soft, storytelling, not robotic.` }] }] })
      })
      const data = await res.json()
      setEssay(data.candidates?.[0]?.content?.parts?.[0]?.text || "Couldn't generate, check API key")
    } catch { setEssay("Error - check your Gemini API key in Vercel env") }
    setLoading(false)
  }

  return (
    <div className="app-wrapper">
      <div className="glow-bg"></div>
      <header className="top-header">
        <h1>✦ Flowrite</h1>
        <p>bullet points → timeless essays • powered by gemini</p>
      </header>

      <main className="main-stack">
        <div className="card">
          <h2>Your Bullets</h2>
          <textarea
            placeholder={`Drop your rough points here:\n- Won coding competition\n- Love astrophysics\n- Started book club`}
            value={bullets}
            onChange={(e) => setBullets(e.target.value)}
          />
          <button className="vintage-btn" onClick={generate} disabled={loading}>
            {loading? "weaving your story..." : "Generate Essay →"}
          </button>
        </div>

        {essay && (
          <div className="card result-card">
            <h2>Your Essay</h2>
            <div className="essay-text">{essay}</div>
            <button className="copy-btn" onClick={()=>navigator.clipboard.writeText(essay)}>Copy</button>
          </div>
        )}
      </main>
      <div className="footer">Flowrite — made with ♡ • private & aesthetic</div>
    </div>
  )
}
export default App
