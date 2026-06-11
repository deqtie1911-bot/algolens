// src/pages/Ujian.js
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { questions } from "../data/questions";
import Layout from "../components/Layout";

export default function Ujian() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900);
  const [submitted, setSubmitted] = useState(false);
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  const submitUjian = useCallback(async (finalAnswers) => {
    const skor = {};
    const komponenCount = { D: 0, A: 0, AL: 0, DB: 0 };
    const komponenBetul = { D: 0, A: 0, AL: 0, DB: 0 };

    questions.forEach((q, idx) => {
      const userAns = finalAnswers[idx] || [];
      const correct = q.answers;
      const isCorrect = JSON.stringify([...userAns].sort()) === JSON.stringify([...correct].sort());
      komponenCount[q.komponen]++;
      if (isCorrect) komponenBetul[q.komponen]++;
    });

    Object.keys(komponenCount).forEach((k) => {
      skor[k] = komponenCount[k] > 0 ? Math.round((komponenBetul[k] / komponenCount[k]) * 100) : 0;
    });

    const skorKeseluruhan = Math.round(Object.values(skor).reduce((a, b) => a + b, 0) / 4);

    await setDoc(doc(db, "ujian", currentUser.uid), {
      uid: currentUser.uid,
      nama: userProfile.nama,
      kelas: userProfile.kelas || "",
      skor,
      skorKeseluruhan,
      tarikhUjian: serverTimestamp(),
    });

    navigate("/keputusan");
  }, [currentUser, userProfile, navigate]);

  useEffect(() => {
    if (submitted) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timer); submitUjian(answers); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, answers, submitUjian]);

  const handleAnswer = (idx) => {
    const q = questions[currentQ];
    if (q.type === "single") {
      setAnswers({ ...answers, [currentQ]: [idx] });
    } else {
      const prev = answers[currentQ] || [];
      const updated = prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx];
      setAnswers({ ...answers, [currentQ]: updated });
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    await submitUjian(answers);
  };

  const q = questions[currentQ];
  const userAns = answers[currentQ] || [];
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const progress = Math.round(((currentQ + 1) / questions.length) * 100);

  return (
    <Layout>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="page-title">Ujian Diagnostik Pemikiran Algoritma</h1>
          <p className="page-subtitle">Soalan {currentQ + 1} / {questions.length} — Bahagian: {q.bahagian}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 24, fontWeight: 600, color: timeLeft < 120 ? "#ef4444" : "#4f46e5" }}>
            {mins}:{secs}
          </div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Masa Berbaki</div>
        </div>
      </div>

      <div className="card">
        <div className="progress-bar" style={{ marginBottom: "1rem" }}>
          <div className="progress-fill" style={{ width: progress + "%" }}></div>
        </div>
        <p style={{ fontSize: 15, fontWeight: 500, color: "#111827", marginBottom: "1.25rem", lineHeight: 1.6 }}>{q.text}</p>
        {q.type === "multi" && (
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: "0.75rem" }}>* Boleh pilih lebih dari satu jawapan</p>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {q.options.map((opt, i) => {
            const selected = userAns.includes(i);
            return (
              <label
                key={i}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px",
                  border: `1.5px solid ${selected ? "#4f46e5" : "#e5e7eb"}`,
                  borderRadius: 8, cursor: "pointer",
                  background: selected ? "#eef2ff" : "white",
                  transition: "all 0.15s"
                }}
              >
                <input
                  type={q.type === "multi" ? "checkbox" : "radio"}
                  checked={selected}
                  onChange={() => handleAnswer(i)}
                  style={{ marginTop: 2, flexShrink: 0, accentColor: "#4f46e5" }}
                />
                <span style={{ fontSize: 14, color: "#111827", lineHeight: 1.5 }}>{opt}</span>
              </label>
            );
          })}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1.5rem" }}>
          <button className="btn-outline" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>
            ← Sebelumnya
          </button>
          {currentQ < questions.length - 1 ? (
            <button className="btn-primary" onClick={() => setCurrentQ(currentQ + 1)}>Seterusnya →</button>
          ) : (
            <button className="btn-primary" onClick={handleSubmit} disabled={submitted}>
              {submitted ? "Menghantar..." : "Hantar Ujian ✓"}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}
