// src/pages/Keputusan.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import { skorTahap, cadanganIntervensi } from "../data/questions";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function Keputusan() {
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getDoc(doc(db, "ujian", currentUser.uid)).then((snap) => {
      if (snap.exists()) setData(snap.data());
    });
  }, [currentUser]);

  if (!data) return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Keputusan Saya</h1>
        <p className="page-subtitle">Anda belum mengambil sebarang ujian.</p>
      </div>
      <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
        <p style={{ color: "#6b7280", marginBottom: "1rem" }}>Sila ambil ujian diagnostik terlebih dahulu.</p>
        <button className="btn-primary" onClick={() => navigate("/ujian")}>Mula Ujian</button>
      </div>
    </Layout>
  );

  const { skor, skorKeseluruhan } = data;
  const tahap = skorTahap(skorKeseluruhan);

  const radarData = {
    labels: ["Decomposition", "Abstraction", "Algorithmization", "Debugging"],
    datasets: [{
      label: "Skor Anda",
      data: [skor.D, skor.A, skor.AL, skor.DB],
      backgroundColor: "rgba(79,70,229,0.2)",
      borderColor: "#4f46e5",
      pointBackgroundColor: "#4f46e5",
      pointRadius: 5
    }]
  };

  const komponenLemah = Object.entries({ D: skor.D, A: skor.A, AL: skor.AL, DB: skor.DB })
    .filter(([, v]) => v < 70)
    .sort(([, a], [, b]) => a - b);

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Profil Keputusan Diagnostik</h1>
        <p className="page-subtitle">Berdasarkan ujian terkini anda</p>
      </div>

      <div className="metric-grid">
        <div className="metric-card"><div className="metric-label">Skor Keseluruhan</div><div className="metric-value">{skorKeseluruhan}%</div></div>
        <div className="metric-card"><div className="metric-label">Tahap</div><div className="metric-value" style={{ fontSize: 16 }}><span className={`badge badge-${tahap.badge.split('-')[1]}`}>{tahap.tahap}</span></div></div>
        <div className="metric-card"><div className="metric-label">Decomposition</div><div className="metric-value" style={{ fontSize: 18 }}>{skor.D}%</div></div>
        <div className="metric-card"><div className="metric-label">Abstraction</div><div className="metric-value" style={{ fontSize: 18 }}>{skor.A}%</div></div>
        <div className="metric-card"><div className="metric-label">Algorithmization</div><div className="metric-value" style={{ fontSize: 18 }}>{skor.AL}%</div></div>
        <div className="metric-card"><div className="metric-label">Debugging</div><div className="metric-value" style={{ fontSize: 18 }}>{skor.DB}%</div></div>
      </div>

      <div className="card">
        <h3 className="card-title">Radar Profil DAAD</h3>
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ width: 260, flexShrink: 0 }}>
            <Radar data={radarData} options={{
              scales: { r: { min: 0, max: 100, ticks: { stepSize: 25 } } },
              plugins: { legend: { display: false } }
            }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            {[
              { key: "D", label: "Decomposition", val: skor.D },
              { key: "A", label: "Abstraction", val: skor.A },
              { key: "AL", label: "Algorithmization", val: skor.AL },
              { key: "DB", label: "Debugging", val: skor.DB }
            ].map(({ label, val }) => {
              const t = skorTahap(val);
              return (
                <div key={label} className="skill-row">
                  <div className="skill-label">
                    <span>{label}</span>
                    <span>{val}% <span className={`badge badge-${t.badge.split('-')[1]}`}>{t.tahap}</span></span>
                  </div>
                  <div className="skill-bar">
                    <div style={{ width: val + "%", height: "100%", background: t.color, borderRadius: 4 }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {komponenLemah.length > 0 && (
        <div className="card">
          <h3 className="card-title">Cadangan Intervensi</h3>
          {komponenLemah.map(([k]) => {
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
          })}
        </div>
      )}
    </Layout>
  );
}
