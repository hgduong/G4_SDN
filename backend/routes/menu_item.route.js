// File: backend/routes/menu_item.route.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/menu_item.controller");

// CRUD routes
router.get("/", controller.getAllMenuItems);
router.get("/:id", controller.getMenuItemById);

module.exports = router;