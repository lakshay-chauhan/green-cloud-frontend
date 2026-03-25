import React, { useState } from "react";
import Controls from "./components/Controls";
import Dashboard from "./components/Dashboard";
import Logs from "./components/Logs";
import { runSimulation } from "./api";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const result = await runSimulation();
      setData(result);
    } catch (err) {
      alert("Error running simulation");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        🌱 Green Cloud Optimization Dashboard
      </h1>

      <Controls onRun={handleRun} loading={loading} />

      {loading && (
        <div className="mt-4 text-blue-600 font-semibold">
          ⏳ Running Simulation...
        </div>
      )}

      {data && (
        <>
          <Dashboard data={data} />
          <Logs logs={data.logs} />
        </>
      )}
    </div>
  );
}

export default App;