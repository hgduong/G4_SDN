// File: Footer.js
import React from "react";
import "../assets/style/footer.css"
function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <p className="mb-0">
        © {new Date().getFullYear()} Gaming Center Management | Designed by G4
      </p>
    </footer>
  );
}

export default Footer;
