// File: Layout.js
import React from "react";
import Header from "../components/HeaderComponent";
import Footer from "../components/FooterComponent";

function Layout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 container my-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
