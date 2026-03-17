"use client";

import { useState } from "react";
import { runEngine } from "../services/api";

type MapItem = {
  id: number;
  name: string;
  type: string;
};

type Props = {
  maps: MapItem[];
};

export default function RunEngineForm({ maps }: Props) {
  const [selectedMapId, setSelectedMapId] = useState<number>(
    maps.length > 0 ? maps[0].id : 0
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRun() {
    if (!selectedMapId) {
      setMessage("Selecione um mapa.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const result = await runEngine(selectedMapId);

      setMessage(
        `Simulação executada com sucesso. Injeção final: ${result.result.calculation.finalInjectionTime}`
      );

      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || "Erro ao executar simulação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-slate-900 rounded-xl p-4 mb-8">
      <h2 className="text-xl font-semibold mb-4">Executar ECU</h2>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
        <div className="w-full md:w-80">
          <label className="block text-sm text-slate-400 mb-2">
            Selecionar mapa
          </label>
          <select
            value={selectedMapId}
            onChange={(e) => setSelectedMapId(Number(e.target.value))}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          >
            {maps.map((map) => (
              <option key={map.id} value={map.id}>
                #{map.id} - {map.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleRun}
          disabled={loading || maps.length === 0}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Executando..." : "Executar simulação"}
        </button>
      </div>

      {message && <p className="mt-4 text-sm text-slate-300">{message}</p>}
    </div>
  );
}