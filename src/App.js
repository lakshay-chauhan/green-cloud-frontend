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

  // 🔴 CONFIGURATION: Replace these with your actual Render URLs
  const ANALYZER_SERVICE_URL = "https://green-cloud-data.onrender.com";
  const SIMULATION_SERVICE_URL = "https://green-cloud-backend.onrender.com";

  const runFullPipeline = async () => {
    setLoading(true);
    setAnalysis(null);
    setData(null);

    try {
      // --- STEP 1: Call the Gemini Analyzer Service ---
      console.log("Calling Analyzer...");
      const analyzerRes = await axios.post(`${ANALYZER_SERVICE_URL}/analyze`, {
        code: userCode,
      });

      const metrics = analyzerRes.data;
      setAnalysis(metrics);
      console.log("Analysis Received:", metrics);

      // --- STEP 2: Call the Simulation Service with metrics from Step 1 ---
      console.log("Calling Simulation...");
      const simRes = await axios.post(`${SIMULATION_SERVICE_URL}/run-simulation`, {
        code_impact: {
          energy: metrics.energy_joules,
          rating: metrics.rating,
        },
      });

      console.log("Simulation Success:", simRes.data);
      setData(simRes.data);
    } catch (error) {
      console.error("Pipeline Error:", error);
      const errorSource = error.config?.url || "Unknown Source";
      alert(`Error at ${errorSource}. Check console and Render logs.`);
    } finally {
      setLoading(false);
    }
  };

  // Chart data mapping
  const chartData = data
    ? [
        { name: "Carbon Saved", value: data.carbon_saved },
        { name: "Migrations", value: data.migrations },
        { name: "Delayed Tasks", value: data.delayed_tasks },
      ]
    : [];

  return (
    <div className="container">
      <h1>🌱 Green Cloud Optimization Dashboard</h1>

      {/* INPUT SECTION */}
      <div className="input-section">
        <h2>💻 1. Enter Workload Code</h2>
        <textarea
          className="code-editor"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          rows="10"
          placeholder="Paste Python code here..."
        />
      </div>

      <button onClick={runFullPipeline} className="btn" disabled={loading}>
        {loading ? "⏳ Processing Pipeline..." : "▶ Run Analysis & Simulation"}
      </button>

      {/* ANALYSIS RESULTS */}
      {analysis && (
        <div className="analysis-box">
          <h3>🔍 Gemini Footprint Analysis</h3>
          <div className="analysis-grid">
            <div className="analysis-card">
              <p>Energy Estimate</p>
              <strong>{analysis.energy_joules.toFixed(8)} J</strong>
            </div>
            <div className="analysis-card">
              <p>Water Footprint</p>
              <strong>{analysis.water_ml?.toFixed(6) || "N/A"} ml</strong>
            </div>
            <div className="analysis-card">
              <p>Sustainability Grade</p>
              <strong className={`rating ${analysis.rating?.charAt(0)}`}>
                {analysis.rating}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATION RESULTS */}
      {data && (
        <div className="simulation-results">
          <h2>📊 Simulation Results</h2>
          <div className="cards">
            <div className="card">
              🌱 Carbon Saved
              <h3>{data.carbon_saved}</h3>
            </div>
            <div className="card">
              🚀 Migrations
              <h3>{data.migrations}</h3>
            </div>
            <div className="card">
              ⏳ Delayed Tasks
              <h3>{data.delayed_tasks}</h3>
            </div>
            <div className="card">
              💳 Total Credits
              <h3>{data.total_credits}</h3>
            </div>
          </div>

          <h2>📈 Performance Visualization</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <h2>📜 Agent Activity Logs</h2>
          <div className="logs">
            {data.logs.map((log, index) => (
              <p key={index}>➤ {log}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;