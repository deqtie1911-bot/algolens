import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { skorTahap, cadanganIntervensi } from "../data/questions";
import Layout from "../components/Layout";

export default function Cadangan() {
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const navigate = require("react-router-dom").useNavigate();

  useEffect(() => {
    getDoc(doc(db, "ujian", currentUser.uid)).then((snap) => {
      if (snap.exists()) setData(snap.data());
    });
  }, [currentUser]);

  if (!data) return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Cadangan Intervensi</h1>
      </div>
      <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>Sila ambil ujian diagnostik terlebih dahulu.</p>
        <button className="btn-primary" onClick={() => navigate("/ujian")}>Mula Ujian</button>
      </div>
    </Layout>
  );

  const { skor } = data;
  const komponenLemah = Object.entries({ D: skor.D, A: skor.A, AL: skor.AL, DB: skor.DB })
    .filter(([, v]) => v < 70)
    .sort(([, a], [, b]) => a - b);

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Cadangan Intervensi Untuk Anda</h1>
        <p className="page-subtitle">Berdasarkan profil diagnostik anda</p>
      </div>
      {komponenLemah.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ color: "#10b981", fontSize: 16, fontWeight: 500 }}>Tahniah! Semua komponen mencapai tahap tinggi.</p>
        </div>
      ) : (
        komponenLemah.map(([k]) => {
          const c = cadanganIntervensi[k];
          const t = skorTahap(skor[k]);
          return (
            <div key={k} style={{ borderLeft: `3px solid ${t.color}`, padding: "0.75rem 1rem", marginBottom: "0.75rem", background: "#f9fafb", borderRadius: "0 8px 8px 0" }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: "0.5rem" }}>
                {c.nama} <span className={`badge badge-${t.badge.split('-')[1]}`}>{t.tahap}</span>
              </div>
              <ul style={{ fontSize: 13, color: "#374151", paddingLeft: "1.25rem", lineHeight: 1.9 }}>
                {c.aktiviti.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          );
        })
      )}
    </Layout>
  );
}