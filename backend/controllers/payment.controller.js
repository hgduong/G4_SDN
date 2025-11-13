const Payment = require("../models/payment.model.js");
const Computer = require("../models/computer.model.js");
const UsageLog = require("../models/usage_log.model.js");
const ServiceOrder = require("../models/service_order.model.js");
const Notification = require("../models/notification.model.js");

// 🔹 Lấy tất cả thanh toán
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("user_id").populate("reservation_id");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Tạo thanh toán mới
const createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Lấy thanh toán theo ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("user_id")
      .populate("reservation_id");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Cập nhật thanh toán
const updatePayment = async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Xóa thanh toán
const deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Gán máy cho user dựa trên payment đã hoàn thành
// POST /api/payments/:id/assign-computer
const assignComputer = async (req, res) => {
  try {
    const paymentId = req.params.id;
    const { computer_id, service_order_id } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    if (payment.status !== "completed") {
      return res.status(400).json({ message: "Payment is not completed" });
    }

    if (!computer_id) return res.status(400).json({ message: "computer_id is required" });

    const computer = await Computer.findById(computer_id);
    if (!computer) return res.status(404).json({ message: "Computer not found" });

    if (computer.status !== "available") {
      return res.status(400).json({ message: "Computer is not available" });
    }

    // assign computer to user
    computer.status = "in-use";
    computer.current_user = {
      user_id: payment.user_id,
      username: payment.user_id, // best-effort; real username may be populated client-side
    };
    await computer.save();

    // create usage log
    const usageLog = new UsageLog({
      user_id: payment.user_id,
      computer_id: computer._id,
      service_package_id: null,
      start_time: new Date(),
      session_status: "in-progress",
    });
    await usageLog.save();

    // if service_order_id provided, update that order's computer info and status
    if (service_order_id) {
      try {
        const order = await ServiceOrder.findById(service_order_id);
        if (order) {
          order.computer = {
            computer_id: computer._id.toString(),
            name: computer.computer_name,
            location: computer.room,
            specs: JSON.stringify(computer.specs),
          };
          order.status = "serving"; // mark as serving
          await order.save();
        }
      } catch (e) {
        console.error("Failed to update service order with computer assignment", e);
      }
    }

    res.status(200).json({ message: "Computer assigned", computer, usageLog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Xử lý thanh toán
const processPayment = async (req, res) => {
  try {
    const { user_id, amount, method, description } = req.body;

    if (!user_id || !amount || !method) {
      return res.status(400).json({ message: "user_id, amount, and method are required" });
    }

    // Generate payment_id
    const payment_id = `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create payment record
    const payment = new Payment({
      payment_id,
      user_id,
      amount,
      method,
      status: "completed" // Assuming successful for now
    });
    await payment.save();

    // Send notification to user
    try {
      const notification = new Notification({
        noti_id: `NOTI-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user_id,
        title: "Payment Successful",
        message: `Your payment of ${amount} VND has been processed successfully.`,
        type: "system"
      });
      await notification.save();
    } catch (notifError) {
      console.error("Failed to create payment notification:", notifError);
      // Don't fail the payment if notification fails
    }

    res.status(201).json({
      message: "Payment processed successfully",
      payment
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPayments,
  createPayment,
  getPaymentById,
  updatePayment,
  deletePayment,
  assignComputer,
  processPayment,
};
