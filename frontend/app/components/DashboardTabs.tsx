"use client";

import { useState } from "react";

type Tab = "simulation" | "maps" | "charts" | "history";

export default function DashboardTabs({
  simulation,
  maps,
  charts,
  history,
}: any) {
  const [activeTab, setActiveTab] = useState<Tab>("simulation");

  function tabClass(tab: Tab) {
    return `px-4 py-2 rounded-lg text-sm ${
      activeTab === tab
        ? "bg-blue-600 text-white"
        : "bg-slate-800 text-slate-300"
    }`;
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">OpenECU Dashboard</h1>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab("simulation")} className={tabClass("simulation")}>
          Simulação
        </button>
        <button onClick={() => setActiveTab("maps")} className={tabClass("maps")}>
          Mapas
        </button>
        <button onClick={() => setActiveTab("charts")} className={tabClass("charts")}>
          Gráficos
        </button>
        <button onClick={() => setActiveTab("history")} className={tabClass("history")}>
          Histórico
        </button>
      </div>

      {activeTab === "simulation" && simulation}
      {activeTab === "maps" && maps}
      {activeTab === "charts" && charts}
      {activeTab === "history" && history}
    </div>
  );
}