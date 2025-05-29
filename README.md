# Aplikasi Pengetesan Mubaligh - Frontend (Guru Penguji)

Selamat datang di repositori frontend untuk Aplikasi Pengetesan Mubaligh. Sistem ini adalah antarmuka yang digunakan oleh guru penguji dalam proses pengetesan calon mubaligh.

Aplikasi ini dibangun menggunakan **React (dengan Vite)**, **TypeScript**, dan library komponen **HeroUI**. Aplikasi ini juga merupakan sebuah **Progressive Web App (PWA)** untuk fungsionalitas offline dan pengalaman pengguna yang lebih baik.

Frontend ini berinteraksi dengan backend yang menyediakan REST API untuk pengelolaan data dan proses tes.

## 📚 Sekilas Tentang Sistem Pengetesan Mubaligh

Sistem pengetesan mubaligh secara keseluruhan dirancang untuk mengelola proses pengetesan calon mubaligh yang terdiri dari dua tahap utama:

1.  **Tahap 1:** Pondok Pesantren Wali Barokah, Kediri.
2.  **Tahap 2:** Pondok Pesantren Al Ubaidah, Kertosono.

Setiap tahapan memiliki kriteria dan proses penilaiannya masing-masing yang dikelola melalui sistem ini.

## ✨ Fitur Utama (Frontend Guru)

* **Autentikasi Guru:** Login aman untuk para guru penguji.
* **Dashboard & Statistik:** Menampilkan ringkasan dan statistik hasil tes.
* **Manajemen Penilaian Peserta:**
    * Melihat daftar peserta tes untuk Pondok Pesantren Wali Barokah (Kediri).
    * Melihat daftar peserta tes untuk Pondok Pesantren Al Ubaidah (Kertosono).
    * Input nilai akademik dan akhlak untuk peserta di Kediri.
    * Input nilai bacaan dan catatan ketertiban untuk peserta di Kertosono.
    * Verifikasi data peserta Kertosono.
* **Pencarian & Filter Peserta:** Memudahkan pencarian peserta berdasarkan nama, cocard, gender, atau kelompok.
* **Antarmuka Responsif & PWA:** Dapat diakses dengan baik di berbagai perangkat dan mendukung fungsionalitas offline.
* **Integrasi RFID:** Memungkinkan input peserta menggunakan RFID scanner untuk mempercepat proses.
* **Manajemen Akun Guru:** Guru dapat memperbarui username, password, foto profil, dan RFID.

## 🛠️ Teknologi yang Digunakan

* **React:** Library JavaScript untuk membangun antarmuka pengguna.
* **Vite:** Build tool modern yang sangat cepat untuk pengembangan frontend.
* **TypeScript:** Superset JavaScript yang menambahkan pengetikan statis.
* **HeroUI:** Library komponen UI untuk React.
* **Tailwind CSS:** Framework CSS utility-first untuk desain yang cepat.
* **Tailwind Variants:** Untuk styling komponen yang lebih terstruktur.
* **Framer Motion:** Library untuk animasi yang kaya.
* **Jotai:** Manajemen state global yang minimalis untuk React.
* **Axios:** Library HTTP client berbasis Promise untuk request API.
* **React Router DOM:** Untuk routing di sisi client.
* **Recharts:** Library charting untuk visualisasi data.
* **Formik & Yup:** Untuk manajemen form dan validasi skema.
* **VitePWA:** Plugin untuk Vite yang memudahkan pembuatan Progressive Web App.
* **FilePond:** Library untuk upload file dengan berbagai plugin (crop, preview, exif).
* **Lucide React:** Library ikon SVG yang ringan.

## 🔧 Instalasi & Setup (Lokal)

Untuk menjalankan aplikasi frontend ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone Repositori:**
    ```bash
    git clone [https://github.com/annasabdurrahman354/tes-mubaligh-frontend.git](https://github.com/annasabdurrahman354/tes-mubaligh-frontend.git)
    cd tes-mubaligh-frontend
    ```

2.  **Install Dependencies:**
    Anda dapat menggunakan `npm`, `yarn`, `pnpm`, atau `bun`. Contoh menggunakan `npm`:
    ```bash
    npm install
    ```
    *(Lihat `package.json` untuk daftar lengkap dependensi)*

3.  **Konfigurasi Environment Variables (jika ada):**
    Buat file `.env.local` di root proyek jika ada konfigurasi environment yang perlu disesuaikan (misalnya, URL API backend).
    ```env
    VITE_API_BASE_URL=http://localhost:8000/api
    ```
    *Pastikan `VITE_API_BASE_URL` mengarah ke URL backend yang sesuai.*

