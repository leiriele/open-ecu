const express = require("express");
const router = express.Router();

const {
  calculateEcu,
  createMap,
  listMaps,
  findMapById,
  editMap,
  removeMap,
} = require("../controllers/ecuController");

router.post("/calculate", calculateEcu);

router.post("/maps", createMap);
router.get("/maps", listMaps);
router.get("/maps/:id", findMapById);
router.put("/maps/:id", editMap);
router.delete("/maps/:id", removeMap);

module.exports = router;