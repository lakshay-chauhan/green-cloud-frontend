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

  const runSimulation = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/run-simulation" // ✅ LOCAL BACKEND
        // "https://green-cloud-backend.onrender.com/run-simulation" // use this for deployed
      );

      console.log("API RESPONSE:", res.data);

      setData(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Graph data
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

      <button onClick={runSimulation} className="btn">
        ▶ Run Simulation
      </button>

      {data && (
        <>
          {/* BASIC METRICS */}
          <h2>📊 Results</h2>

          <div className="cards">
            <div className="card">
              🌱 Carbon Saved
              <h3>{data.carbon_saved}</h3>
            </div>

            <div className="card">
              ⚡ SLA Violations
              <h3>{data.sla_violations}</h3>
            </div>

            <div className="card">
              🔄 Migrations
              <h3>{data.migrations}</h3>
            </div>

            <div className="card">
              ⏳ Delayed Tasks
              <h3>{data.delayed_tasks}</h3>
            </div>
          </div>

          {/* ADVANCED METRICS */}
          <h2>🧠 Intelligent Metrics</h2>

          <div className="cards">
            <div className="card highlight">
              💳 Total Carbon Credits
              <h3>{data.total_credits}</h3>
            </div>

            <div className="card highlight">
              💸 Avg Migration Cost
              <h3>{data.avg_migration_cost}</h3>
            </div>
          </div>


                    <h2>🧬 Carbon Intelligence</h2>

          <div className="cards">
            <div className="card highlight">
              🔋 Remaining Carbon Budget
              <h3>{data.remaining_budget}</h3>
            </div>

            <div className="card highlight">
              📈 Carbon Trend
              <h3>{data.trend}</h3>
            </div>
          </div>

          {/* BAR GRAPH */}
          <h2>📊 Performance Graph</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>

          {/* LOGS */}
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