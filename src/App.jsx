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
    <div style={{minHeight:'100vh', background:'#fdf8f0', display:'flex', flexDirection:'column', alignItems:'center', padding:'24px 16px 60px'}}>
      <div style={{textAlign:'center', margin:'18px 0 28px'}}>
        <h1 style={{fontSize:'2.8rem', color:'#2d1f1f', margin:0}}>flowrite</h1>
        <p style={{fontSize:'0.78rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'#9a8a82', marginTop:'6px'}}>Turn bullets into beautiful essays</p>
      </div>
      <div style={{width:'100%', maxWidth:'640px', display:'flex', flexDirection:'column', gap:'20px'}}>
        <div style={{background:'white', border:'1px solid #f0e4d3', borderRadius:'24px', padding:'26px'}}>
          <h2 style={{fontSize:'1.1rem', marginBottom:'14px', color:'#4a3737'}}>Your points</h2>
          <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="e.g. won debate..." style={{width:'100%', minHeight:'132px', background:'#fffcf6', border:'1px dashed #dccfc0', borderRadius:'16px', padding:'16px'}} />
          <button onClick={generate} style={{marginTop:'18px', width:'100%', background:'#2d1f1f', color:'#fdf8f0', border:'none', padding:'13px', borderRadius:'30px', cursor:'pointer'}}>{loading?'Writing...':'Generate Essay'}</button>
        </div>
        {output && <div style={{background:'white', border:'1px solid #f0e4d3', borderRadius:'24px', padding:'26px', whiteSpace:'pre-wrap'}}>{output}</div>}
      </div>
    </div>
  )
}
