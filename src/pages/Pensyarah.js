// src/pages/Pensyarah.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { skorTahap } from "../data/questions";
import Layout from "../components/Layout";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Pensyarah() {
  const [ujianData, setUjianData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDocs(collection(db, "ujian")).then((snap) => {
      setUjianData(snap.docs.map((d) => d.data()));
      setLoading(false);
    });
  }, []);

  if (loading) return <Layout><p style={{ padding: "2rem", color: "#6b7280" }}>Memuatkan data...</p></Layout>;

  const n = ujianData.length || 1;
  const avg = (key) => Math.round(ujianData.reduce((s, d) => s + (d.skor?.[key] || 0), 0) / n);
  const avgD = avg("D"), avgA = avg("A"), avgAL = avg("AL"), avgDB = avg("DB");
  const avgKeseluruhan = Math.round((avgD + avgA + avgAL + avgDB) / 4);

  const tinggi = ujianData.filter((d) => d.skorKeseluruhan >= 70).length;
  const sederhana = ujianData.filter((d) => d.skorKeseluruhan >= 50 && d.skorKeseluruhan < 70).length;
  const rendah = ujianData.filter((d) => d.skorKeseluruhan < 50).length;

  const barData = {
    labels: ["Decomposition", "Abstraction", "Algorithmization", "Debugging"],
    datasets: [{
      data: [avgD, avgA, avgAL, avgDB],
      backgroundColor: ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"],
      borderRadius: 6
    }]
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Dashboard Kelas</h1>
        <p className="page-subtitle">Ringkasan prestasi pemikiran algoritma pelajar</p>
      </div>

      <div className="metric-grid">
        <div className="metric-card"><div className="metric-label">Jumlah Pelajar</div><div className="metric-value">{ujianData.length}</div></div>
        <div className="metric-card"><div className="metric-label">Purata Skor</div><div className="metric-value">{avgKeseluruhan}%</div></div>
        <div className="metric-card"><div className="metric-label">Tahap Tinggi</div><div className="metric-value" style={{ color: "#10b981" }}>{tinggi}</div></div>
        <div className="metric-card"><div className="metric-label">Tahap Rendah</div><div className="metric-value" style={{ color: "#ef4444" }}>{rendah}</div></div>
      </div>

      <div className="card">
        <h3 className="card-title">Purata Skor Komponen DAAD (Kelas)</h3>
        <Bar data={barData} options={{
          plugins: { legend: { display: false } },
          scales: { y: { min: 0, max: 100, ticks: { callback: (v) => v + "%" } } }
        }} />
      </div>

      <div className="card">
        <h3 className="card-title">Taburan Tahap Kemahiran</h3>
        <div style={{ display: "flex", height: 24, borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ width: `${Math.round(tinggi / n * 100)}%`, background: "#10b981" }}></div>
          <div style={{ width: `${Math.round(sederhana / n * 100)}%`, background: "#f59e0b" }}></div>
          <div style={{ width: `${Math.round(rendah / n * 100)}%`, background: "#ef4444" }}></div>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", fontSize: 13, color: "#6b7280" }}>
          <span><span style={{ color: "#10b981" }}>■</span> Tinggi ({tinggi} pelajar)</span>
          <span><span style={{ color: "#f59e0b" }}>■</span> Sederhana ({sederhana} pelajar)</span>
          <span><span style={{ color: "#ef4444" }}>■</span> Rendah ({rendah} pelajar)</span>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Komponen Paling Memerlukan Perhatian</h3>
        {[{ k: "Algorithmization", v: avgAL }, { k: "Abstraction", v: avgA }, { k: "Debugging", v: avgDB }, { k: "Decomposition", v: avgD }]
          .sort((a, b) => a.v - b.v)
          .map(({ k, v }, i) => {
            const t = skorTahap(v);
            return (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ width: 20, color: "#6b7280", fontSize: 13 }}>{i + 1}.</span>
                <span style={{ flex: 1, fontSize: 14 }}>{k}</span>
                <div style={{ width: 200 }}>
                  <div className="skill-bar">
                    <div style={{ width: v + "%", height: "100%", background: t.color, borderRadius: 4 }}></div>
                  </div>
                </div>
                <span style={{ width: 50, textAlign: "right", fontSize: 14, fontWeight: 500 }}>{v}%</span>
                <span className={`badge badge-${t.badge.split('-')[1]}`}>{t.tahap}</span>
              </div>
            );
          })}
      </div>
    </Layout>
  );
}
