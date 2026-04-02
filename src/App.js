import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [analysisResults, setAnalysisResults] = useState([]);
  
  // Two separate code states
  const [code1, setCode1] = useState("def fast_task():\n    return sum(range(100))");
  const [code2, setCode2] = useState("def heavy_task(n):\n    res = []\n    for i in range(n):\n        for j in range(n):\n            res.append(i*j)");

  // 🔴 UPDATE THESE URLS
  const ANALYZER_URL = "https://green-cloud-data.onrender.com";
  const SIMULATION_URL = "https://green-cloud-backend.onrender.com";

  const runDualSimulation = async () => {
    setLoading(true);
    try {
      // 1. Analyze both snippets
      const res1 = await axios.post(`${ANALYZER_URL}/analyze`, { code: code1 });
      const res2 = await axios.post(`${ANALYZER_URL}/analyze`, { code: code2 });
      
      const workloads = [res1.data, res2.data];
      setAnalysisResults(workloads);

      // 2. Run simulation with both workloads
      const simRes = await axios.post(`${SIMULATION_URL}/run-simulation`, {
        workloads: workloads.map(w => ({
          energy: w.energy_joules,
          rating: w.rating
        }))
      });

      setData(simRes.data);
    } catch (err) {
      console.error(err);
      alert("Error in pipeline. Check URLs and console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🌱 Green Cloud Dual-Workload Scheduler</h1>
      
      <div className="dual-editor-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Workload A</h3>
          <textarea className="code-editor" value={code1} onChange={(e) => setCode1(e.target.value)} rows="8" style={{ width: '100%' }} />
        </div>
        <div>
          <h3>Workload B</h3>
          <textarea className="code-editor" value={code2} onChange={(e) => setCode2(e.target.value)} rows="8" style={{ width: '100%' }} />
        </div>
      </div>

      <button onClick={runDualSimulation} className="btn" disabled={loading}>
        {loading ? "⏳ Analyzing & Scheduling..." : "▶ Run Dual Simulation"}
      </button>

      {analysisResults.length > 0 && (
        <div className="analysis-summary" style={{ marginTop: '20px', display: 'flex', gap: '20px' }}>
          {analysisResults.map((res, i) => (
            <div key={i} className="card">
              Task {i + 1} Rating: <strong>{res.rating}</strong>
            </div>
          ))}
        </div>
      )}

      {data && (
        <div className="results">
          <h2>Simulation Logs</h2>
          <div className="logs">
            {data.logs.map((log, i) => <p key={i}>➤ {log}</p>)}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;