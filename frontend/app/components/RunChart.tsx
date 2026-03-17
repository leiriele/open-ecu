"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RunChart({ runs }: { runs: any[] }) {
  const data = runs.map((run) => ({
    time: new Date(run.createdAt).toLocaleTimeString(),
    rpm: run.sensors.rpm,
    temp: run.sensors.temperature,
    injection: run.result.calculation.finalInjectionTime,
  }));

  return (
    <div className="bg-slate-900 p-4 rounded-xl mb-8">
      <h2 className="text-xl font-semibold mb-4">Gráfico de Execução</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />

          <Line type="monotone" dataKey="rpm" stroke="#38bdf8" />
          <Line type="monotone" dataKey="temp" stroke="#f97316" />
          <Line type="monotone" dataKey="injection" stroke="#22c55e" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}