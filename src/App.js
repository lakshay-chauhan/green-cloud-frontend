import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [userCode, setUserCode] = useState("def example():\n    for i in range(1000):\n        pass");
  const [data, setData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // REPLACE with your actual Render URL
  const API_BASE = "https://green-cloud-backend.onrender.com";

  const runSimulation = async () => {
    setLoading(true);
    try {
      // Step 1: Analyze
      const analyzeRes = await axios.post(`${API_BASE}/analyze`, { code: userCode });
      const metrics = analyzeRes.data;
      setAnalysis(metrics);

      // Step 2: Simulate
      const simRes = await axios.post(`${API_BASE}/run-simulation`, {
        code_impact: {
          energy: metrics.environmental_impact.energy_joules,
          rating: metrics.sustainability_rating
        }
      });
      setData(simRes.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to run simulation. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🌱 Green Cloud Dashboard</h1>
      <textarea 
        className="code-editor" 
        value={userCode} 
        onChange={(e) => setUserCode(e.target.value)} 
      />
      <button onClick={runSimulation} className="btn" disabled={loading}>
        {loading ? "⏳ Processing..." : "▶ Run Analysis & Simulation"}
      </button>

      {analysis && (
        <div className="analysis-box">
          <h3>Rating: {analysis.sustainability_rating}</h3>
          <p>Energy: {analysis.environmental_impact.energy_joules.toFixed(6)} J</p>
        </div>
      )}

      {data && (
        <div className="results-grid">
          <div className="card">Migrations: {data.migrations}</div>
          <div className="card">Carbon Saved: {data.carbon_saved}</div>
          <div className="logs">
            {data.logs.map((log, i) => <p key={i}>➤ {log}</p>)}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;