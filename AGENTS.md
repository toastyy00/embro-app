# AGENTS.md - Panduan Arsitektur & Peta Proyek untuk AI Assistants
> Dokumen ini dirancang khusus untuk memandu AI coding agents (Antigravity, Gemini Code Assist, Claude Code, GitHub Copilot, Codex, Cursor) agar dapat memahami, mencari, memodifikasi, dan mengembangkan fitur di proyek ini secara cepat, hemat token, dan bebas error.

---

## 1. Ikhtisar Proyek (Project Overview)
* **Nama Proyek:** `embro-app` (Embro Optimizer)
* **Tujuan Aplikasi:** Sistem cerdas untuk optimasi urutan jarum mesin bordir komputer multi-kepala, verifikasi trial benang (ACC), penjadwalan mesin (SPK), manajemen stok benang gudang, dan master database Wilcom floppy.
* **Paradigma Arsitektur:** **Modular Single File Components (SFC)** berbasis Vite + Vue 3 + Pinia + Tailwind CSS.

---

## 2. Stack Teknologi & Versi
| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Runtime / Tooling** | Node.js (v20+), Vite 5 | Hot Module Replacement (HMR) sub-detik |
| **Framework** | Vue 3.4+ (`<script setup>`) | Composition API modern standar resmi |
| **State Management** | Pinia 2.2+ | Store terpisah per domain domain/modul |
| **CSS Framework** | Tailwind CSS 3.4+ | Purged, utility-first styling |
| **Backend & Sync** | Firebase Modular SDK (v10) | Realtime Database + Storage |

---

## 3. Peta Direktori & Pemetaan File (Directory Map)

Ketika Anda diminta untuk memeriksa, memperbaiki, atau menambah fitur, **langsung buka file terkait berikut tanpa perlu memproses file lain**:

```
embro-app/
├── AGENTS.md                  <-- Panduan untuk AI Agent (berkas ini)
├── index.html                 <-- Entry point HTML Vite (ringkas, < 25 baris)
├── index.monolith.html        <-- Arsip cadangan berkas monolitik lama (HANYA REFERENSI)
├── package.json               <-- Dependensi npm & script dev/build
├── vite.config.js             <-- Konfigurasi Vite & alias '@/' -> 'src/'
├── tailwind.config.js         <-- Konfigurasi font & tema warna kustom zinc
├── postcss.config.js          <-- PostCSS plugin (Tailwind + Autoprefixer)
│
└── src/
    ├── main.js                <-- Entry point script Vue 3 & Pinia initialization
    ├── App.vue                <-- Root layout shell (Header, Tab Switcher, Toast)
    │
    ├── assets/
    │   └── main.css           <-- Tailwind directives & kustom styling scrollbar
    │
    ├── utils/                 <-- LOGIKA MURNI (Pure JS, Tanpa DOM, Mudah di-Unit Test)
    │   ├── needleSolver.js    <-- Algoritma optimasi jarum & pembagian tahap (stages)
    │   ├── colorPalette.js    <-- Katalog benang Rayon Star Elephant, hex, dan getTextColor
    │   └── imageCompressor.js <-- Kompresor foto Wilcom ke format WebP via HTML5 Canvas
    │
    ├── services/              <-- INTEGRASI EKSTERNAL
    │   └── firebase.js        <-- Inisialisasi Firebase Realtime Database & Auth
    │
    ├── stores/                <-- STATE MANAGEMENT (PINIA STORES)
    │   ├── useTrialStore.js   <-- State CMT, jarum swap, stages, & logika approval ACC
    │   ├── useInventoryStore.js <-- State stok benang gudang & tombol quick adjust [-]/[+]
    │   ├── useFloppyStore.js  <-- State master file Wilcom, stitches, & upload screenshot
    │   └── useToastStore.js   <-- State notifikasi toast melayang
    │
    ├── components/            <-- KOMPONEN REUSABLE
    │   ├── common/
    │   │   ├── AppNavigation.vue  <-- Switcher tab menu atas
    │   │   └── ToastContainer.vue <-- Kontainer notifikasi toast
    │   └── trial/
    │       └── ComboBadge.vue     <-- Badge sambung kombinasi benang [J3|1171||J2|1070]
    │
    └── views/                 <-- TAMPILAN HALAMAN UTAMA PER MODUL
        ├── TrialView.vue      <-- Modul 1: Trial Benang & Urutan Mesin Operator
        ├── ScheduleView.vue   <-- Modul 2: Jadwal Mesin & Status Siap Jalan
        ├── InventoryView.vue  <-- Modul 3: Manajemen Stok Benang & Lokasi Rak
        └── FloppyView.vue     <-- Modul 4: Database Master File Wilcom & Kompresi Foto
```

