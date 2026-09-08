import { useState } from 'react'

export default function App() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [tone, setTone] = useState('Academic')

  async function generate() {
    if(!input.trim()) return
    setLoading(true)
    try {
      const r = await fetch('/api/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ prompt: input, tone }) })
      const d = await r.json()
      setOutput(d.text || 'No output')
    } catch { setOutput('Error - check API key') }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh', background:'#fdf8f0', padding:'40px 16px', display:'flex', flexDirection:'column', alignItems:'center'}}>
      <div style={{textAlign:'center', marginBottom:'28px'}}>
        <h1 style={{fontFamily:'serif', fontSize:'48px', fontWeight:600, color:'#2c2420'}}>flowrite</h1>
        <p style={{color:'#9a8a7d', marginTop:'8px'}}>Turn bullets into beautiful essays</p>
      </div>
      <div style={{width:'100%', maxWidth:'720px', background:'#fffdf9', border:'1px solid #efe6d5', borderRadius:'20px', padding:'20px'}}>
        <textarea style={{width:'100%', minHeight:'120px', border:'1px solid #efe6d5', borderRadius:'14px', padding:'12px', background:'#fffefc'}} placeholder="Enter bullets: won debate, taught kids..." value={input} onChange={e=>setInput(e.target.value)} />
        <div style={{display:'flex', gap:'12px', marginTop:'12px'}}>
          <select style={{padding:'8px', borderRadius:'10px', border:'1px solid #efe6d5'}} value={tone} onChange={e=>setTone(e.target.value)}>
            <option>Academic</option><option>Casual</option><option>Professional</option>
          </select>
          <button onClick={generate} disabled={loading} style={{padding:'10px 20px', borderRadius:'999px', border:'none', background:'#2c2420', color:'#fdf8f0', cursor:'pointer'}}>{loading?'Writing...':'Generate'}</button>
        </div>
        {output && <div style={{marginTop:'20px', background:'#fffefc', border:'1px solid #efe6d5', borderRadius:'16px', padding:'16px', whiteSpace:'pre-wrap', lineHeight:1.7}}>{output}</div>}
      </div>
    </div>
  )
}
