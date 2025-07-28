const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Testserver läuft!");
});

app.listen(3000, () => {
  console.log("✅ Testserver läuft auf Port 3000");
});