---

## 4. Logika Domain Kunci (Crucial Domain Rules)

### A. Isolasi Status ACC Antar Opsi Kombinasi Warna
* **Lokasi:** `src/stores/useTrialStore.js` dan `src/components/trial/ComboBadge.vue`.
* **Aturan Mutlak:** 
  * Status ACC untuk film berkombinasi warna disimpan per opsi: `accMap[key]['opt_' + optIdx] = true`.
  * **Setiap opsi harus berdiri sendiri.** Meng-ACC Opsi 1 (`opt_0`) **TIDAK BOLEH** membuat Opsi 2 (`opt_1`) ter-highlight kuning/amber atau jarumnya menyala putih meskipun keduanya sama-sama memiliki kode benang yang identik (misal: benang `1070`).
  * Wording teks `"OPSI 1"` tidak ditampilkan; langsung tampilkan badge sambung `[ J3 | 🔵 1171 || J2 | 🔵 1070 ]` dengan indikator centang hijau `[✓]` di ujung kiri jika aktif.

### B. Algoritma Pembagian Jarum Mesin Bordir
* **Lokasi:** `src/utils/needleSolver.js` -> fungsi `calculateMachineStages()`.
* **Aturan:**
  * Mesin bordir memiliki jarum tetap (J1–J11 kecuali jarum swap).
  * Jarum swap (default jarum 4 atau jarum ujung) digunakan untuk merotasi benang dinamis.
  * Fungsi ini adalah *pure function*. Jangan mencampurkan kode DOM atau reaktivitas Vue ke dalam berkas ini.

### C. Kompresi Gambar Screenshot Wilcom
* **Lokasi:** `src/utils/imageCompressor.js` -> fungsi `compressImageBase64()`.
* **Aturan:**
  * Foto screenshot dikompresi ke format **WebP** dengan resolusi maksimal 1280px dan kualitas `0.80 - 0.82` sebelum disimpan ke localStorage atau Firebase Storage untuk menghemat kuota.

---

## 5. Panduan Coding untuk AI Assistant (AI Rules of Engagement)

1. **Gunakan Syntax Modern:** Selalu gunakan Vue 3 `<script setup>`, Pinia Composition API syntax (`defineStore('name', () => { ... })`), dan Tailwind CSS utility classes.
2. **Jangan Monolitik Ulang:** Jangan pernah mengembalikan kode menjadi satu file monolitik besar. Tetap jaga pemisahan modular per berkas.
3. **Penyimpanan State:**
   * Jangan simpan state lokal jika state tersebut dibutuhkan oleh modul lain; letakkan di Pinia store terkait.
   * Kunci localStorage yang digunakan:
     - `needle_cap` (kapasitas jarum)
     - `needle_swap` (jarum swap)
     - `cmts` (daftar film aktif)
     - `embro_acc_map` (peta status ACC)
     - `completed_cmts` (checklist status)
     - `embro_inventory_list` (stok gudang)
     - `embro_floppy_list` (database Wilcom)
4. **Verifikasi Build:**
   Setelah melakukan perubahan, selalu jalankan perintah verifikasi berikut di terminal:
   ```powershell
   npm run build
   ```
   Pastikan tidak ada error kompilasi dan modul berhasil di-bundle.

---

## 6. Perintah Standar (Common Commands)
* **Development Server:** `npm run dev` (buka di `http://localhost:5173`)
* **Production Build:** `npm run build` (output statis di folder `dist/`)
* **Preview Production:** `npm run preview`
