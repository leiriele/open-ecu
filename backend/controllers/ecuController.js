const {
  calculateInjection,
  getMaps,
  getMapById,
  saveMap,
  updateMap,
  deleteMap,
} = require("../services/ecuService");

function calculateEcu(req, res) {
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

  const calculation = calculateInjection({
    rpm,
    throttle,
    temperature,
    map,
    lambda,
  });

  return res.json({
    input: { rpm, throttle, temperature, map, lambda },
    calculation,
  });
}

function createMap(req, res) {
  const { name, type, fuelTable } = req.body;

  if (!name || !type || !fuelTable) {
    return res.status(400).json({
      error: "Campos obrigatórios: name, type, fuelTable",
    });
  }

  const newMap = saveMap({ name, type, fuelTable });

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
  const { name, type, fuelTable } = req.body;

  const updatedMap = updateMap(id, { name, type, fuelTable });

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