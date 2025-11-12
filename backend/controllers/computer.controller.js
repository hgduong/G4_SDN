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

// Tạo máy mới
const createComputer = async (req, res) => {
  try {
    const { computer_name, specs, hourly_rate, room } = req.body;

    // Validate required fields
    if (!computer_name || !specs || !hourly_rate || !room) {
      return res.status(400).json({ message: "⚠ Please fill in all required fields before saving." });
    }

    if (!specs.cpu || !specs.gpu || !specs.ram || !specs.storage) {
      return res.status(400).json({ message: "⚠ Please fill in all required fields before saving." });
    }

    // Check if hourly_rate is number
    if (isNaN(hourly_rate) || hourly_rate < 0) {
      return res.status(400).json({ message: "⚠ Invalid input. Please enter correct numeric or text format." });
    }

    // Check duplicate name
    const existing = await Computer.findOne({ computer_name });
    if (existing) {
      return res.status(400).json({ message: "⚠ Computer name already in use. Choose another name." });
    }

    const computer = new Computer({
      computer_name,
      specs,
      hourly_rate,
      room,
      status: "available",
    });

    await computer.save();
    res.status(201).json(computer);
  } catch (error) {
    res.status(500).json({ message: "❌ Unable to fetch or update computer data. Please try again later." });
  }
};

// Cập nhật máy
const updateComputer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const computer = await Computer.findById(id);
    if (!computer) return res.status(404).json({ message: "Computer not found" });

    // Validate fields if provided
    if (updates.hourly_rate !== undefined && (isNaN(updates.hourly_rate) || updates.hourly_rate < 0)) {
      return res.status(400).json({ message: "⚠ Invalid input. Please enter correct numeric or text format." });
    }

    // Check duplicate name if changing name
    if (updates.computer_name && updates.computer_name !== computer.computer_name) {
      const existing = await Computer.findOne({ computer_name: updates.computer_name });
      if (existing) {
        return res.status(400).json({ message: "⚠ Computer name already in use. Choose another name." });
      }
    }

    // If status changes from maintenance to available, update last_maintenance
    if (computer.status === "maintenance" && updates.status === "available") {
      updates.last_maintenance = new Date();
    }

    // Prevent manual change of status to in-use if not already
    if (updates.status === "in-use" && computer.status !== "in-use") {
      return res.status(400).json({ message: "⚠ Status 'in-use' cannot be manually changed." });
    }

    const updated = await Computer.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to update computer record." });
  }
};

// Xóa máy
const deleteComputer = async (req, res) => {
  try {
    const { id } = req.params;
    const computer = await Computer.findById(id);
    if (!computer) return res.status(404).json({ message: "Computer not found" });

    if (computer.status === "in-use") {
      return res.status(400).json({ message: "⚠ Cannot delete an active computer session." });
    }

    await Computer.findByIdAndDelete(id);
    res.status(200).json({ message: "Computer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllComputers, getComputerById, createComputer, updateComputer, deleteComputer };
