const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "funcioando!" });
});

app.listen(PORT, () => {
  console.log("API funcioando");
});
