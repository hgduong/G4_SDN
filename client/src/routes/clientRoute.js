// File: ClientRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import HomePage from "../pages/HomePage";
import ComputerPage from "../pages/ComputerPage";
import AccountPage from "../pages/AccountPage";

// Route dành cho client (người dùng)
function ClientRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/thong-tin-may" element={<ComputerPage />} />
        <Route path="/danh-sach-tai-khoan-nguoi-dung" element={<AccountPage />} />
      </Routes>
    </Layout>
  );
}

export default ClientRoutes;
