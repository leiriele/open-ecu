const express = require("express");
const router = express.Router();

const {
  createSensorReading,
  listSensorHistory,
  getCurrentSensors,
} = require("../controllers/sensorController");

router.post("/sensors", createSensorReading);
router.get("/sensors", getCurrentSensors);
router.get("/history", listSensorHistory);

module.exports = router;