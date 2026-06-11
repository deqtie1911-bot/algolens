import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { skorTahap } from "../data/questions";
import Layout from "../components/Layout";

export default function Analitik() {
  const [data, setData] = useState([]);
  const [carian, setCarian] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getDocs(collection(db, "ujian")).then((snap) => {
      setData(snap.docs.map((d) => ({ ...d.data(), docId: d.id })));
      setLoading(false);
    });
  };

  const handleDelete = async (docId, nama) => {
    if (window.confirm(`Padam rekod ${nama}?`)) {
      await deleteDoc(doc(db, "ujian", docId));
      setData(data.filter((d) => d.docId !== docId));
    }
  };

  const filtered = data.filter((d) =>
    d.nama?.toLowerCase().includes(carian.toLowerCase()) ||
    d.noMatrik?.toLowerCase().includes(carian.toLowerCase())
  );

  const exportCSV = () => {
    const rows = [["Bil", "Nama", "No. Matrik", "Kelas", "Decomposition", "Abstraction", "Algorithmization", "Debugging", "Keseluruhan", "Tahap"]];
    filtered.forEach((d, i) => {
      const t = skorTahap(d.skorKeseluruhan);
      rows.push([i + 1, d.nama, d.noMatrik, d.kelas, d.skor?.D, d.skor?.A, d.skor?.AL, d.skor?.DB, d.skorKeseluruhan, t.tahap]);
    });
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "algolens_analitik.csv"; a.click();
  };

  if (loading) return <Layout><p style={{ padding: "2rem", color: "#6b7280" }}>Memuatkan data...</p></Layout>;

  return (
    <Layout>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 className="page-title">Analitik Kelas — Senarai Pelajar</h1>
          <p className="page-subtitle">{filtered.length} rekod dijumpai</p>
        </div>
        <button className="btn-outline" onClick={exportCSV}>⬇ Muat Turun CSV</button>
      </div>

      <div className="card">
        <input
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, marginBottom: "1rem", background: "#f9fafb" }}
          placeholder="Cari nama atau no. matrik..."
          value={carian}
          onChange={(e) => setCarian(e.target.value)}
        />
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Bil</th>
                <th>Nama</th>
                <th>No. Matrik</th>
                <th>Kelas</th>
                <th>Decomp.</th>
                <th>Abstract.</th>
                <th>Algorithm.</th>
                <th>Debug.</th>
                <th>Keseluruhan</th>
                <th>Tahap</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={11} style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>Tiada rekod ditemui</td></tr>
              ) : (
                filtered.map((d, i) => {
                  const t = skorTahap(d.skorKeseluruhan);
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{d.nama}</td>
                      <td style={{ color: "#6b7280" }}>{d.noMatrik || "-"}</td>
                      <td style={{ color: "#6b7280" }}>{d.kelas || "-"}</td>
                      <td>{d.skor?.D}%</td>
                      <td>{d.skor?.A}%</td>
                      <td>{d.skor?.AL}%</td>
                      <td>{d.skor?.DB}%</td>
                      <td style={{ fontWeight: 600 }}>{d.skorKeseluruhan}%</td>
                      <td><span className={`badge badge-${t.badge.split('-')[1]}`}>{t.tahap}</span></td>
                      <td>
                        <button
                          onClick={() => handleDelete(d.docId, d.nama)}
                          style={{ background: "#fee2e2", color: "#991b1b", border: "none", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}
                        >
                          Padam
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}