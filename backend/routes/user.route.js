// File: backend/routes/user.route.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");

// CRUD routes
router.get("/", controller.getAllUsers);
router.get("/:id", controller.getUserById);

module.exports = router;