const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
require("dotenv").config();

const localIP = "192.168.18.151";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, localIP, () => {
  console.log(`Example app listening on http://${localIP}:${port} ⚡`);
});
