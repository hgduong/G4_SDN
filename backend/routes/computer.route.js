const express = require("express");
const { getAllComputers, getComputerById } = require("../controllers/computer.controller.js");

const router = express.Router();

router.get("/", getAllComputers);
router.get("/:id", getComputerById);

module.exports = router;
