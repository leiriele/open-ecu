"use client";

import { useMemo, useState } from "react";
import RunChart from "./RunChart";

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

type MapItem = {
  id: number;
  name: string;
  type: string;
};

export default function RunHistory({ runs, maps }: { runs: RunItem[]; maps: MapItem[] }) {
  const [selectedMapId, setSelectedMapId] = useState<string>("all");

  const availableMapIds = useMemo(() => {
    return maps.map((map) => map.id).sort((a, b) => a - b);
  }, [maps]);

  const filteredRuns = useMemo(() => {
    if (selectedMapId === "all") {
      return runs;
    }

    return runs.filter((run) => run.mapId === Number(selectedMapId));
  }, [runs, selectedMapId]);

  return (
    <section className="mb-10">
      <div className="bg-slate-900 rounded-xl p-4 mb-6">
        <div className="w-full md:w-56">
          <label className="block text-sm text-slate-400 mb-2">
            Filtrar execuções por mapa
          </label>
          <select
            value={selectedMapId}
            onChange={(e) => setSelectedMapId(e.target.value)}
            className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white"
          >
            <option value="all">Todos os mapas</option>
            {availableMapIds.map((mapId) => {
              const map = maps.find((m) => m.id === mapId);
              return (
                <option key={mapId} value={mapId}>
                  {map ? `${map.name} (Mapa #${mapId})` : `Mapa #${mapId}`}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <RunChart runs={filteredRuns} />

      <div>
        <h2 className="text-xl font-semibold mb-4">Histórico de execuções</h2>

        {filteredRuns.length > 0 ? (
          <div className="space-y-3">
            {filteredRuns.map((run) => (
              <div key={run.id} className="bg-slate-900 rounded-xl p-4">
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
          <div className="bg-slate-900 rounded-xl p-4 text-slate-400">
            Nenhuma execução encontrada para o filtro selecionado.
          </div>
        )}
      </div>
    </section>
  );
}