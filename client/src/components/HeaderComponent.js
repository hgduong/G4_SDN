// File: Header.js
import React from "react";
import { Link } from "react-router-dom";
import "../assets/style/header.css";

function Header() {
  return (
    <header>
      <div>
        <nav className="navbarheader">
          <h2 className="logo">🎮 Gaming Center Management</h2>
          <Link className="navbarheader" to="/">
            Trang chủ
          </Link>
          <Link className="navbarheader" to="/thong-tin-may">
            Thông tin máy
          </Link>
          <Link className="navbarheader" to="/contact">
            Dịch vụ đồ ăn
          </Link>
          <Link className="navbarheader" to="/">
            Order
          </Link>
          <Link className="navbarheader" to="/danh-sach-tai-khoan-nguoi-dung">
            Tài khoản người dùng
          </Link>
          <Link className="navbarheader" to="/contact">
            Danh sách chặn
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
