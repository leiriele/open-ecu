const fs = require("fs");
const path = require("path");

const mapsFilePath = path.join(__dirname, "../data/maps.json");

function calculateInjection(data) {
  const { rpm, throttle, temperature, map, lambda } = data;

  const baseFuel = rpm * 0.001 + throttle * 0.02;
  const temperatureCorrection = temperature > 90 ? 0.97 : 1.05;
  const lambdaCorrection = lambda < 1 ? 1.02 : 0.98;
  const finalInjectionTime =
    baseFuel * temperatureCorrection * lambdaCorrection;

  return {
    baseFuel: Number(baseFuel.toFixed(2)),
    temperatureCorrection,
    lambdaCorrection,
    finalInjectionTime: Number(finalInjectionTime.toFixed(2)),
  };
}

function getMaps() {
  const data = fs.readFileSync(mapsFilePath, "utf-8");
  return JSON.parse(data);
}

function getMapById(id) {
  const maps = getMaps();
  return maps.find((map) => map.id === Number(id));
}

function saveMap(mapData) {
  const maps = getMaps();

  const newMap = {
    id: maps.length > 0 ? maps[maps.length - 1].id + 1 : 1,
    name: mapData.name,
    type: mapData.type,
    fuelTable: mapData.fuelTable,
    createdAt: new Date().toISOString(),
    updatedAt: null,
  };

  maps.push(newMap);

  fs.writeFileSync(mapsFilePath, JSON.stringify(maps, null, 2));

  return newMap;
}

function updateMap(id, mapData) {
  const maps = getMaps();
  const mapIndex = maps.findIndex((map) => map.id === Number(id));

  if (mapIndex === -1) {
    return null;
  }

  maps[mapIndex] = {
    ...maps[mapIndex],
    name: mapData.name ?? maps[mapIndex].name,
    type: mapData.type ?? maps[mapIndex].type,
    fuelTable: mapData.fuelTable ?? maps[mapIndex].fuelTable,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(mapsFilePath, JSON.stringify(maps, null, 2));

  return maps[mapIndex];
}

function deleteMap(id) {
  const maps = getMaps();
  const mapIndex = maps.findIndex((map) => map.id === Number(id));

  if (mapIndex === -1) {
    return null;
  }

  const removedMap = maps[mapIndex];
  maps.splice(mapIndex, 1);

  fs.writeFileSync(mapsFilePath, JSON.stringify(maps, null, 2));

  return removedMap;
}

module.exports = {
  calculateInjection,
  getMaps,
  getMapById,
  saveMap,
  updateMap,
  deleteMap,
};