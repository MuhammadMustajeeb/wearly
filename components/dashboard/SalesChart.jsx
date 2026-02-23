"use client";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesChart({ data }) {
  return (
    <div className="bg-white border rounded-lg p-5 h-[320px]">
      <h3 className="font-medium mb-4">Sales (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <Tooltip />
          <Line type="monotone" dataKey="sales" stroke="#000" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
