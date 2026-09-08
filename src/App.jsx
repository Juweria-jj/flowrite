import { useState } from 'react'

export default function App(){
  const [input,setInput]=useState('')
  const [output,setOutput]=useState('')
  const [loading,setLoading]=useState(false)
  return(
    <div style={{minHeight:'100vh',background:'#fdf8f0',padding:'60px 20px',fontFamily:'sans-serif'}}>
      <h1 style={{textAlign:'center',fontSize:'48px',color:'#2c2420',fontFamily:'serif'}}>flowrite</h1>
      <p style={{textAlign:'center',color:'#9a8a7d',marginBottom:'30px'}}>Turn bullets into beautiful essays</p>
      <div style={{maxWidth:'700px',margin:'0 auto',background:'white',padding:'24px',borderRadius:'20px',border:'1px solid #efe6d5'}}>
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="Enter bullets: won debate, taught kids..." style={{width:'100%',minHeight:'120px',padding:'12px',borderRadius:'12px',border:'1px solid #efe6d5'}}/>
        <button onClick={async()=>{
          if(!input.trim())return;setLoading(true);
          const r=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:input})});
          const d=await r.json();setOutput(d.text||'No output');setLoading(false)
        }} style={{marginTop:'12px',padding:'10px 20px',borderRadius:'999px',background:'#2c2420',color:'white',border:'none'}}>{loading?'Writing...':'Generate'}</button>
        {output && <div style={{marginTop:'20px',padding:'16px',background:'#fffefc',border:'1px solid #efe6d5',borderRadius:'12px',whiteSpace:'pre-wrap'}}>{output}</div>}
      </div>
    </div>
  )
}
