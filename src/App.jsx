import { useState } from 'react'

export default function App(){
  const [input, setInput] = useState("")
  const [tone, setTone] = useState("formal")
  const [limit, setLimit] = useState(300)
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)

  const tones = [
    {id:"formal", label:"Formal"},
    {id:"informal", label:"Informal"},
    {id:"authentic", label:"Authentic"},
  ]
  const limits = [200,300,400,500]

  const generate = () => {
    if(!input.trim()) return
    setLoading(true)
    setTimeout(()=>{
      setOutput(`[${tone.toUpperCase()} • ${limit} WORDS]\n\n${input}\n\n— Rewritten as ${tone}. Connect your AI API later, for now this is the working UI.`)
      setLoading(false)
    },600)
  }

  return(
    <div style={{minHeight:"100vh", background:"#0E0E0E", color:"#EDE9E3", fontFamily:"Inter, sans-serif"}}>
      <div style={{maxWidth:800, margin:"0 auto", padding:"40px 20px"}}>
        <h1 style={{fontSize:32, margin:0, fontWeight:800}}>Flowrite</h1>
        <p style={{color:"#8A8683", marginTop:8}}>Your personal writing tool</p>

        <div style={{marginTop:32}}>
          <div style={{fontSize:11, letterSpacing:1, color:"#8A8683", marginBottom:10}}>TONE</div>
          <div style={{display:"flex", gap:10}}>
            {tones.map(t=>(
              <button key={t.id} onClick={()=>setTone(t.id)} style={{flex:1, padding:"14px", borderRadius:12, border: tone===t.id ? "2px solid #EDE9E3" : "1px solid #2A2A2A", background: tone===t.id ? "#EDE9E3" : "#1A1A1A", color: tone===t.id ? "#0E0E0E" : "#EDE9E3", fontWeight:600, cursor:"pointer"}}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{marginTop:24}}>
          <div style={{fontSize:11, letterSpacing:1, color:"#8A8683", marginBottom:10}}>WORD LIMIT</div>
          <div style={{display:"flex", gap:10}}>
            {limits.map(l=>(
              <button key={l} onClick={()=>setLimit(l)} style={{flex:1, padding:"12px", borderRadius:12, border: limit===l ? "2px solid #EDE9E3" : "1px solid #2A2A2A", background: limit===l ? "#EDE9E3" : "#1A1A1A", color: limit===l ? "#0E0E0E" : "#EDE9E3", fontWeight:600, cursor:"pointer"}}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{marginTop:28, background:"#1A1A1A", border:"1px solid #2A2A2A", borderRadius:16, padding:16}}>
          <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste text here..." style={{width:"100%", minHeight:140, background:"transparent", border:"none", outline:"none", color:"#EDE9E3", fontSize:16, resize:"none"}}/>
          <button onClick={generate} style={{marginTop:12, width:"100%", padding:14, borderRadius:12, background:"#EDE9E3", color:"#0E0E0E", border:"none", fontWeight:700, cursor:"pointer"}}>{loading?"Generating...":"Generate →"}</button>
        </div>

        {output && (
          <div style={{marginTop:20, background:"#EDE9E3", color:"#0E0E0E", borderRadius:16, padding:20, whiteSpace:"pre-wrap", lineHeight:1.6}}>{output}</div>
        )}
      </div>
    </div>
  )
}
