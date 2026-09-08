import { useState } from 'react'

export default function App() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  async function generate() {
    if (!input.trim()) return
    setLoading(true)
    setOutput('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      })
      const data = await res.json()
      setOutput(data.text || 'No output')
    } catch {
      setOutput('Error — check API key')
    }
    setLoading(false)
  }

  return (
    <div className="app-wrapper">
      <div className="glow-bg"></div>
      <div className="top-header">
        <h1>flowrite</h1>
        <p>Turn bullets into beautiful essays</p>
      </div>

      <div className="main-stack">
        <div className="card">
          <h2>Your points</h2>
          <textarea placeholder="Enter bullet points: won debate, started club, love physics" value={input} onChange={e=>setInput(e.target.value)}></textarea>
          <button className="vintage-btn" onClick={generate} disabled={loading}>
            {loading ? 'Writing...' : 'Generate Essay'}
          </button>
        </div>

        {output && (
          <div className="card result-card">
            <div className="essay-text">{output}</div>
            <button className="copy-btn" onClick={()=>navigator.clipboard.writeText(output)}>Copy essay</button>
          </div>
        )}

        <div className="footer">Flowrite — chic essays from bullets</div>
      </div>
    </div>
  )
}
