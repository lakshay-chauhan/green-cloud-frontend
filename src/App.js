import React, { useState } from "react";
import axios from "axios";
import "./App.css";
// ... (keep your existing recharts imports)

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [code1, setCode1] = useState("def fast_task():\n    return sum(range(100))");
  const [code2, setCode2] = useState("def heavy_task(n):\n    res = []\n    for i in range(n):\n        for j in range(n):\n            res.append(i*j)");
  const [analysisResults, setAnalysisResults] = useState([]);

  const ANALYZER_URL = "https://green-cloud-data.onrender.com";
  const SIMULATION_URL = "https://green-cloud-backend.onrender.com";

  const runFullPipeline = async () => {
    setLoading(true);
    setAnalysisResults([]);
    try {
      // 1. Analyze BOTH codes
      const res1 = await axios.post(`${ANALYZER_URL}/analyze`, { code: code1 });
      const res2 = await axios.post(`${ANALYZER_URL}/analyze`, { code: code2 });
      
      const allMetrics = [res1.data, res2.data];
      setAnalysisResults(allMetrics);

      // 2. Run Simulation with both impacts
      const simRes = await axios.post(`${SIMULATION_URL}/run-simulation`, {
        workloads: allMetrics.map(m => ({
          energy: m.energy_joules,
          rating: m.rating
        }))
      });

      setData(simRes.data);
    } catch (error) {
      alert("Error in pipeline. Check URLs and CORS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🌱 Dual-Workload Green Cloud Scheduler</h1>

      <div className="dual-editor-grid">
        <div className="editor-container">
          <h3>Task A (Standard)</h3>
          <textarea className="code-editor" value={code1} onChange={(e) => setCode1(e.target.value)} />
        </div>
        <div className="editor-container">
          <h3>Task B (Intensive)</h3>
          <textarea className="code-editor" value={code2} onChange={(e) => setCode2(e.target.value)} />
        </div>
      </div>

      <button onClick={runFullPipeline} className="btn" disabled={loading}>
        {loading ? "⏳ Analyzing & Scheduling..." : "▶ Deploy Multi-VM Workload"}
      </button>

      {/* Show individual grades */}
      <div className="analysis-summary">
        {analysisResults.map((res, i) => (
          <div key={i} className={`grade-badge ${res.rating.charAt(0)}`}>
            Task {i+1}: {res.rating}
          </div>
        ))}
      </div>

      {/* ... (Keep your existing data display for charts and logs) */}
    </div>
  );
}