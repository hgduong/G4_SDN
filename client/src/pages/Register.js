// File: Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:9999/api/auth/register", form);
      alert(res.data.message);
      navigate("/login"); // sau khi đăng ký thành công → chuyển sang login
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050510] to-[#0D1329] relative overflow-hidden">
      {/* Hiệu ứng nền */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05),transparent_50%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,0,255,0.05),transparent_50%)] animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,255,0,0.05),transparent_50%)] animate-pulse" style={{animationDelay: '2s'}}></div>

      <div className="relative z-10 w-full max-w-md bg-slate-800/90 backdrop-blur-md p-8 rounded-2xl border-2 border-cyan-400/20 shadow-[0_0_40px_rgba(0,255,255,0.3)]">
        <h2 className="text-3xl font-orbitron font-bold text-center mb-6 bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
          REGISTER ACCOUNT
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="input input-bordered w-full bg-slate-700/80 border-cyan-400/30 text-white focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            required
          />
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="input input-bordered w-full bg-slate-700/80 border-cyan-400/30 text-white focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-pink-500 hover:to-cyan-500 text-black font-orbitron font-bold py-3 rounded-lg border border-white/20 shadow-[0_0_15px_rgba(0,255,255,0.6)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] transform hover:scale-105 transition-all duration-300"
          >
            REGISTER
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-400 hover:text-pink-400 cursor-pointer font-bold"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
