const express = require("express");
const router = express.Router();

const { runEngine, listRuns } = require("../controllers/runController");

router.post("/run", runEngine);
router.get("/runs", listRuns);

module.exports = router;