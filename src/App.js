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

  const runSimulation = async () => {
    setLoading(true);
    try {
      // STEP 1: Call your Green Code Analyzer API (Render URL)
      // Replace with your actual Analyzer URL
      const analyzerRes = await axios.post("https://your-analyzer-api.onrender.com/analyze", {
        code: userCode
      });
      
      const metrics = analyzerRes.data;
      setAnalysis(metrics);
      console.log("ANALYSIS SUCCESS:", metrics);

      // STEP 2: Call your Simulation Backend with the analyzed metrics
      const res = await axios.post(
        "https://green-cloud-backend.onrender.com/run-simulation",
        {
          code_impact: {
            energy: metrics.environmental_impact.energy_joules,
            rating: metrics.sustainability_rating
          }
        }
      );

      console.log("SIMULATION SUCCESS:", res.data);
      setData(res.data);
    } catch (error) {
      console.error("Error in simulation pipeline:", error);
      alert("Simulation failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Graph data mapping
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

      {/* NEW: Code Input Section */}
      <div className="input-section">
        <h2>💻 Step 1: Input Workload Code</h2>
        <p className="subtitle">Paste the Python code you want the Cloud Agent to optimize.</p>
        <textarea
          className="code-editor"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          placeholder="Enter your python code here..."
          rows="8"
        />
      </div>

      <button onClick={runSimulation} className="btn" disabled={loading}>
        {loading ? "⏳ Analyzing & Simulating..." : "▶ Run Sustainability-Aware Simulation"}
      </button>

      {/* NEW: Display Analysis Results */}
      {analysis && (
        <div className="analysis-box">
          <h3>🔍 Code Analysis Result</h3>
          <div className="analysis-grid">
            <div className="analysis-card">
              ⚡ Energy: <strong>{analysis.environmental_impact.energy_joules.toFixed(6)} J</strong>
            </div>
            <div className="analysis-card">
              💧 Water: <strong>{analysis.environmental_impact.water_usage_ml.toFixed(8)} ml</strong>
            </div>
            <div className="analysis-card">
              🏆 Rating: <span className={`grade ${analysis.sustainability_rating.split(' ')[0]}`}>
                {analysis.sustainability_rating}
              </span>
            </div>
          </div>
        </div>
      )}

      {data && (
        <>
          <h2>📊 Cloud Simulation Results</h2>
          <div className="cards">
            <div className="card">
              🌱 Carbon Saved
              <h3>{data.carbon_saved}</h3>
            </div>
            <div className="card">
              ⚠️ SLA Violations
              <h3>{data.sla_violations}</h3>
            </div>
            <div className="card">
              🚀 Migrations
              <h3>{data.migrations}</h3>
            </div>
            <div className="card">
              ⏳ Delayed Tasks
              <h3>{data.delayed_tasks}</h3>
            </div>
          </div>

          <h2>🧠 Intelligent Metrics</h2>
          <div className="cards">
            <div className="card highlight">
              💳 Total Carbon Credits
              <h3>{data.total_credits}</h3>
            </div>
            <div className="card highlight">
              💸 Avg Migration Cost
              <h3>{data.avg_migration_cost.toFixed(2)}</h3>
            </div>
          </div>

          <h2>📊 Performance Graph</h2>
          <ResponsiveContainer width="100%\" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>

          <h2>📜 Simulation Logs</h2>
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