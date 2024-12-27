const express = require("express");
const { login } = require("../controllers/superadmins/account");

const router = express.Router();

router.post("/login", login);

module.exports = router;
