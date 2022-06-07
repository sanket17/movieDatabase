const express = require("express");
const router = express.Router();

router.use("/user", require("./users"));
router.use("/auth", require("./auth"));
router.use("/actor", require("./actor"));
router.use("/movie", require("./movie"));

module.exports = router;
