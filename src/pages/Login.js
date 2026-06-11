import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", nama: "", noMatrik: "", role: "pelajar", kelas: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (isRegister) {
        const profile = await register(form.email, form.password, form.nama, form.noMatrik, form.role, form.kelas);
        navigate(profile.role === "pensyarah" ? "/pensyarah" : "/dashboard");
      } else {
        const profile = await login(form.email, form.password);
        navigate(profile.role === "pensyarah" ? "/pensyarah" : "/dashboard");
      }
    } catch (err) {
      setError("Email atau kata laluan tidak sah. Sila cuba semula.");
    }
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-icon">⬡</span>
          <h1>AlgoLens</h1>
          <p>Diagnostic Analytics for Algorithmic Thinking</p>
        </div>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input className="login-input" name="nama" placeholder="Nama Penuh" value={form.nama} onChange={handleChange} required />
              <select className="login-input" name="role" value={form.role} onChange={handleChange}>
                <option value="pelajar">Pelajar</option>
                <option value="pensyarah">Pensyarah</option>
              </select>
              {form.role === "pelajar" && (
                <input className="login-input" name="noMatrik" placeholder="No. Matrik" value={form.noMatrik} onChange={handleChange} required />
              )}
              {form.role === "pelajar" && (
                <input className="login-input" name="kelas" placeholder="Kelas (cth: SFC10403)" value={form.kelas} onChange={handleChange} required />
              )}
            </>
          )}
          <input className="login-input" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input className="login-input" name="password" type="password" placeholder="Kata Laluan" value={form.password} onChange={handleChange} required />
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Sila tunggu..." : isRegister ? "Daftar Akaun" : "Log Masuk"}
          </button>
        </form>
        <p className="login-toggle">
          {isRegister ? "Sudah ada akaun?" : "Belum ada akaun?"}{" "}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Log Masuk" : "Daftar di sini"}
          </span>
        </p>
      </div>
    </div>
  );
}