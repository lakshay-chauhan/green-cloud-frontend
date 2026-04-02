import React, { useState } from "react";
import axios from "axios";
import "./App.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userCode, setUserCode] = useState(
    "def example_workload(n):\n    total = 0\n    for i in range(n):\n        total += i\n    return total"
  );
  const [analysis, setAnalysis] = useState(null);

  // Replace this with your actual Render URL
  const BACKEND_URL = "https://green-cloud-backend.onrender.com";

  const runSimulation = async () => {
    setLoading(true);
    setAnalysis(null);
    setData(null);
    
    try {
      // STEP 1: Analyze Code Complexity with Gemini 2.5 Flash
      const analyzerRes = await axios.post(`${BACKEND_URL}/analyze`, {
        code: userCode
      });
      
      const metrics = analyzerRes.data;
      setAnalysis(metrics);
      console.log("Gemini Analysis:", metrics);

      // STEP 2: Run the Simulation using the analyzed metrics
      const simRes = await axios.post(`${BACKEND_URL}/run-simulation`, {
        code_impact: {
          energy: metrics.environmental_impact?.energy_joules || 0.0005,
          rating: metrics.sustainability_rating || "B (Standard)"
        }
      });

      console.log("Simulation Result:", simRes.data);
      setData(simRes.data);
    } catch (error) {
      console.error("Pipeline Error:", error);
      alert("Error: Check console or ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = data
    ? [
        { name: "Carbon Saved", value: data.carbon_saved },
        { name: "SLA Violations", value: data.sla_violations },
        { name: "Migrations", value: data.migrations },
        { name: "Delayed Tasks", value: data.delayed_tasks },
      ]
    : [];

  return (
    <div className="container">
      <h1>🌱 Green Cloud Optimization Dashboard</h1>

      {/* STEP 1: CODE INPUT */}
      <div className="input-section">
        <h2>💻 Input Workload Code</h2>
        <p className="subtitle">Enter Python code to analyze its environmental footprint.</p>
        <textarea
          className="code-editor"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          rows="10"
        />
      </div>

      <button onClick={runSimulation} className="btn" disabled={loading}>
        {loading ? "⏳ Processing..." : "▶ Run Sustainability-Aware Simulation"}
      </button>

      {/* STEP 2: ANALYSIS RESULTS */}
      {analysis && (
        <div className="analysis-box">
          <h3>🔍 Gemini 2.5 Flash Analysis</h3>
          <div className="analysis-grid">
            <div className="analysis-card">
              <p>Energy Consumption</p>
              <strong>{analysis.environmental_impact.energy_joules.toFixed(8)} J</strong>
            </div>
            <div className="analysis-card">
              <p>Water Usage</p>
              <strong>{analysis.environmental_impact.water_usage_ml.toFixed(10)} ml</strong>
            </div>
            <div className="analysis-card">
              <p>Sustainability Grade</p>
              <strong className="rating-text">{analysis.sustainability_rating}</strong>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: SIMULATION RESULTS */}
      {data && (
        <>
          <h2>📊 Simulation Metrics</h2>
          <div className="cards">
            <div className="card">🌱 Carbon Saved <h3>{data.carbon_saved}</h3></div>
            <div className="card">⚠️ SLA Violations <h3>{data.sla_violations}</h3></div>
            <div className="card">🚀 Migrations <h3>{data.migrations}</h3></div>
            <div className="card">⏳ Delayed Tasks <h3>{data.delayed_tasks}</h3></div>
          </div>

          <h2>🧠 Intelligent Insights</h2>
          <div className="cards">
            <div className="card highlight">💳 Total Credits <h3>{data.total_credits}</h3></div>
            <div className="card highlight">📉 Carbon Trend <h3>{data.trend}</h3></div>
          </div>

          <h2>📊 Performance Graph</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>

          <h2>📜 Agent Decision Logs</h2>
          <div className="logs">
            {data.logs.map((log, index) => (
              <p key={index}>➤ {log}</p>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;