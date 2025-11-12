// File: Header.js
import React from "react";
import { NavLink } from "react-router-dom";
import "../assets/style/header.css";

function Header() {
  return (
    <header>
      <nav className="navbar">
        <h2 className="logo">Gaming Center Management</h2>
        <ul className="menu">
          <li><NavLink to="/" end>Trang chủ</NavLink></li>
          <li><NavLink to="/thong-tin-may">Thông tin máy</NavLink></li>
          <li><NavLink to="/contact">Dịch vụ đồ ăn</NavLink></li>
          <li><NavLink to="/order">Order</NavLink></li>
          <li><NavLink to="/danh-sach-tai-khoan-nguoi-dung">Tài khoản người dùng</NavLink></li>
          <li><NavLink to="/xu-ly-thanh-toan">Xử lý thanh toán</NavLink></li>
          <li><NavLink to="/lich-su-su-dung">Danh sách</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
