const fs = require("fs");
const path = require("path");

const mapsFilePath = path.join(__dirname, "../data/maps.json");

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

function findClosestFuelCell(fuelTable, rpm, load) {
  let closestCell = null;
  let smallestDistance = Infinity;

  for (const cell of fuelTable) {
    const rpmDistance = Math.abs(cell.rpm - rpm);
    const loadDistance = Math.abs(cell.load - load);
    const totalDistance = rpmDistance + loadDistance;

    if (totalDistance < smallestDistance) {
      smallestDistance = totalDistance;
      closestCell = cell;
    }
  }

  return closestCell;
}

function calculateInjectionFromMap(data) {
  const { mapId, rpm, throttle, temperature, lambda } = data;

  const selectedMap = getMapById(mapId);

  if (!selectedMap) {
    return {
      error: "Mapa não encontrado",
    };
  }

  const engineLoad = throttle;

  const closestCell = findClosestFuelCell(
    selectedMap.fuelTable,
    rpm,
    engineLoad
  );

  if (!closestCell) {
    return {
      error: "Tabela de combustível vazia ou inválida",
    };
  }

  const baseFuel = closestCell.fuel;
  const temperatureCorrection = temperature > 90 ? 0.97 : 1.05;
  const lambdaCorrection = lambda < 1 ? 1.02 : 0.98;
  const finalInjectionTime =
    baseFuel * temperatureCorrection * lambdaCorrection;

  return {
    selectedMap: {
      id: selectedMap.id,
      name: selectedMap.name,
      type: selectedMap.type,
    },
    lookup: {
      rpm,
      load: engineLoad,
      closestCell,
    },
    calculation: {
      baseFuel,
      temperatureCorrection,
      lambdaCorrection,
      finalInjectionTime: Number(finalInjectionTime.toFixed(2)),
    },
  };
}

module.exports = {
  getMaps,
  getMapById,
  saveMap,
  updateMap,
  deleteMap,
  calculateInjectionFromMap,
};