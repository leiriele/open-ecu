"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

type RunItem = {
  id: number;
  mapId: number;
  createdAt: string;
  sensors: {
    rpm: number;
    temperature: number;
  };
  result: {
    calculation: {
      finalInjectionTime: number;
    };
  };
};

export default function RunChart({ runs }: { runs: RunItem[] }) {
  const data = runs.map((run) => ({
    time: new Date(run.createdAt).toLocaleTimeString(),
    rpm: run.sensors.rpm,
    temp: run.sensors.temperature,
    injection: run.result.calculation.finalInjectionTime,
  }));

  return (
    <div className="bg-slate-900 p-4 rounded-xl mb-6">
      <h2 className="text-xl font-semibold mb-4">Gráfico de execução</h2>

      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="rpm"
              name="RPM"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="temp"
              name="Temperatura"
              stroke="#f97316"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="injection"
              name="Injeção"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-slate-400 text-sm">
          Nenhuma execução encontrada.
        </div>
      )}
    </div>
  );
}