4.  **Jalankan Development Server:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173` (atau port lain jika 5173 sudah digunakan).

5.  **Build untuk Produksi:**
    ```bash
    npm run build
    ```
    Hasil build akan tersedia di direktori `dist`.

## 📂 Struktur Proyek (Frontend)

Struktur direktori utama pada proyek frontend ini meliputi:

* **`public/`**: Berisi aset statis seperti `favicon.ico`, `logo.png`, dan file manifest PWA.
* **`src/`**:
    * **`App.tsx`**: Komponen utama aplikasi yang mengatur routing.
    * **`main.tsx`**: Titik masuk aplikasi yang me-render komponen App.
    * **`atoms/`**: Berisi definisi atom Jotai untuk state management global (misalnya, `authAtom.ts`, `pesertaAtom.ts`).
    * **`components/`**: Berisi komponen UI yang dapat digunakan kembali di berbagai bagian aplikasi (misalnya, `AnimatedPesertaCard.tsx`, `HomeBottombar.tsx`).
    * **`config/`**: Berisi konfigurasi situs seperti item navigasi.
    * **`hooks/`**: Berisi custom hooks React untuk logika bisnis atau fungsionalitas spesifik (misalnya, `useAuth.ts`, `usePeserta.ts`).
    * **`layouts/`**: Berisi komponen layout untuk halaman-halaman tertentu (misalnya, `HomeLayout.tsx`, `AuthLayout.tsx`).
    * **`libs/`**: Berisi modul utilitas dan konfigurasi library (misalnya, `axios.ts`, `rfid-scanner.ts`).
    * **`pages/`**: Berisi komponen halaman yang mewakili rute-rute dalam aplikasi.
        * **`auth/`**: Halaman terkait autentikasi (misalnya, `login.tsx`).
        * **`home/`**: Halaman utama setelah login (misalnya, `index.tsx`, `akun.tsx`, `statistik.tsx`).
        * **`peserta-kediri/`**: Halaman terkait peserta dan penilaian tahap Kediri.
        * **`peserta-kertosono/`**: Halaman terkait peserta, penilaian, dan verifikasi tahap Kertosono.
    * **`provider.tsx`**: Menyediakan konteks global untuk aplikasi, termasuk HeroUIProvider dan ToastProvider.
    * **`styles/`**: Berisi file CSS global.
    * **`types/`**: Berisi definisi tipe TypeScript yang digunakan di seluruh aplikasi.
* **`.eslintrc.json`**: Konfigurasi ESLint untuk linting kode.
* **`index.html`**: File HTML utama sebagai titik masuk PWA.
* **`postcss.config.js`**: Konfigurasi PostCSS.
* **`tailwind.config.js`**: Konfigurasi Tailwind CSS.
* **`tsconfig.json`**: Konfigurasi TypeScript untuk proyek.
* **`vite.config.ts`**: Konfigurasi Vite, termasuk pengaturan PWA.
* **`vercel.json`**: Konfigurasi untuk deployment di Vercel.

## 🔗 Kaitan dengan Backend

Aplikasi frontend ini dirancang untuk bekerja dengan [Aplikasi Pengetesan Mubaligh - Backend](https://github.com/annasabdurrahman354/tes-mubaligh-backend). Backend tersebut menyediakan:

* **Admin Panel (Filament PHP):** Untuk manajemen data master, pengguna, peserta, periode tes, dll.
* **REST API:** Digunakan oleh frontend ini untuk:
    * Autentikasi guru.
    * Mengambil data peserta tes Kediri & Kertosono.
    * Mengirim data penilaian akademik & akhlak.
    * Mengambil data untuk statistik.
    * Mengambil opsi-opsi (seperti daftar periode, kelompok, dll.).
    * Memperbarui data peserta (verifikasi).

Pastikan backend sudah terinstal dan berjalan sebelum menjalankan aplikasi frontend ini. URL API backend dikonfigurasi dalam file `src/libs/axios.ts` atau melalui environment variable `VITE_API_BASE_URL`.

## 🚀 PWA (Progressive Web App)

Aplikasi ini dikonfigurasi sebagai PWA menggunakan `vite-plugin-pwa`. Ini memungkinkan:

* **Instalasi di Perangkat:** Pengguna dapat menginstal aplikasi ke perangkat mereka untuk akses yang lebih mudah.
* **Kemampuan Offline:** Melalui service worker, aset-aset penting di-cache sehingga aplikasi dapat diakses bahkan tanpa koneksi internet (tergantung strategi caching yang diimplementasikan).
* **Pengalaman Pengguna yang Lebih Baik:** Memuat lebih cepat dan terasa lebih seperti aplikasi native.

Konfigurasi PWA, termasuk manifest dan strategi service worker, dapat ditemukan di `vite.config.ts`.
