const express = require("express");
const { getAllComputers, getComputerById, createComputer, updateComputer, deleteComputer } = require("../controllers/computer.controller.js");

const router = express.Router();

router.get("/", getAllComputers);
router.get("/:id", getComputerById);
router.post("/", createComputer);
router.put("/:id", updateComputer);
router.delete("/:id", deleteComputer);

module.exports = router;
