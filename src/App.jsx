import { useState } from 'react'

export default function App() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  async function generate() {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      })
      const data = await res.json()
      setOutput(data.text || 'No output')
    } catch { setOutput('Error generating') }
    setLoading(false)
  }

  return (
    <>
      <div className="glow-bg"></div>
      <div className="app-wrapper">
        <div className="top-header">
          <h1>flowrite</h1>
          <p>Turn bullets into beautiful essays</p>
        </div>
        <div className="main-stack">
          <div className="card">
            <h2>Your points</h2>
            <textarea placeholder="e.g. won debate, started club..." value={input} onChange={e=>setInput(e.target.value)} />
            <button className="vintage-btn" onClick={generate}>{loading ? 'Writing...' : 'Generate Essay'}</button>
          </div>
          {output && (
            <div className="card">
              <h2>Your essay</h2>
              <div style={{whiteSpace:'pre-wrap', lineHeight:'1.7'}}>{output}</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
