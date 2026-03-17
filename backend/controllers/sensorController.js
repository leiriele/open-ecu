const {
  getSensorHistory,
  saveSensorReading,
  getLatestSensorReading,
} = require("../services/sensorService");

function createSensorReading(req, res) {
  const { rpm, throttle, temperature, map, lambda } = req.body;

  if (
    rpm === undefined ||
    throttle === undefined ||
    temperature === undefined ||
    map === undefined ||
    lambda === undefined
  ) {
    return res.status(400).json({
      error: "Campos obrigatórios: rpm, throttle, temperature, map, lambda",
    });
  }

  const newReading = saveSensorReading({
    rpm,
    throttle,
    temperature,
    map,
    lambda,
  });

  return res.status(201).json(newReading);
}

function listSensorHistory(req, res) {
  const history = getSensorHistory();
  return res.json(history);
}

function getCurrentSensors(req, res) {
  const latestReading = getLatestSensorReading();

  if (!latestReading) {
    return res.status(404).json({
      error: "Nenhuma leitura de sensor encontrada",
    });
  }

  return res.json(latestReading);
}

module.exports = {
  createSensorReading,
  listSensorHistory,
  getCurrentSensors,
};