import React from "react";
import Header from "../components/HeaderComponent";
import Footer from "../components/FooterComponent";
import "../App.css";

function Layout({ children }) {
  return (
    <div className="layout-wrapper">
      <Header />
      <main className="layout-body">
        <div className="container py-4">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
