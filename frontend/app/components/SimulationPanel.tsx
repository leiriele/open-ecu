"use client";

import { useMemo, useState } from "react";
import { runEngine } from "../services/api";
import RunChart from "./RunChart";

type MapItem = {
  id: number;
  name: string;
  type: string;
};

type RunItem = {
  id: number;
  mapId: number;
  createdAt: string;
  sensors: {
    rpm: number;
    throttle: number;
    temperature: number;
    map: number;
    lambda: number;
  };
  result: {
    calculation: {
      finalInjectionTime: number;
    };
  };
};

type Props = {
  maps: MapItem[];
  runs: RunItem[];
};

export default function SimulationPanel({ maps, runs }: Props) {
  const [selectedMapId, setSelectedMapId] = useState<number>(
    maps.length > 0 ? maps[0].id : 0
  );
  const [selectedFilterMapId, setSelectedFilterMapId] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [historyExpanded, setHistoryExpanded] = useState(false);

  const availableMaps = useMemo(() => {
    return [...maps].sort((a, b) => a.id - b.id);
  }, [maps]);

  const filteredRuns = useMemo(() => {
    if (selectedFilterMapId === "all") return runs;
    return runs.filter((run) => run.mapId === Number(selectedFilterMapId));
  }, [runs, selectedFilterMapId]);

  const orderedRuns = useMemo(() => {
    return [...filteredRuns].reverse();
  }, [filteredRuns]);

  const previewRuns = useMemo(() => {
    return orderedRuns.slice(0, 3);
  }, [orderedRuns]);

  async function handleRun() {
    if (!selectedMapId) {
      setMessage("Selecione um mapa para simulação.");
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
    <section className="mb-10">
      <div className="bg-slate-900 rounded-xl p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Simulação e análise</h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-4 items-end">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Mapa da simulação
            </label>
            <select
              value={selectedMapId}
              onChange={(e) => setSelectedMapId(Number(e.target.value))}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white"
            >
              {availableMaps.map((map) => (
                <option key={map.id} value={map.id}>
                  #{map.id} - {map.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Visualizar histórico por mapa
            </label>
            <select
              value={selectedFilterMapId}
              onChange={(e) => setSelectedFilterMapId(e.target.value)}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white"
            >
              <option value="all">Todos os mapas</option>
              {availableMaps.map((map) => (
                <option key={map.id} value={map.id}>
                  #{map.id} - {map.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRun}
            disabled={loading || availableMaps.length === 0}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Executando..." : "Executar simulação"}
          </button>
        </div>

        {message && <p className="mt-4 text-sm text-slate-300">{message}</p>}
      </div>

      <RunChart runs={filteredRuns} />

      <div className="bg-slate-900 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Histórico de execuções</h2>

          <button
            onClick={() => setHistoryExpanded((prev) => !prev)}
            className="rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 text-sm text-white"
          >
            {historyExpanded ? "Recolher histórico" : "Expandir histórico"}
          </button>
        </div>

        {orderedRuns.length > 0 ? (
          historyExpanded ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {orderedRuns.map((run) => (
                <div key={run.id} className="bg-slate-800 rounded-xl p-4">
                  <p className="font-semibold">Run #{run.id}</p>
                  <p className="text-sm text-slate-400">Mapa: {run.mapId}</p>
                  <p className="text-sm text-slate-400">RPM: {run.sensors.rpm}</p>
                  <p className="text-sm text-slate-400">
                    Temperatura: {run.sensors.temperature}
                  </p>
                  <p className="text-sm text-slate-400">
                    Injeção final: {run.result.calculation.finalInjectionTime}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {previewRuns.map((run) => (
                <div key={run.id} className="bg-slate-800 rounded-xl p-4">
                  <p className="font-semibold">Run #{run.id}</p>
                  <p className="text-sm text-slate-400">Mapa: {run.mapId}</p>
                  <p className="text-sm text-slate-400">RPM: {run.sensors.rpm}</p>
                  <p className="text-sm text-slate-400">
                    Temperatura: {run.sensors.temperature}
                  </p>
                  <p className="text-sm text-slate-400">
                    Injeção final: {run.result.calculation.finalInjectionTime}
                  </p>
                </div>
              ))}

              <p className="text-sm text-slate-400">
                Exibindo apenas os 3 runs mais recentes.
              </p>
            </div>
          )
        ) : (
          <div className="text-slate-400 text-sm">
            Nenhuma execução encontrada para o filtro selecionado.
          </div>
        )}
      </div>
    </section>
  );
}