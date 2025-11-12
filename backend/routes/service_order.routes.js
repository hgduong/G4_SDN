// File: backend/routes/service_order.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/service_order.controller");

// CRUD routes
router.get("/", controller.getAllServiceOrders);
router.get("/:id", controller.getServiceOrderById);
router.post("/", controller.createServiceOrder);
router.put("/:id", controller.updateServiceOrder);
router.delete("/:id", controller.deleteServiceOrder);

module.exports = router;