"use client";

import { useState } from "react";
import { createSensorReading } from "../services/api";

type Errors = {
  rpm?: string;
  throttle?: string;
  temperature?: string;
  map?: string;
  lambda?: string;
};

export default function SensorForm() {
  const [rpm, setRpm] = useState(3200);
  const [throttle, setThrottle] = useState(45);
  const [temperature, setTemperature] = useState(92);
  const [mapValue, setMapValue] = useState(1.2);
  const [lambda, setLambda] = useState(0.98);

  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const newErrors: Errors = {};

    if (!Number.isInteger(rpm) || rpm < 600 || rpm > 9000) {
      newErrors.rpm = "RPM deve estar entre 600 e 9000";
    }

    if (throttle < 0 || throttle > 100) {
      newErrors.throttle = "Throttle deve estar entre 0 e 100";
    }

    if (temperature < 60 || temperature > 120) {
      newErrors.temperature = "Temperatura entre 60 e 120°C";
    }

    if (mapValue < 0.2 || mapValue > 3.0) {
      newErrors.map = "MAP entre 0.2 e 3.0 bar";
    }

    if (lambda < 0.7 || lambda > 1.3) {
      newErrors.lambda = "Lambda entre 0.7 e 1.3";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    try {
      setLoading(true);

      await createSensorReading({
        rpm,
        throttle,
        temperature,
        map: Number(mapValue.toFixed(2)),
        lambda: Number(lambda.toFixed(2)),
      });

      setMessage("Sensores registrados com sucesso.");
      window.location.reload();
    } catch (error: any) {
      setMessage(error.message || "Erro ao registrar sensores.");
    } finally {
      setLoading(false);
    }
  }

    function inputClass(hasError: boolean) {
    return `w-full rounded-lg px-3 py-2 text-white bg-slate-800 border ${
        hasError ? "border-red-500" : "border-slate-700"
    }`;
    }

  return (
    <div className="bg-slate-900 rounded-xl p-4 mb-8">
      <h2 className="text-xl font-semibold mb-4">Registrar sensores</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        {/* RPM */}
        <div>
          <label className="text-sm text-slate-400">RPM</label>
          <input
            type="number"
            value={rpm}
            onChange={(e) => setRpm(Number(e.target.value))}
            className={inputClass(!!errors.rpm)}
          />
          {errors.rpm && (
            <p className="text-red-400 text-xs mt-1">{errors.rpm}</p>
          )}
        </div>

        {/* Throttle */}
        <div>
          <label className="text-sm text-slate-400">Throttle</label>
          <input
            type="number"
            value={throttle}
            onChange={(e) => setThrottle(Number(e.target.value))}
            className={inputClass(!!errors.throttle)}
          />
          {errors.throttle && (
            <p className="text-red-400 text-xs mt-1">{errors.throttle}</p>
          )}
        </div>

        {/* Temperatura */}
        <div>
          <label className="text-sm text-slate-400">Temperatura</label>
          <input
            type="number"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className={inputClass(!!errors.temperature)}
          />
          {errors.temperature && (
            <p className="text-red-400 text-xs mt-1">
              {errors.temperature}
            </p>
          )}
        </div>

        {/* MAP */}
        <div>
          <label className="text-sm text-slate-400">MAP</label>
          <input
            type="number"
            step="0.01"
            value={mapValue}
            onChange={(e) => setMapValue(Number(e.target.value))}
            className={inputClass(!!errors.map)}
          />
          {errors.map && (
            <p className="text-red-400 text-xs mt-1">{errors.map}</p>
          )}
        </div>

        {/* Lambda */}
        <div>
          <label className="text-sm text-slate-400">Lambda</label>
          <input
            type="number"
            step="0.01"
            value={lambda}
            onChange={(e) => setLambda(Number(e.target.value))}
            className={inputClass(!!errors.lambda)}
          />
          {errors.lambda && (
            <p className="text-red-400 text-xs mt-1">{errors.lambda}</p>
          )}
        </div>

        {/* Botão */}
        <div className="md:col-span-5">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Registrar sensores"}
          </button>
        </div>
      </form>

      {/* Mensagem geral */}
      {message && (
        <p
          className={`mt-4 text-sm ${
            message.includes("sucesso")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}