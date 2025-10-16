// File: ClientRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import HomePage from "../pages/HomePage";


// Route dành cho client (người dùng)
function ClientRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} /> */}
      </Routes>
    </Layout>
  );
}

export default ClientRoutes;
