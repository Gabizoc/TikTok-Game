const express = require("express");
const giftRoutes = require("./gift");
const gameRoutes = require("./game");
const pageRoutes = require("./page")

const router = express.Router();
router.use("/api/gift", giftRoutes);
router.use("/api/game", gameRoutes);
router.use("/api/page", pageRoutes);

module.exports = router;
