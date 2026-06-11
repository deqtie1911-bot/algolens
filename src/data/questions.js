// src/data/questions.js
export const questions = [
  {
    id: 1,
    bahagian: "Decomposition",
    komponen: "D",
    text: "Anda diminta membina program untuk mengira jumlah bayaran sewa pelajar asrama. Pilih SEMUA langkah utama yang perlu dilakukan.",
    type: "multi",
    options: [
      "Dapatkan nama pelajar",
      "Dapatkan jumlah bilik yang disewa",
      "Dapatkan kadar sewa setiap bilik",
      "Kira jumlah = bilangan bilik × kadar sewa",
      "Cetak nama pensyarah"
    ],
    answers: [1, 2, 3]
  },
  {
    id: 2,
    bahagian: "Decomposition",
    komponen: "D",
    text: "Program perlu mengira markah purata pelajar. Susun langkah yang BETUL untuk menyelesaikan masalah ini.",
    type: "single",
    options: [
      "Input markah → Kira jumlah → Bahagi dengan bilangan → Papar purata",
      "Papar purata → Input markah → Kira jumlah",
      "Kira jumlah → Input markah → Bahagi → Papar",
      "Input markah → Papar → Kira jumlah → Bahagi"
    ],
    answers: [0]
  },
  {
    id: 3,
    bahagian: "Abstraction",
    komponen: "A",
    text: "Sebuah kolej ingin menganjurkan hari sukan. Maklumat diberi seperti berikut. Pilih MAKLUMAT PENTING sahaja untuk menentukan jumlah kos keseluruhan majlis.",
    type: "multi",
    options: [
      "Jumlah peserta: 120 orang",
      "Tarikh: 12 Mei 2025",
      "Kos sewa padang: RM300",
      "Warna t-shirt: Merah/Biru/Kuning",
      "Setiap peserta mendapat t-shirt berharga RM15",
      "Majlis bermula jam 8.00 pagi"
    ],
    answers: [0, 2, 4]
  },
  {
    id: 4,
    bahagian: "Abstraction",
    komponen: "A",
    text: "Apakah CORAK (pattern) yang wujud dalam siri nombor berikut: 2, 4, 8, 16, 32?",
    type: "single",
    options: [
      "Tambah 2 setiap kali",
      "Darab 2 setiap kali",
      "Tambah 4 setiap kali",
      "Darab 4 setiap kali"
    ],
    answers: [1]
  },
  {
    id: 5,
    bahagian: "Algorithmization",
    komponen: "AL",
    text: "Susun pseudokod berikut dengan BETUL untuk mengira gred pelajar berdasarkan markah:",
    type: "single",
    options: [
      "MULA → INPUT markah → JIKA markah >= 80 MAKA gred = 'A' → CETAK gred → TAMAT",
      "TAMAT → CETAK gred → INPUT markah → MULA",
      "CETAK gred → MULA → INPUT markah → JIKA markah >= 80",
      "INPUT markah → TAMAT → MULA → CETAK gred"
    ],
    answers: [0]
  },
  {
    id: 6,
    bahagian: "Algorithmization",
    komponen: "AL",
    text: "Anda perlu menulis algoritma untuk mencari nombor terbesar dalam senarai. Langkah manakah yang PALING TEPAT?",
    type: "single",
    options: [
      "Tetapkan nilai terbesar = elemen pertama → Bandingkan dengan elemen seterusnya → Kemas kini jika lebih besar → Ulang sehingga habis",
      "Bandingkan semua elemen serentak → Pilih yang terbesar",
      "Susun senarai dahulu → Ambil elemen pertama",
      "Ambil elemen terakhir sebagai terbesar"
    ],
    answers: [0]
  },
  {
    id: 7,
    bahagian: "Debugging",
    komponen: "DB",
    text: "Pseudokod berikut mengandungi RALAT LOGIK: 'UNTUK i = 1 HINGGA 5; CETAK i × i; JIKA i = 3 KELUAR; TAMAT UNTUK'. Apakah output apabila kod ini dijalankan?",
    type: "single",
    options: [
      "Mencetak: 1, 4, 9 kemudian berhenti",
      "Mencetak: 1, 4, 9, 16, 25 tanpa berhenti",
      "Mencetak: 1, 4 kemudian berhenti",
      "Kod tidak akan berjalan langsung"
    ],
    answers: [0]
  },
  {
    id: 8,
    bahagian: "Debugging",
    komponen: "DB",
    text: "Seorang pelajar menulis kod untuk mengira luas segi empat: 'luas = panjang + lebar'. Apakah ralat dalam kod ini?",
    type: "single",
    options: [
      "Operator silap; patut 'luas = panjang × lebar'",
      "Pembolehubah silap; patut 'luas = tinggi × lebar'",
      "Tiada ralat dalam kod tersebut",
      "Perlu tambah 'CETAK luas' sahaja"
    ],
    answers: [0]
  }
];

export const skorTahap = (skor) => {
  if (skor >= 70) return { tahap: "Tinggi", color: "#10b981", badge: "badge-green" };
  if (skor >= 50) return { tahap: "Sederhana", color: "#f59e0b", badge: "badge-amber" };
  return { tahap: "Rendah", color: "#ef4444", badge: "badge-red" };
};

export const cadanganIntervensi = {
  D: {
    nama: "Decomposition",
    aktiviti: [
      "Latihan pecahkan masalah besar kepada sub-masalah kecil",
      "Aktiviti bina carta alir proses harian",
      "Latihan kenal pasti komponen utama sesuatu sistem"
    ]
  },
  A: {
    nama: "Abstraction",
    aktiviti: [
      "Aktiviti kenal pasti maklumat penting dan tidak penting",
      "Latihan pattern recognition daripada set data",
      "Aktiviti generalization — membina rumus atau peraturan umum"
    ]
  },
  AL: {
    nama: "Algorithmization",
    aktiviti: [
      "Latihan susun pseudokod langkah demi langkah",
      "Latihan bina flowchart daripada masalah kehidupan sebenar",
      "Aktiviti trace output berdasarkan urutan arahan"
    ]
  },
  DB: {
    nama: "Debugging",
    aktiviti: [
      "Latihan kenal pasti ralat logik dalam pseudokod",
      "Latihan membetulkan ralat sintaks ringkas",
      "Aktiviti trace dan semak output program"
    ]
  }
};
