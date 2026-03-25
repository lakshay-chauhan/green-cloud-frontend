import React from "react";

const Logs = ({ logs }) => {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">📜 Simulation Logs</h2>

      <div className="bg-black text-green-400 p-4 rounded-xl h-60 overflow-y-scroll font-mono text-sm">
        {logs.map((log, index) => (
          <p key={index}>➤ {log}</p>
        ))}
      </div>
    </div>
  );
};

export default Logs;