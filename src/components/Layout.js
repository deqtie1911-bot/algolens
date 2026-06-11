// src/components/Layout.js
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Layout.css";

const menuPelajar = [
  { path: "/dashboard", label: "Dashboard", icon: "🏠" },
  { path: "/ujian", label: "Ujian Diagnostik", icon: "📋" },
  { path: "/keputusan", label: "Keputusan Saya", icon: "📊" },
  { path: "/cadangan", label: "Cadangan Intervensi", icon: "💡" },
];

const menuPensyarah = [
  { path: "/pensyarah", label: "Dashboard Kelas", icon: "🏠" },
  { path: "/analitik", label: "Senarai & Analitik", icon: "📋" },
];

export default function Layout({ children }) {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menu = userProfile?.role === "pensyarah" ? menuPensyarah : menuPelajar;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="app-layout">
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">⬡</span>
          {!collapsed && <span className="sidebar-title">AlgoLens</span>}
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "›" : "‹"}
          </button>
        </div>
        <nav className="sidebar-nav">
          {menu.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          {!collapsed && userProfile && (
            <div className="user-info">
              <div className="user-avatar">{userProfile.nama?.charAt(0) || "U"}</div>
              <div>
                <p className="user-name">{userProfile.nama}</p>
                <p className="user-role">{userProfile.role}</p>
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            {!collapsed && " Log Keluar"}
          </button>
        </div>
      </div>
      <main className="main-content">
        <div className="content-inner">{children}</div>
      </main>
    </div>
  );
}
