const express = require("express");
const connectDB = require("./config/db");
const router = require("./index.js");
const paymentRoutes = require("./routes/payment.route");
const reservationRoutes = require("./routes/reservation.route");
const usageLogRoutes = require("./routes/usage_log.route");
const computerRoutes = require("./routes/computer.route");
const notificationRouter = require("./routes/notification.route");

const app = express();
connectDB();
app.use(express.json());
app.use("/", router);
app.use("/api/payments", paymentRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/usage-logs", usageLogRoutes);
app.use("/api/computers", computerRoutes);
app.use("/api/notifications", notificationRouter);
const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
