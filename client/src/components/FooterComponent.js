// File: Footer.js
import React from "react";
import "../assets/style/footer.css";

function Footer() {
  return (
    <footer>
      <div className="footer-content">
        © {new Date().getFullYear()} Gaming Center Management | Designed by G4
      </div>
    </footer>
  );
}

export default Footer;
