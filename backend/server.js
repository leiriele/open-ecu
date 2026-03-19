const express = require("express");
const cors = require("cors");
const ecuRoutes = require("./routes/ecuRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const runRoutes = require("./routes/runRoutes");
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "OpenECU API running" });
});

app.use("/ecu", ecuRoutes);
app.use("/engine", sensorRoutes);
app.use("/engine", runRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});