import { useState } from 'react'

export default function App() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [tone, setTone] = useState('Academic')

  async function generate() {
    if(!input.trim()) return
    setLoading(true)
    setOutput('')
    try {
      const res = await fetch('/api/generate', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ prompt: input, tone })
      })
      const data = await res.json()
      setOutput(data.text || 'No output')
    } catch {
      setOutput('Error generating. Check API.')
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
          <textarea className="textarea" placeholder="Enter bullet points: won debate, taught kids, ..." value={input} onChange={e=>setInput(e.target.value)}></textarea>
          <div className="controls">
            <select className="select" value={tone} onChange={e=>setTone(e.target.value)}>
              <option>Academic</option><option>Casual</option><option>Professional</option><option>Story</option>
            </select>
            <button className="btn" onClick={generate} disabled={loading}>{loading?'Writing...':'Generate'}</button>
          </div>
        </div>
        {output && <div className="output card">{output}</div>}
      </div>
    </div>
  )
}
