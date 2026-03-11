const {
  getMaps,
  getMapById,
  saveMap,
  updateMap,
  deleteMap,
  calculateInjectionFromMap,
} = require("../services/ecuService");

function calculateEcu(req, res) {
  const { mapId, rpm, throttle, temperature, map, lambda } = req.body;

  if (
    mapId === undefined ||
    rpm === undefined ||
    throttle === undefined ||
    temperature === undefined ||
    map === undefined ||
    lambda === undefined
  ) {
    return res.status(400).json({
      error:
        "Campos obrigatórios: mapId, rpm, throttle, temperature, map, lambda",
    });
  }

  const result = calculateInjectionFromMap({
    mapId,
    rpm,
    throttle,
    temperature,
    map,
    lambda,
  });

  if (result.error) {
    return res.status(404).json({
      error: result.error,
    });
  }

  return res.json({
    input: { mapId, rpm, throttle, temperature, map, lambda },
    result,
  });
}

function createMap(req, res) {
  const { name, type, rpmBins, loadBins, fuelGrid } = req.body;

  if (!name || !type || !rpmBins || !loadBins || !fuelGrid) {
    return res.status(400).json({
      error: "Campos obrigatórios: name, type, rpmBins, loadBins, fuelGrid",
    });
  }

  const newMap = saveMap({ name, type, rpmBins, loadBins, fuelGrid });

  return res.status(201).json(newMap);
}

function listMaps(req, res) {
  const maps = getMaps();
  return res.json(maps);
}

function findMapById(req, res) {
  const { id } = req.params;
  const map = getMapById(id);

  if (!map) {
    return res.status(404).json({
      error: "Mapa não encontrado",
    });
  }

  return res.json(map);
}

function editMap(req, res) {
  const { id } = req.params;
  const { name, type, rpmBins, loadBins, fuelGrid } = req.body;

  const updatedMap = updateMap(id, { name, type, rpmBins, loadBins, fuelGrid });

  if (!updatedMap) {
    return res.status(404).json({
      error: "Mapa não encontrado",
    });
  }

  return res.json(updatedMap);
}

function removeMap(req, res) {
  const { id } = req.params;

  const removedMap = deleteMap(id);

  if (!removedMap) {
    return res.status(404).json({
      error: "Mapa não encontrado",
    });
  }

  return res.json({
    message: "Mapa removido com sucesso",
    removedMap,
  });
}

module.exports = {
  calculateEcu,
  createMap,
  listMaps,
  findMapById,
  editMap,
  removeMap,
};