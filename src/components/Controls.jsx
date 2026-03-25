import React from "react";

const Controls = ({ onRun, loading }) => {
  return (
    <button
      onClick={onRun}
      disabled={loading}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition"
    >
      {loading ? "Running..." : "▶ Run Simulation"}
    </button>
  );
};

export default Controls;