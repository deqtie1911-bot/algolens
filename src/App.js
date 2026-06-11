// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Ujian from "./pages/Ujian";
import Keputusan from "./pages/Keputusan";
import Pensyarah from "./pages/Pensyarah";
import Analitik from "./pages/Analitik";

function PrivateRoute({ children, role }) {
  const { currentUser, userProfile } = useAuth();
  if (!currentUser) return <Navigate to="/" />;
  if (role && userProfile?.role !== role) return <Navigate to="/dashboard" />;
  return children;
}

function AppRoutes() {
  const { currentUser, userProfile } = useAuth();
  return (
    <Routes>
      <Route path="/" element={currentUser ? <Navigate to={userProfile?.role === "pensyarah" ? "/pensyarah" : "/dashboard"} /> : <Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/ujian" element={<PrivateRoute><Ujian /></PrivateRoute>} />
      <Route path="/keputusan" element={<PrivateRoute><Keputusan /></PrivateRoute>} />
      <Route path="/pensyarah" element={<PrivateRoute role="pensyarah"><Pensyarah /></PrivateRoute>} />
      <Route path="/analitik" element={<PrivateRoute role="pensyarah"><Analitik /></PrivateRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
