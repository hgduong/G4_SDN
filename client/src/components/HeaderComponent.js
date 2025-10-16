// File: Header.js
import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-dark text-white py-3 shadow">
      <div className="container d-flex justify-content-between align-items-center">
        <h2 className="m-0">🎮 Gaming Center</h2>
        <nav>
          <Link className="text-white mx-3 text-decoration-none" to="/">Trang chủ</Link>
          <Link className="text-white mx-3 text-decoration-none" to="/about">Giới thiệu</Link>
          <Link className="text-white mx-3 text-decoration-none" to="/contact">Liên hệ</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
