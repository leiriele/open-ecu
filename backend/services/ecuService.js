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
    rpmBins: mapData.rpmBins,
    loadBins: mapData.loadBins,
    fuelGrid: mapData.fuelGrid,
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
    rpmBins: mapData.rpmBins ?? maps[mapIndex].rpmBins,
    loadBins: mapData.loadBins ?? maps[mapIndex].loadBins,
    fuelGrid: mapData.fuelGrid ?? maps[mapIndex].fuelGrid,
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

  if (!selectedMap.rpmBins || !selectedMap.loadBins || !selectedMap.fuelGrid) {
    return {
      error: "Mapa incompatível com interpolação",
    };
  }

  const engineLoad = throttle;

  const interpolation = bilinearInterpolate(rpm, engineLoad, selectedMap);

  const baseFuel = interpolation.fuel;
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
      interpolation: interpolation.corners,
    },
    calculation: {
      baseFuel,
      temperatureCorrection,
      lambdaCorrection,
      finalInjectionTime: Number(finalInjectionTime.toFixed(2)),
    },
  };
}

function findBoundingIndices(bins, value) {
  if (value <= bins[0]) {
    return { lowIndex: 0, highIndex: 0 };
  }

  if (value >= bins[bins.length - 1]) {
    return { lowIndex: bins.length - 1, highIndex: bins.length - 1 };
  }

  for (let i = 0; i < bins.length - 1; i++) {
    if (value >= bins[i] && value <= bins[i + 1]) {
      return { lowIndex: i, highIndex: i + 1 };
    }
  }

  return { lowIndex: 0, highIndex: 0 };
}

function linearInterpolate(x, x0, x1, y0, y1) {
  if (x0 === x1) {
    return y0;
  }

  return y0 + ((x - x0) * (y1 - y0)) / (x1 - x0);
}

function bilinearInterpolate(rpm, load, selectedMap) {
  const { rpmBins, loadBins, fuelGrid } = selectedMap;

  const { lowIndex: rpmLow, highIndex: rpmHigh } = findBoundingIndices(rpmBins, rpm);
  const { lowIndex: loadLow, highIndex: loadHigh } = findBoundingIndices(loadBins, load);

  const rpm0 = rpmBins[rpmLow];
  const rpm1 = rpmBins[rpmHigh];
  const load0 = loadBins[loadLow];
  const load1 = loadBins[loadHigh];

  const q11 = fuelGrid[rpmLow][loadLow];
  const q21 = fuelGrid[rpmHigh][loadLow];
  const q12 = fuelGrid[rpmLow][loadHigh];
  const q22 = fuelGrid[rpmHigh][loadHigh];

  const r1 = linearInterpolate(rpm, rpm0, rpm1, q11, q21);
  const r2 = linearInterpolate(rpm, rpm0, rpm1, q12, q22);
  const fuel = linearInterpolate(load, load0, load1, r1, r2);

  return {
    fuel: Number(fuel.toFixed(2)),
    corners: {
      rpm0,
      rpm1,
      load0,
      load1,
      q11,
      q21,
      q12,
      q22,
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