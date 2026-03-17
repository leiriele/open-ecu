"use client";

import { useState } from "react";
import { createMap } from "../services/api";

type PresetKey = "performance" | "economy" | "original" | "custom";

export default function MapForm() {
  const presetMaps = {
    performance: {
      name: "Mapa Alto Desempenho",
      type: "alto_desempenho",
      rpmBins: [1000, 2000, 3000, 4000],
      loadBins: [20, 40, 60, 80],
      fuelGrid: [
        [3.0, 3.2, 3.4, 3.6],
        [3.8, 4.1, 4.4, 4.7],
        [4.5, 5.0, 5.4, 5.8],
        [5.2, 5.8, 6.3, 6.9],
      ],
    },
    economy: {
      name: "Mapa Econômico",
      type: "economico",
      rpmBins: [1000, 2000, 3000, 4000],
      loadBins: [20, 40, 60, 80],
      fuelGrid: [
        [2.8, 3.0, 3.1, 3.3],
        [3.4, 3.7, 3.9, 4.1],
        [4.0, 4.3, 4.6, 4.9],
        [4.6, 5.0, 5.4, 5.8],
      ],
    },
    original: {
      name: "Mapa padrão",
      type: "padrao",
      rpmBins: [1000, 2000, 3000, 4000],
      loadBins: [20, 40, 60, 80],
      fuelGrid: [
        [2.9, 3.1, 3.3, 3.5],
        [3.6, 3.9, 4.2, 4.5],
        [4.3, 4.7, 5.1, 5.5],
        [5.0, 5.5, 6.0, 6.5],
      ],
    },
  };

  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("performance");

  const [name, setName] = useState(presetMaps.performance.name);
  const [type, setType] = useState(presetMaps.performance.type);
  const [rpmBinsText, setRpmBinsText] = useState(
    presetMaps.performance.rpmBins.join(",")
  );
  const [loadBinsText, setLoadBinsText] = useState(
    presetMaps.performance.loadBins.join(",")
  );
  const [fuelGridText, setFuelGridText] = useState(
    JSON.stringify(presetMaps.performance.fuelGrid)
  );

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isCustom = selectedPreset === "custom";

  function applyPreset(presetKey: PresetKey) {
    if (presetKey === "custom") {
      setName("Mapa Customizado");
      setType("performance");
      setRpmBinsText("1000,2000,3000,4000");
      setLoadBinsText("20,40,60,80");
      setFuelGridText(
        "[[3.0,3.2,3.4,3.6],[3.8,4.1,4.4,4.7],[4.5,5.0,5.4,5.8],[5.2,5.8,6.3,6.9]]"
      );
      return;
    }

    const preset = presetMaps[presetKey];
    setName(preset.name);
    setType(preset.type);
    setRpmBinsText(preset.rpmBins.join(","));
    setLoadBinsText(preset.loadBins.join(","));
    setFuelGridText(JSON.stringify(preset.fuelGrid));
  }

  function parseNumberList(text: string): number[] {
    return text
      .split(",")
      .map((item) => Number(item.trim()))
      .filter((item) => !Number.isNaN(item));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const rpmBins = parseNumberList(rpmBinsText);
      const loadBins = parseNumberList(loadBinsText);
      const fuelGrid = JSON.parse(fuelGridText);

      if (!name.trim()) {
        setMessage("Informe o nome do mapa.");
        return;
      }

      if (!type.trim()) {
        setMessage("Informe o tipo do mapa.");
        return;
      }

      if (rpmBins.length === 0) {
        setMessage("Informe valores válidos para rpmBins.");
        return;
      }

      if (loadBins.length === 0) {
        setMessage("Informe valores válidos para loadBins.");
        return;
      }

      if (!Array.isArray(fuelGrid) || fuelGrid.length === 0) {
        setMessage("fuelGrid deve ser uma matriz JSON válida.");
        return;
      }

      if (fuelGrid.length !== rpmBins.length) {
        setMessage("fuelGrid deve ter o mesmo número de linhas que rpmBins.");
        return;
      }

      const invalidRow = fuelGrid.some(
        (row: unknown) => !Array.isArray(row) || row.length !== loadBins.length
      );

      if (invalidRow) {
        setMessage(
          "Cada linha do fuelGrid deve ter o mesmo número de colunas que loadBins."
        );
        return;
      }

      await createMap({
        name: name.trim(),
        type: type.trim(),
        rpmBins,
        loadBins,
        fuelGrid,
      });

      setMessage("Mapa criado com sucesso.");
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || "Erro ao criar mapa.");
    } finally {
      setLoading(false);
    }
  }

  function inputClass(disabled = false) {
    return `w-full rounded-lg border px-3 py-2 text-white ${
      disabled
        ? "bg-slate-700 border-slate-600 opacity-80 cursor-not-allowed"
        : "bg-slate-800 border-slate-700"
    }`;
  }

  return (
    <div className="bg-slate-900 rounded-xl p-4 mb-8">
      <h2 className="text-xl font-semibold mb-4">Criar novo mapa</h2>

      <div className="mb-4">
        <label className="block text-sm text-slate-400 mb-2">
          Modelo do mapa
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => {
            const value = e.target.value as PresetKey;
            setSelectedPreset(value);
            applyPreset(value);
            setMessage("");
          }}
          className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white"
        >
          <option value="performance">Alto desempenho</option>
          <option value="economy">Econômico</option>
          <option value="original">Padrão</option>
          <option value="custom">Customizado</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={`grid grid-cols-1 ${isCustom ? "md:grid-cols-2" : ""} gap-4`}>
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Nome do mapa
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isCustom}
              className={inputClass(!isCustom)}
            />
          </div>

        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">RPM Bins</label>
          <input
            type="text"
            value={rpmBinsText}
            onChange={(e) => setRpmBinsText(e.target.value)}
            disabled={!isCustom}
            className={inputClass(!isCustom)}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">Load Bins</label>
          <input
            type="text"
            value={loadBinsText}
            onChange={(e) => setLoadBinsText(e.target.value)}
            disabled={!isCustom}
            className={inputClass(!isCustom)}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-2">
            Fuel Grid (JSON)
          </label>
          <textarea
            value={fuelGridText}
            onChange={(e) => setFuelGridText(e.target.value)}
            rows={6}
            disabled={!isCustom}
            className={inputClass(!isCustom)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-violet-600 px-4 py-2 font-medium text-white disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar mapa"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-sm ${
            message.includes("sucesso") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}