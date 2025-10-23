import ServiceOrder from "../models/service_order.model.js";

// Helper: calculate total price from service package and food items
const calculateTotalPrice = (service_package, food_items = []) => {
  let total = 0;
  if (service_package && typeof service_package.price === "number") total += service_package.price;
  for (const item of food_items) {
    const price = typeof item.price === "number" ? item.price : 0;
    const qty = typeof item.quantity === "number" ? item.quantity : 1;
    total += price * qty;
  }
  return total;
};

// 🔹 Lấy tất cả đơn dịch vụ (với lọc, phân trang đơn giản)
export const getAllServiceOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, customer_id } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (customer_id) filter.customer_id = customer_id;

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const orders = await ServiceOrder.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await ServiceOrder.countDocuments(filter);
    res.status(200).json({ data: orders, meta: { total, page: Number(page), limit: Number(limit) } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Tạo đơn dịch vụ mới
export const createServiceOrder = async (req, res) => {
  try {
    const body = req.body;

    // ensure minimal required fields
    if (!body.customer_name || !body.customer_id || !body.service_package || !body.payment) {
      return res.status(400).json({ message: "customer_name, customer_id, service_package and payment are required" });
    }

    // generate order_id if missing
    if (!body.order_id) body.order_id = `SO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // calculate total_price if not provided or recalc to be safe
    const total_price = calculateTotalPrice(body.service_package, body.food_items);
    body.total_price = total_price;

    const order = new ServiceOrder(body);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Lấy đơn theo ID
export const getServiceOrderById = async (req, res) => {
  try {
    const order = await ServiceOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "ServiceOrder not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Cập nhật đơn
export const updateServiceOrder = async (req, res) => {
  try {
    const updates = req.body;

    // If service_package or food_items present in update, recalc total_price
    if (updates.service_package || updates.food_items) {
      // fetch existing to merge
      const existing = await ServiceOrder.findById(req.params.id).lean();
      if (!existing) return res.status(404).json({ message: "ServiceOrder not found" });

      const mergedServicePackage = updates.service_package || existing.service_package;
      const mergedFoodItems = updates.food_items || existing.food_items || [];
      updates.total_price = calculateTotalPrice(mergedServicePackage, mergedFoodItems);
    }

    const updated = await ServiceOrder.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "ServiceOrder not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Xóa đơn
export const deleteServiceOrder = async (req, res) => {
  try {
    const deleted = await ServiceOrder.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "ServiceOrder not found" });
    res.status(200).json({ message: "ServiceOrder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllServiceOrders,
  getServiceOrderById,
  createServiceOrder,
  updateServiceOrder,
  deleteServiceOrder,
};
