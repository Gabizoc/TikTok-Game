const express = require("express");
const liveRoutes = require("./live");
const giftRoutes = require("./gift");

const router = express.Router();
router.use("/api/live", liveRoutes);
router.use("/api/gift", giftRoutes);

module.exports = router;
