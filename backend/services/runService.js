const fs = require("fs");
const path = require("path");

const runsFilePath = path.join(__dirname, "../data/runs.json");

function getRunHistory() {
  const data = fs.readFileSync(runsFilePath, "utf-8");
  return JSON.parse(data);
}

function saveRun(runData) {
  const history = getRunHistory();

  const newRun = {
    id: history.length > 0 ? history[history.length - 1].id + 1 : 1,
    mapId: runData.mapId,
    sensors: runData.sensors,
    result: runData.result,
    createdAt: new Date().toISOString(),
  };

  history.push(newRun);

  fs.writeFileSync(runsFilePath, JSON.stringify(history, null, 2));

  return newRun;
}

module.exports = {
  getRunHistory,
  saveRun,
};