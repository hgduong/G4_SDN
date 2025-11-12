// File: HomePage.js
import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="text-center">
      <h1>Chào mừng đến Gaming Center!</h1>
      <p>Đặt máy, gọi đồ ăn và quản lý tài khoản của bạn chỉ với vài cú click!</p>

      <div className="mt-8 space-x-4">
        <Link to="/dat-cho" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Đặt chỗ máy tính
        </Link>
        <Link to="/thong-tin-may" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
          Xem thông tin máy
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
