import { useState } from 'react'

export default function App(){
  const [input, setInput] = useState("")
  const [tone, setTone] = useState("authentic")
  const [limit, setLimit] = useState(300)
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if(!input.trim()) return
    setLoading(true)
    try{
      const res = await fetch("/api/generate",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({text:input, tone, limit})})
      const data = await res.json()
      setOutput(data.result)
    }catch{ setOutput("Error. Check api/generate.js") }
    setLoading(false)
  }

  return(
    <div style={{minHeight:"100vh", background:"#0A0A12", color:"#EDE9E3", position:"relative", overflow:"hidden", fontFamily:"Inter,sans-serif"}}>
      {/* BACKGROUND DESIGN */}
      <div style={{position:"absolute", inset:0}}>
        <div style={{position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize:"40px 40px"}}/>
        <div style={{position:"absolute", top:"-10%", left:"-10%", width:700, height:700, background:"radial-gradient(circle, rgba(121,91,255,0.22), transparent 65%)", filter:"blur(40px)"}}/>
        <div style={{position:"absolute", top:"30%", right:"-15%", width:600, height:600, background:"radial-gradient(circle, rgba(255,180,110,0.18), transparent 65%)", filter:"blur(50px)"}}/>
      </div>

      <div style={{position:"relative", zIndex:1, maxWidth:760, margin:"0 auto", padding:"30px 20px"}}>
        <div style={{fontWeight:800, fontSize:20, marginBottom:24}}>flowrite<span style={{fontWeight:300, opacity:0.5}}>.studio</span></div>
        <h1 style={{fontSize:42, fontWeight:800, lineHeight:0.9, margin:0}}>Write it<br/><span style={{color:"#9A95A8", fontStyle:"italic", fontWeight:300}}>how you mean it.</span></h1>
        
        <div style={{marginTop:24, display:"flex", gap:8}}>
          {["formal","informal","authentic"].map(t=>(
            <button key={t} onClick={()=>setTone(t)} style={{flex:1, padding:12, borderRadius:14, border: tone===t ? "1.5px solid #EDE9E3" : "1px solid rgba(255,255,255,0.1)", background: tone===t ? "#EDE9E3" : "rgba(255,255,255,0.06)", color: tone===t ? "#0A0A12" : "#EDE9E3", fontWeight:700, cursor:"pointer", textTransform:"capitalize"}}>{t}</button>
          ))}
        </div>

        <div style={{marginTop:10, display:"inline-flex", gap:6, background:"rgba(255,255,255,0.06)", padding:5, borderRadius:12}}>
          {[200,300,400,500].map(l=>(
            <button key={l} onClick={()=>setLimit(l)} style={{padding:"6px 14px", borderRadius:8, border:"none", background: limit===l ? "#EDE9E3" : "transparent", color: limit===l ? "#0A0A12" : "#888", cursor:"pointer"}}>{l}</button>
          ))}
        </div>

        <div style={{marginTop:18, background:"rgba(20,20,28,0.9)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:20, padding:16}}>
          <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Essay on anything... pollution, AI, my aim in life" style={{width:"100%", minHeight:120, background:"transparent", border:"none", outline:"none", color:"#EDE9E3", fontSize:16, resize:"none"}}/>
          <button onClick={generate} style={{marginTop:12, width:"100%", padding:14, borderRadius:12, background:"#EDE9E3", color:"#0A0A12", border:"none", fontWeight:800, cursor:"pointer"}}>{loading ? "Generating..." : "Generate →"}</button>
        </div>

        {output && <div style={{marginTop:18, background:"#EDE9E3", color:"#111", borderRadius:16, padding:18, whiteSpace:"pre-wrap", lineHeight:1.6}}>{output}</div>}
      </div>
    </div>
  )
}
