import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [code1, setCode1] = useState("def efficient(): return 1");
  const [code2, setCode2] = useState("def heavy(): return [i for i in range(10000)]");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const ANALYZER_URL = "https://green-cloud-data.onrender.com";
  const SIMULATION_URL = "https://green-cloud-backend.onrender.com";

  const runSimulation = async () => {
    setLoading(true);
    try {
      // Step 1: Analyze both
      const r1 = await axios.post(`${ANALYZER_URL}/analyze`, { code: code1 });
      const r2 = await axios.post(`${ANALYZER_URL}/analyze`, { code: code2 });
      
      const workloads = [r1.data, r2.data];

      // Step 2: Simulate
      const sim = await axios.post(`${SIMULATION_URL}/run-simulation`, {
        workloads: workloads.map(w => ({
          energy_joules: w.energy_joules,
          rating: w.rating
        }))
      });

      setResults({ analysis: workloads, simulation: sim.data });
    } catch (err) {
      alert("Check Console: Connection Error or 500 Crash");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🌱 Green Cloud Dual-Orchestrator</h1>
      <div className="dual-grid">
        <textarea value={code1} onChange={(e) => setCode1(e.target.value)} />
        <textarea value={code2} onChange={(e) => setCode2(e.target.value)} />
      </div>
      
      <button onClick={runSimulation} disabled={loading}>
        {loading ? "Processing..." : "▶ Start Simulation"}
      </button>

      {results && (
        <div className="display">
          {results.analysis.map((res, i) => (
            <div key={i} className="card">
              <h3>Task {i+1} ({res.rating})</h3>
              <p>⚡ {res.energy_joules.toFixed(6)} Joules</p>
              <p>💧 {res.water_ml.toFixed(6)} ml Water</p>
              <p>☁️ {res.carbon_mg.toFixed(4)} mg Carbon</p>
            </div>
          ))}
          <div className="logs">
            {results.simulation.logs.map((l, i) => <p key={i}>{l}</p>)}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;