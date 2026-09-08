import { useState, useEffect } from "react";

export default function Flowrite() {
  const [bullets, setBullets] = useState("");
  const [mode, setMode] = useState("Essay");
  const [wordLimit, setWordLimit] = useState(500);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [improvements, setImprovements] = useState([]);
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("flowrite_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const generate = async () => {
    if (!bullets.trim()) return alert("Drop some bullets first!");
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullets, mode, wordLimit }),
      });
      const data = await res.json();
      setResult(data.text);
      setImprovements(data.improvements || []);

      // Save to history BELOW
      const newItem = { id: Date.now(), bullets: bullets.slice(0,60), text: data.text, mode, wordLimit, date: new Date().toLocaleString() };
      const updated = [newItem, ...history].slice(0,10);
      setHistory(updated);
      localStorage.setItem("flowrite_history", JSON.stringify(updated));

    } catch (e) {
      alert("Error. Check if API key is set in Vercel");
    }
    setLoading(false);
  };

  return (
    <div className="app-wrapper">
      <div className="glow-bg"></div>
      
      <header className="top-header">
        <h1>✨ Flowrite</h1>
        <p>Turn bullets into essays • Powered by Gemini</p>
      </header>

      <main className="main-stack">
        {/* CARD 1 - INPUT */}
        <div className="card">
          <h2>Your Bullets</h2>
          <textarea
            placeholder={`Drop your rough points here:\n- Won coding competition\n- Built app for school\n- Love solving problems`}
            value={bullets}
            onChange={(e) => setBullets(e.target.value)}
          />
          <div className="controls">
            <div className="control-item">
              <label>Style</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option>Authentic</option>
                <option>Essay</option>
                <option>Speech</option>
                <option>Debate</option>
              </select>
            </div>
            <div className="control-item">
              <label>Words</label>
              <select value={wordLimit} onChange={(e) => setWordLimit(e.target.value)}>
                <option value={400}>400 words</option>
                <option value={500}>500 words</option>
                <option value={700}>700 words</option>
              </select>
            </div>
          </div>
          <button className="generate-btn" onClick={generate} disabled={loading}>
            {loading ? "Writing..." : "✨ Generate Essay"}
          </button>
        </div>

        {/* CARD 2 - OUTPUT */}
        <div className="card">
          <h2>Generated {mode}</h2>
          {result ? (
            <>
              <div className="output">{result}</div>
              <button className="copy-btn" onClick={() => navigator.clipboard.writeText(result)}>Copy</button>
              {improvements.length > 0 && (
                <div className="improvements">
                  <h3>Improvements Made:</h3>
                  <ul>{improvements.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                </div>
              )}
            </>
          ) : (
            <p className="placeholder">Your polished text will appear here</p>
          )}
        </div>

        {/* CARD 3 - HISTORY BELOW (Not Side) */}
        <div className="card history-card">
          <h2>🕒 History</h2>
          {history.length === 0 ? <p className="placeholder">No essays yet</p> : 
            history.map(item => (
              <div key={item.id} className="history-item" onClick={() => setResult(item.text)}>
                <strong>{item.mode} - {item.wordLimit} words</strong>
                <span>{item.bullets}...</span>
                <small>{item.date}</small>
              </div>
            ))
          }
        </div>
      </main>
    </div>
  );
}
