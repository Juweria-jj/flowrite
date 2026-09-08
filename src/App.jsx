import { useState, useEffect } from 'react'

export default function App() {
  const [bullets, setBullets] = useState('')
  const [essay, setEssay] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.body.style.background = '#fdf8f0'
  }, [])

  const generate = async () => {
    if (!bullets.trim()) return
    setLoading(true)
    setEssay('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullets })
      })
      const data = await res.json()
      setEssay(data.essay || 'No essay returned')
    } catch {
      setEssay('Error: Could not reach API')
    }
    setLoading(false)
  }

  return (
    <div style={{minHeight:'100vh', background:'#fdf8f0', display:'flex', flexDirection:'column', alignItems:'center', padding:'60px 20px', fontFamily:'Georgia, serif'}}>
      <h1 style={{fontSize:'42px', fontWeight:800, color:'#1a1a1a', marginBottom:'10px'}}>Flowrite ✨</h1>
      <p style={{color:'#666', marginBottom:'30px'}}>Turn bullets into essay - Powered by Gemini</p>
      
      <textarea
        value={bullets}
        onChange={e=>setBullets(e.target.value)}
        placeholder="Ex: won debate, started club, GPA 3.9..."
        style={{width:'100%', maxWidth:'700px', minHeight:'120px', padding:'16px', borderRadius:'12px', border:'1px solid #ddd', background:'white', color:'#333', fontSize:'16px'}}
      />

      <button onClick={generate} disabled={loading} style={{marginTop:'20px', background:'#2563eb', color:'white', border:'none', padding:'12px 28px', borderRadius:'999px', cursor:'pointer', fontSize:'16px', fontWeight:600}}>
        {loading ? 'Writing...' : 'Generate Essay'}
      </button>

      {essay && (
        <div style={{marginTop:'30px', width:'100%', maxWidth:'700px', background:'white', padding:'24px', borderRadius:'12px', border:'1px solid #ddd', whiteSpace:'pre-wrap', color:'#333', lineHeight:'1.6'}}>
          {essay}
        </div>
      )}
    </div>
  )
}
