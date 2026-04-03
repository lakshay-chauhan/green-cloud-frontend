import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  // 1. Dual Code States
  const [codeA, setCodeA] = useState("def efficient_sort(arr):\n    return sorted(arr)");
  const [codeB, setCodeB] = useState("def heavy_loop(n):\n    res = []\n    for i in range(n):\n        for j in range(n):\n            res.append(i*j)");

  // 🔴 UPDATE THESE WITH YOUR RENDER URLs
  const ANALYZER_URL = "https://green-cloud-data.onrender.com";
  const SIMULATION_URL = "https://green-cloud-backend.onrender.com";

  const runDualPipeline = async () => {
    setLoading(true);
    setResults(null);
    try {
      // Step 1: Analyze BOTH codes sequentially
      const resA = await axios.post(`${ANALYZER_URL}/analyze`, { code: codeA });
      const resB = await axios.post(`${ANALYZER_URL}/analyze`, { code: codeB });
      
      const analysisData = [resA.data, resB.data];

      // Step 2: Send both results to the Simulation
      const simRes = await axios.post(`${SIMULATION_URL}/run-simulation`, {
        workloads: analysisData.map(w => ({
          energy_joules: w.energy_joules,
          rating: w.rating
        }))
      });

      setResults({ analysis: analysisData, simulation: simRes.data });
    } catch (err) {
      console.error(err);
      alert("Pipeline Error! Check if both Render services are 'Live'.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🌱 Green Cloud Orchestrator</h1>
        <p>Compare two workloads and observe Agent-led Carbon-aware migration.</p>
      </header>

      {/* 2. SPACE FOR TWO CODES (Side-by-Side Grid) */}
      <div className="dual-editor-container">
        <div className="editor-box">
          <h3>Task A (Expected A+)</h3>
          <textarea 
            value={codeA} 
            onChange={(e) => setCodeA(e.target.value)} 
            className="code-input"
          />
        </div>
        <div className="editor-box">
          <h3>Task B (Expected D)</h3>
          <textarea 
            value={codeB} 
            onChange={(e) => setCodeB(e.target.value)} 
            className="code-input"
          />
        </div>
      </div>

      <button onClick={runDualPipeline} className="run-btn" disabled={loading}>
        {loading ? "⏳ Analyzing & Simulating..." : "▶ Deploy to Green Cloud"}
      </button>

      {results && (
        <div className="results-section">
          <h2>📊 Derived Environmental Impact</h2>
          <div className="analysis-grid">
            {results.analysis.map((item, index) => (
              <div key={index} className={`impact-card ${item.rating.charAt(0)}`}>
                <h3>Task {index === 0 ? 'A' : 'B'}</h3>
                <div className="badge">{item.rating}</div>
                <p><strong>⚡ Energy:</strong> {item.energy_joules.toFixed(6)} J</p>
                <p><strong>💧 Water:</strong> {item.water_ml.toFixed(6)} ml</p>
                <p><strong>☁️ Carbon:</strong> {item.carbon_mg.toFixed(4)} mg</p>
              </div>
            ))}
          </div>

          <h2>🚀 Agent Migration Logs</h2>
          <div className="log-window">
            {results.simulation.logs.map((log, i) => (
              <div key={i} className="log-entry">➤ {log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;