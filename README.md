# AlgoLens — Panduan Deploy

## Langkah 1: Setup Firebase (10 minit)

1. Pergi ke https://console.firebase.google.com
2. Klik "Add project" → Nama: **algolens**
3. Klik "Web" icon (</>)  → Nama app: algolens → Klik "Register app"
4. **Salin firebaseConfig** yang dipaparkan
5. Buka fail `src/firebase.js` → Gantikan nilai `YOUR_...` dengan config anda

### Aktifkan Firebase Services:
- **Authentication**: Build → Authentication → Get started → Email/Password → Enable
- **Firestore**: Build → Firestore Database → Create database → Start in test mode → Asia-southeast1

### Firestore Security Rules (untuk production):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /ujian/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Langkah 2: Install & Test Tempatan (5 minit)

```bash
cd algolens
npm install
npm start
```
Buka http://localhost:3000

---

## Langkah 3: Deploy ke Vercel (5 minit)

1. Pergi ke https://vercel.com → Sign up dengan GitHub
2. Push kod ke GitHub:
```bash
git init
git add .
git commit -m "AlgoLens v1.0"
git branch -M main
git remote add origin https://github.com/USERNAME/algolens.git
git push -u origin main
```
3. Di Vercel: "New Project" → Import repo algolens → Deploy
4. URL automatik: **algolens.vercel.app**

---

## Struktur Fail

```
algolens/
├── src/
│   ├── firebase.js          ← Letak config Firebase di sini
│   ├── context/AuthContext.js
│   ├── data/questions.js    ← Soalan ujian (boleh tambah/edit)
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── Ujian.js
│   │   ├── Keputusan.js
│   │   ├── Pensyarah.js
│   │   └── Analitik.js
│   └── components/Layout.js
└── public/index.html
```

---

## Demo untuk Pertandingan

**Akaun demo pelajar:**
- Email: pelajar@demo.com / Password: demo123

**Akaun demo pensyarah:**
- Email: pensyarah@demo.com / Password: demo123

(Daftar melalui sistem dahulu)

---

## Masalah Lazim

| Masalah | Penyelesaian |
|---------|--------------|
| Firebase error | Semak firebaseConfig di firebase.js |
| Blank page | Jalankan `npm install` semula |
| Auth error | Pastikan Email/Password diaktifkan di Firebase Console |
