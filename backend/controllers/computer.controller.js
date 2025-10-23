const Computer = require("../models/computer.model.js");

// Lấy danh sách máy (có thể filter theo status)
const getAllComputers = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const comps = await Computer.find(filter).sort({ computer_name: 1 });
    res.status(200).json(comps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy máy theo id
const getComputerById = async (req, res) => {
  try {
    const comp = await Computer.findById(req.params.id);
    if (!comp) return res.status(404).json({ message: "Computer not found" });
    res.status(200).json(comp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllComputers, getComputerById };
