// File: ClientRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import HomePage from "../pages/HomePage";
import ComputerPage from "../pages/ComputerPage";
import ChooseComputerPage from "../pages/ChooseComputerPage";
import AccountPage from "../pages/AccountPage";
import ReservationPage from "../pages/ReservationPage";
import PaymentPage from "../pages/PaymentPage";
import UsageHistoryPage from "../pages/UsageHistoryPage";
import ServiceOrdersPage from "../pages/ServiceOrdersPage";
import PackagePage from "../pages/PackagePage";
import NotificationCenterPage from "../pages/NotificationCenterPage";
import NotificationManagementPage from "../pages/NotificationManagementPage";

// Route dành cho client (người dùng)
function ClientRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
  <Route path="/thong-tin-may" element={<ComputerPage />} />
  <Route path="/chon-may" element={<ChooseComputerPage />} />
        <Route path="/dat-cho" element={<ReservationPage />} />
        <Route path="/danh-sach-tai-khoan-nguoi-dung" element={<AccountPage />} />
        <Route path="/xu-ly-thanh-toan" element={<PaymentPage />} />
        <Route path="/lich-su-su-dung" element={<UsageHistoryPage />} />
        <Route path="/order" element={<ServiceOrdersPage />} />
        <Route path="/package" element={<PackagePage />} />
        <Route path="/notifications" element={<NotificationCenterPage />} />
        <Route path="/admin/notifications" element={<NotificationManagementPage />} />
      </Routes>
    </Layout>
  );
}

export default ClientRoutes;
