import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Code editors
  const [codeA, setCodeA] = useState(
    "def efficient_sort(arr):\n    return sorted(arr)"
  );

  const [codeB, setCodeB] = useState(
    "def heavy_loop(n):\n    res = []\n    for i in range(n):\n        for j in range(n):\n            res.append(i*j)"
  );

  // Backend URLs
  const ANALYZER_URL = "https://green-cloud-data.onrender.com";
  const SIMULATION_URL = "https://green-cloud-backend.onrender.com";

  const runDualPipeline = async () => {
    setLoading(true);
    setResults(null);

    try {
      // Step 1: Analyze both code blocks using Gemini backend
      const resA = await axios.post(`${ANALYZER_URL}/analyze`, {
        code: codeA,
      });

      const resB = await axios.post(`${ANALYZER_URL}/analyze`, {
        code: codeB,
      });

      const analysisData = [resA.data, resB.data];

      // Step 2: Send scores to simulation backend
      const simRes = await axios.post(
        `${SIMULATION_URL}/run-simulation`,
        {
          workloads: analysisData.map((w) => ({
            energy_joules: w.energy_joules,
            rating: w.rating,
          })),
        }
      );

      setResults({
        analysis: analysisData,
        simulation: simRes.data,
      });
    } catch (err) {
      console.error(err);
      alert("Pipeline Error! Check backend deployment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>🌱 Green Cloud Orchestrator</h1>
        <p>
          Gemini-powered workload ranking with carbon-aware VM migration
        </p>
      </header>

      {/* Code Input Section */}
      <div className="dual-editor-container">
        <div className="editor-box">
          <h3>Task A (Efficient)</h3>
          <textarea
            value={codeA}
            onChange={(e) => setCodeA(e.target.value)}
            className="code-input"
          />
        </div>

        <div className="editor-box">
          <h3>Task B (Heavy)</h3>
          <textarea
            value={codeB}
            onChange={(e) => setCodeB(e.target.value)}
            className="code-input"
          />
        </div>
      </div>

      {/* Run Button */}
      <button
        onClick={runDualPipeline}
        className="run-btn"
        disabled={loading}
      >
        {loading
          ? "⏳ Running Simulation..."
          : "▶ Run Green Cloud Simulation"}
      </button>

      {/* Results Section */}
      {results && (
        <div className="results-section">
          {/* Gemini Analysis */}
          <h2>📊 Gemini Workload Analysis</h2>
          <div className="analysis-grid">
            {results.analysis.map((item, index) => (
              <div key={index} className="impact-card">
                <h3>Task {index === 0 ? "A" : "B"}</h3>
                <p>
                  <strong>Rating:</strong> {item.rating}
                </p>
                <p>
                  <strong>⚡ Energy:</strong>{" "}
                  {item.energy_joules.toFixed(6)} J
                </p>
                <p>
                  <strong>💧 Water:</strong>{" "}
                  {item.water_ml.toFixed(6)} ml
                </p>
                <p>
                  <strong>☁️ Carbon:</strong>{" "}
                  {item.carbon_mg.toFixed(4)} mg
                </p>
              </div>
            ))}
          </div>

          {/* Migration Logs */}
          <h2>🚀 Migration Logs</h2>
          <div className="log-window">
            {results.simulation.logs.length > 0 ? (
              results.simulation.logs.map((log, i) => (
                <div key={i} className="log-entry">
                  ➤ {log}
                </div>
              ))
            ) : (
              <div>No migrations occurred</div>
            )}
          </div>

          {/* Metrics Dashboard */}
          <h2>📈 Migration Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>🔄 Total Migrations</h3>
              <p>{results.simulation.migrations}</p>
            </div>

            <div className="metric-card">
              <h3>🌿 Carbon Saved</h3>
              <p>{results.simulation.carbon_saved_percent}%</p>
            </div>

            <div className="metric-card">
              <h3>⚡ Energy Before</h3>
              <p>{results.simulation.energy_before} J</p>
            </div>

            <div className="metric-card">
              <h3>⚡ Energy After</h3>
              <p>{results.simulation.energy_after} J</p>
            </div>

            <div className="metric-card">
              <h3>📉 Carbon Before</h3>
              <p>{results.simulation.carbon_before} mg</p>
            </div>

            <div className="metric-card">
              <h3>📉 Carbon After</h3>
              <p>{results.simulation.carbon_after} mg</p>
            </div>

            <div className="metric-card">
              <h3>🛡 SLA Violations</h3>
              <p>{results.simulation.sla_violations}</p>
            </div>

            <div className="metric-card">
              <h3>🏢 Green DC</h3>
              <p>
                {results.simulation.dc_distribution.green} VMs
              </p>
            </div>

            <div className="metric-card">
              <h3>🏢 Medium DC</h3>
              <p>
                {results.simulation.dc_distribution.medium} VMs
              </p>
            </div>

            <div className="metric-card">
              <h3>🏢 Brown DC</h3>
              <p>
                {results.simulation.dc_distribution.brown} VMs
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;