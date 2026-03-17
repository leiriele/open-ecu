const { getLatestSensorReading } = require("../services/sensorService");
const { calculateInjectionFromMap } = require("../services/ecuService");
const { saveRun, getRunHistory } = require("../services/runService");

function runEngine(req, res) {
  const { mapId } = req.body;

  if (mapId === undefined) {
    return res.status(400).json({
      error: "Campo obrigatório: mapId",
    });
  }

  const latestSensors = getLatestSensorReading();

  if (!latestSensors) {
    return res.status(404).json({
      error: "Nenhuma leitura de sensor encontrada",
    });
  }

  const result = calculateInjectionFromMap({
    mapId,
    rpm: latestSensors.rpm,
    throttle: latestSensors.throttle,
    temperature: latestSensors.temperature,
    map: latestSensors.map,
    lambda: latestSensors.lambda,
  });

  if (result.error) {
    return res.status(404).json({
      error: result.error,
    });
  }

  const savedRun = saveRun({
    mapId,
    sensors: latestSensors,
    result,
  });

  return res.status(201).json(savedRun);
}

function listRuns(req, res) {
  const history = getRunHistory();
  return res.json(history);
}

module.exports = {
  runEngine,
  listRuns,
};