// File: App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientRoutes from "./routes/clientRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 Route client */}
        <Route path="/*" element={<ClientRoutes />} />

        {/* 🔹 Sau này có thể thêm route admin */}
        {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
