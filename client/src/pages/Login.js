// File: Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // gọi API login
      const res = await axios.post("http://localhost:9999/api/auth/login", form);
      alert(res.data.message);

      // Lưu thông tin user vào localStorage (không token)
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Điều hướng về HomePage
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050510] to-[#0D1329]">
      <div className="bg-slate-800/90 p-8 rounded-xl shadow-[0_0_30px_rgba(0,255,255,0.3)] border border-cyan-400/30 w-full max-w-md">
        <h2 className="text-3xl font-orbitron font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
          LOGIN
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="input input-bordered w-full bg-slate-700/80 border-cyan-400/30 text-white focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="input input-bordered w-full bg-slate-700/80 border-cyan-400/30 text-white focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-pink-500 hover:to-cyan-500 text-black font-orbitron font-bold py-3 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.6)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] transform hover:scale-105 transition-all duration-300"
          >
            LOGIN
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          Chưa có tài khoản?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-cyan-400 hover:text-pink-400 cursor-pointer font-bold"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
