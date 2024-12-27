require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const superAdminRoutes = require("./routes/superAdminRoutes");
const adminRoutes = require("./routes/adminRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/superadmin", superAdminRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
