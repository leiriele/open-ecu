const fs = require("fs");
const path = require("path");

const sensorsFilePath = path.join(__dirname, "../data/sensors.json");

function getSensorHistory() {
  const data = fs.readFileSync(sensorsFilePath, "utf-8");
  return JSON.parse(data);
}

function saveSensorReading(sensorData) {
  const history = getSensorHistory();

  const newReading = {
    id: history.length > 0 ? history[history.length - 1].id + 1 : 1,
    rpm: sensorData.rpm,
    throttle: sensorData.throttle,
    temperature: sensorData.temperature,
    map: sensorData.map,
    lambda: sensorData.lambda,
    createdAt: new Date().toISOString(),
  };

  history.push(newReading);

  fs.writeFileSync(sensorsFilePath, JSON.stringify(history, null, 2));

  return newReading;
}

function getLatestSensorReading() {
  const history = getSensorHistory();

  if (history.length === 0) {
    return null;
  }

  return history[history.length - 1];
}

module.exports = {
  getSensorHistory,
  saveSensorReading,
  getLatestSensorReading,
};