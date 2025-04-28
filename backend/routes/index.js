const express = require('express');
const liveRoutes = require("./live");

const router = express.Router();
router.use("/api/live", liveRoutes);

module.exports = router;
