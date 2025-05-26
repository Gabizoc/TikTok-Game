const express = require("express");
const giftRoutes = require("./gift");
const gameRoutes = require("./game");
const pageRoutes = require("./page");
const authRoutes = require("./auth");
const userRoutes = require("./user");

const router = express.Router();
router.use("/api/gift", giftRoutes);
router.use("/api/game", gameRoutes);
router.use("/api/page", pageRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/user", userRoutes);

module.exports = router;
