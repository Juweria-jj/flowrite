import { useState } from 'react'

export default function App() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  async function generate() {
    if (!input.trim()) return
    setLoading(true)
    try {
      const r = await fetch('/api/generate', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({prompt:input})})
      const d = await r.json()
      setOutput(d.text||'No output')
    } catch { setOutput('Error') }
    setLoading(false)
  }

  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,600&family=Instrument+Sans:wght@400;500&display=swap');
      body,html,#root{background:#fdf8f0 !important; margin:0}
      .glow-bg{position:fixed; inset:0; z-index:-1; background:radial-gradient(600px 400px at 20% 20%, #fde68a 0%, transparent 60%), radial-gradient(500px 300px at 85% 15%, #fecaca 0%, transparent 60%), radial-gradient(700px 500px at 50% 90%, #e9d5ff 0%, transparent 60%); opacity:.9}
      .app-wrapper{min-height:100vh; display:flex; flex-direction:column; align-items:center; padding:24px 16px 60px; background:#fdf8f0}
      .top-header{text-align:center; margin:18px 0 28px}
      .top-header h1{font-family:'Fraunces',serif; font-size:2.8rem; color:#2d1f1f}
      .top-header p{margin-top:6px; font-size:.78rem; letter-spacing:.15em; text-transform:uppercase; color:#9a8a82}
      .main-stack{width:100%; max-width:640px; display:flex; flex-direction:column; gap:20px}
      .card{background:rgba(255,255,255,.72); backdrop-filter:blur(16px); border:1px solid #f0e4d3; border-radius:24px; padding:26px; box-shadow:0 12px 32px rgba(61,46,46,.06)}
      .card h2{font-family:'Fraunces',serif; font-size:1.1rem; margin-bottom:14px; color:#4a3737; font-style:italic}
      textarea{width:100%; min-height:132px; background:#fffcf6; border:1px dashed #dccfc0; border-radius:16px; padding:16px; font-size:.95rem}
      .vintage-btn{margin-top:18px; width:100%; background:#2d1f1f; color:#fdf8f0; border:none; padding:13px; border-radius:30px; font-family:'Fraunces',serif; font-size:1rem; cursor:pointer}
    `}</style>
    <div className="glow-bg"></div>
    <div className="app-wrapper">
      <div className="top-header"><h1>flowrite</h1><p>Turn bullets into beautiful essays</p></div>
      <div className="main-stack">
        <div className="card"><h2>Your points</h2><textarea placeholder="e.g. won debate..." value={input} onChange={e=>setInput(e.target.value)} /><button className="vintage-btn" onClick={generate}>{loading?'Writing...':'Generate Essay'}</button></div>
        {output && <div className="card"><h2>Your essay</h2><div style={{whiteSpace:'pre-wrap', lineHeight:'1.7'}}>{output}</div></div>}
      </div>
    </div>
    </>
  )
}
