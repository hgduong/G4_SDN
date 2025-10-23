// File: backend/routes/service_package.routes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/service_package.controller");

// CRUD routes
router.get("/", controller.getAllPackages);
router.get("/:id", controller.getPackageById);
router.post("/", controller.createPackage);
router.put("/:id", controller.updatePackage);
router.delete("/:id", controller.deletePackage);

module.exports = router;
