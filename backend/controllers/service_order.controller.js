const ServiceOrder = require("../models/service_order.model.js");

// Helper: calculate total price from items
const calculateTotalPrice = (items = []) => {
  let total = 0;
  for (const item of items) {
    const price = typeof item.price === "number" ? item.price : 0;
    const qty = typeof item.quantity === "number" ? item.quantity : 1;
    total += price * qty;
  }
  return total;
};

// 🔹 Lấy tất cả đơn dịch vụ (với lọc, phân trang đơn giản)
const getAllServiceOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, customer_id } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (customer_id) filter.customer_id = customer_id;

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const orders = await ServiceOrder.find(filter)
      .sort({ order_time: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ServiceOrder.countDocuments(filter);
    res.status(200).json({ data: orders, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Tạo đơn dịch vụ mới
const createServiceOrder = async (req, res) => {
  try {
    const body = req.body;

    // ensure minimal required fields
    if (!body.user_id || !body.computer_id || !body.items || body.items.length === 0) {
      return res.status(400).json({ message: "user_id, computer_id and items are required" });
    }

    // generate order_id if missing
    if (!body.order_id) body.order_id = Date.now(); // simple number

    // calculate total_price
    const total_price = calculateTotalPrice(body.items);
    body.total_price = total_price;

    const order = new ServiceOrder(body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Lấy đơn theo ID
const getServiceOrderById = async (req, res) => {
  try {
    const order = await ServiceOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "ServiceOrder not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Cập nhật đơn
const updateServiceOrder = async (req, res) => {
  try {
    const updates = req.body;

    // Fetch existing order
    const existing = await ServiceOrder.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "ServiceOrder not found" });

    // If items present in update, recalc total_price
    if (updates.items) {
      updates.total_price = calculateTotalPrice(updates.items);
    }

    // If status is being updated, require staff_id
    if (updates.status && updates.status !== existing.status) {
      if (!updates.staff_id) {
        return res.status(400).json({ message: "staff_id is required when updating status" });
      }
    }

    const updated = await ServiceOrder.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "ServiceOrder not found" });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Xóa đơn
const deleteServiceOrder = async (req, res) => {
  try {
    const deleted = await ServiceOrder.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "ServiceOrder not found" });
    res.status(200).json({ message: "ServiceOrder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllServiceOrders,
  getServiceOrderById,
  createServiceOrder,
  updateServiceOrder,
  deleteServiceOrder,
};
