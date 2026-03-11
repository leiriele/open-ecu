const express = require("express");
const ecuRoutes = require("./routes/ecuRoutes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "OpenECU API running" });
});

app.use("/ecu", ecuRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});