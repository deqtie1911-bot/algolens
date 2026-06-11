// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { skorTahap } from "../data/questions";
import Layout from "../components/Layout";

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const [ujian, setUjian] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDoc(doc(db, "ujian", currentUser.uid)).then((snap) => {
      if (snap.exists()) setUjian(snap.data());
    });
  }, [currentUser]);

  const tahap = ujian ? skorTahap(ujian.skorKeseluruhan) : null;

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Selamat datang, {userProfile?.nama?.split(" ")[0]} 👋</h1>
        <p className="page-subtitle">Pantau perkembangan pemikiran algoritma anda</p>
      </div>

      {!ujian ? (
        <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
          <div style={{ fontSize: 48, marginBottom: "1rem" }}>📋</div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: "0.5rem" }}>Anda belum mengambil ujian diagnostik</h3>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: "1.5rem" }}>Ambil ujian untuk mengetahui profil pemikiran algoritma anda berdasarkan kerangka DAAD.</p>
          <button className="btn-primary" onClick={() => navigate("/ujian")}>Mula Ujian Sekarang</button>
        </div>
      ) : (
        <>
          <div className="metric-grid">
            <div className="metric-card"><div className="metric-label">Skor Keseluruhan</div><div className="metric-value">{ujian.skorKeseluruhan}%</div></div>
            <div className="metric-card"><div className="metric-label">Tahap</div><div className="metric-value" style={{ fontSize: 16 }}><span className={`badge badge-${tahap.badge.split('-')[1]}`}>{tahap.tahap}</span></div></div>
            <div className="metric-card"><div className="metric-label">Decomposition</div><div className="metric-value" style={{ fontSize: 18 }}>{ujian.skor?.D}%</div></div>
            <div className="metric-card"><div className="metric-label">Algorithmization</div><div className="metric-value" style={{ fontSize: 18 }}>{ujian.skor?.AL}%</div></div>
          </div>

          <div className="card">
            <h3 className="card-title">Tindakan Seterusnya</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => navigate("/keputusan")}>📊 Lihat Profil Penuh</button>
              <button className="btn-outline" onClick={() => navigate("/cadangan")}>💡 Cadangan Intervensi</button>
              <button className="btn-outline" onClick={() => navigate("/ujian")}>🔄 Ambil Semula Ujian</button>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Ringkasan Profil</h3>
            {[
              { label: "Decomposition", val: ujian.skor?.D },
              { label: "Abstraction", val: ujian.skor?.A },
              { label: "Algorithmization", val: ujian.skor?.AL },
              { label: "Debugging", val: ujian.skor?.DB }
            ].map(({ label, val }) => {
              const t = skorTahap(val);
              return (
                <div key={label} className="skill-row">
                  <div className="skill-label">
                    <span>{label}</span>
                    <span style={{ fontWeight: 500 }}>{val}%</span>
                  </div>
                  <div className="skill-bar">
                    <div style={{ width: val + "%", height: "100%", background: t.color, borderRadius: 4 }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Layout>
  );
}
