import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Dashboard = ({ data }) => {
  const chartData = [
    { name: "Carbon", value: data.carbon_saved },
    { name: "SLA", value: data.sla_violations },
    { name: "Migrations", value: data.migrations },
    { name: "Delayed", value: data.delayed_tasks },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">📊 Results</h2>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="🌱 Carbon Saved" value={data.carbon_saved} />
        <Card title="⚡ SLA Violations" value={data.sla_violations} />
        <Card title="🔄 Migrations" value={data.migrations} />
        <Card title="⏳ Delayed Tasks" value={data.delayed_tasks} />
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-xl shadow">
        <BarChart width={500} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className="text-gray-500">{title}</p>
    <p className="text-2xl font-bold text-green-600">{value}</p>
  </div>
);

export default Dashboard;