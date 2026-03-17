import {
  getCurrentSensors,
  getMaps,
  getRunHistory,
} from "./services/api";
import RunEngineForm from "./components/RunEngineForm";
import SensorForm from "./components/SensorForm";
export default async function Home() {
  let sensors = null;
  let maps = [];
  let runs = [];

  try {
    sensors = await getCurrentSensors();
  } catch {}

  try {
    maps = await getMaps();
  } catch {}

  try {
    runs = await getRunHistory();
  } catch {}

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">OpenECU Dashboard</h1>
      
      <SensorForm />
      <RunEngineForm maps={maps} />

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Sensores atuais</h2>

        {sensors ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-900 rounded-xl p-4">
              <p className="text-sm text-slate-400">RPM</p>
              <p className="text-2xl font-semibold">{sensors.rpm}</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4">
              <p className="text-sm text-slate-400">Throttle</p>
              <p className="text-2xl font-semibold">{sensors.throttle}</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4">
              <p className="text-sm text-slate-400">Temperatura</p>
              <p className="text-2xl font-semibold">{sensors.temperature}</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4">
              <p className="text-sm text-slate-400">MAP</p>
              <p className="text-2xl font-semibold">{sensors.map}</p>
            </div>

            <div className="bg-slate-900 rounded-xl p-4">
              <p className="text-sm text-slate-400">Lambda</p>
              <p className="text-2xl font-semibold">{sensors.lambda}</p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl p-4 text-slate-400">
            Nenhuma leitura de sensor encontrada.
          </div>
        )}
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Mapas cadastrados</h2>

        {maps.length > 0 ? (
          <div className="space-y-3">
            {maps.map((map: any) => (
              <div key={map.id} className="bg-slate-900 rounded-xl p-4">
                <p className="font-semibold">
                  #{map.id} - {map.name}
                </p>
                <p className="text-slate-400 text-sm">Tipo: {map.type}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl p-4 text-slate-400">
            Nenhum mapa cadastrado.
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Histórico de execuções</h2>

        {runs.length > 0 ? (
          <div className="space-y-3">
            {runs.map((run: any) => (
              <div key={run.id} className="bg-slate-900 rounded-xl p-4">
                <p className="font-semibold">Run #{run.id}</p>
                <p className="text-sm text-slate-400">Mapa: {run.mapId}</p>
                <p className="text-sm text-slate-400">RPM: {run.sensors.rpm}</p>
                <p className="text-sm text-slate-400">
                  Injeção final: {run.result.calculation.finalInjectionTime}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl p-4 text-slate-400">
            Nenhuma execução encontrada.
          </div>
        )}
      </section>
    </main>
  );
}