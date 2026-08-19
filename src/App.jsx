import { useState } from "react";

export default function Flowrite() {
  const [bullets, setBullets] = useState("");
  const [mode, setMode] = useState("Essay");
  const [wordLimit, setWordLimit] = useState(500);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [improvements, setImprovements] = useState([]);

  const generate = async () => {
    if (!bullets.trim()) return alert("Drop some bullets first!");
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({bullets, mode, wordLimit})
      });
      const data = await res.json();
      setResult(data.text);
      setImprovements(data.improvements || []);
    } catch (e) {
      alert("Error. Check if API key is set in Vercel")
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <header>
        <h1>✨ Flowrite</h1>
        <p>Turn bullets into brilliance</p>
      </header>

      <div className="grid">
        <div className="card">
          <h2>Your Bullets</h2>
          <textarea
            placeholder={"Drop your rough points here:\n- Won coding competition\n- Built app for school\n- Love solving problems"}
            value={bullets}
            onChange={(e) => setBullets(e.target.value)}
          />

          <div className="controls">
            <div>
              <label>Mode</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option>Essay</option>
                <option>Speech</option>
                <option>Debate</option>
              </select>
            </div>
            <div>
              <label>Words</label>
              <input
                type="number"
                value={wordLimit}
                onChange={(e) => setWordLimit(e.target.value)}
                min="200" max="1000"
              />
            </div>
          </div>

          <button onClick={generate} disabled={loading}>
            {loading? "Writing..." : "✨ Generate"}
          </button>
        </div>

        <div className="card">
          <h2>Generated {mode}</h2>
          {result? (
            <>
              <div className="output">{result}</div>
              <button onClick={() => navigator.clipboard.writeText(result)}>
                Copy
              </button>
              {improvements.length > 0 && (
                <div className="improvements">
                  <h3>3 Improvements Made:</h3>
                  <ul>{improvements.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                </div>
              )}
            </>
          ) : (
            <p className="placeholder">Your polished text will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
}
