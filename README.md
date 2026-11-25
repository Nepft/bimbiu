<p align="center">
  <img src="public/bimbiu-logo.svg" alt="Logo Bimbiu" width="500" />
</p>

**Bimbiu** adalah aplikasi web kuis pengetahuan umum interaktif untuk anak usia **10-12 tahun**. Bimbiu dirancang untuk membuat proses belajar terasa menyenangkan melalui perjalanan materi terstruktur, 5 tipe soal interaktif, feedback dan pembahasan langsung, serta penghargaan sederhana berupa XP, level, dan koleksi badge.

---

## Fitur Utama

### 1. Katalog Pengetahuan Umum Lengkap (120 Pelajaran · 1.200 Soal)

Seluruh materi pembelajaran dikelola sebagai _static content_ di direktori server-only (`server/content/`) dan divalidasi dengan schema Zod:

| Kategori                | Cakupan Materi                                                                   | Jumlah Unit & Pelajaran |
| ----------------------- | -------------------------------------------------------------------------------- | ----------------------- |
| **Science & Nature**    | Tata surya, makhluk hidup & ekosistem, bumi & cuaca, materi & energi             | 4 unit · 20 pelajaran   |
| **World & Geography**   | Benua & samudra, kepulauan Indonesia, keajaiban dunia, peta & arah               | 4 unit · 20 pelajaran   |
| **History & Culture**   | Kerajaan Nusantara, perjuangan kemerdekaan, budaya & rumah adat, peradaban dunia | 4 unit · 20 pelajaran   |
| **Logic & Mathematics** | Pola bilangan, teka-teki operasi hitung, bangun datar & ruang, logika & waktu    | 4 unit · 20 pelajaran   |
| **Language & Words**    | Kosakata, sinonim-antonim & imbuhan, peribahasa, ejaan & membaca                 | 4 unit · 20 pelajaran   |
| **Everyday Knowledge**  | Kesehatan & gizi seimbang, keselamatan & etika, lingkungan 3R, teknologi bijak   | 4 unit · 20 pelajaran   |

### 2. Lima Tipe Soal Interaktif & 18 Ilustrasi Kuis Gambar

- **Pilihan Ganda (`multiple_choice`)**
- **Benar / Salah (`true_false`)**
- **Isian Singkat (`fill_in_the_blank`)** dengan normalisasi huruf besar/kecil dan spasi di server
- **Pilih Semua Benar (`multiple_select`)**
- **Kuis Gambar (`image_quiz`)** dilengkapi 18 ilustrasi vektor _flat-geometric_ spesifik per topik
- Dilengkapi tombol **Petunjuk (`hint`)** serta pembahasan edukatif yang muncul setelah jawaban dikirim

### 3. Penilaian Server-Authoritative & Anti-Bocoran Kunci Jawaban

- Kunci jawaban (`correctAnswer` / `acceptedAnswers`) tidak pernah dikirim ke browser sebelum learner mengirimkan jawabannya.
- Evaluasi jawaban, perhitungan skor (`0-100`), pembaruan skor terbaik (`bestScore`), status `completed` / `mastered` (`>=80%`), dan pemberian XP diproses secara atomik serta _idempotent_ di transaksi TiDB sehingga mengulangi pelajaran tidak menggandakan XP.

### 4. Gamifikasi Ramah Anak (XP, Level, & 24 Koleksi Badge)

- **XP & Level:** Learner memperoleh XP saat pertama kali menyelesaikan pelajaran tanpa pengurangan poin untuk jawaban yang belum tepat.
- **24 Koleksi Badge:** Mencakup 4 badge inti dan 20 badge tambahan (milestone jumlah pelajaran, skor sempurna 100, penguasaan materi, ketekunan mengulang, master per kategori, hingga eksplorasi lintas bidang) yang terbuka otomatis saat syarat terpenuhi.

### 5. Autentikasi Google OAuth 2.0 & Profil Learner

- Satu peran pengguna (`learner`) tanpa dashboard admin, CMS, fitur sosial, iklan, atau leaderboard publik.
- Login menggunakan **Google OAuth 2.0 + PKCE (`S256`)** dengan sesi berbasis cookie `HttpOnly` dan token ter-hash (`SHA-256` + pepper) di database TiDB.
- Halaman **Onboarding** untuk mengatur nama panggilan, memilih avatar, serta konfirmasi pendampingan orang tua/wali.
- **Avatar Fleksibel:** Learner dapat memilih 4 avatar bawaan (`Kompas`, `Atlas`, `Surya`, `Bintang`) atau mengunggah foto kustom (`JPG`, `PNG`, `WebP`, maks. 2 MB) dengan crop persegi otomatis yang langsung tersinkronisasi hingga mini avatar pada header.

### 6. Keamanan & Privasi

- Prinsip minimisasi data anak dan halaman khusus **Privasi & Keamanan** (`/privacy`).
- Perlindungan CSRF same-origin pada endpoint mutasi (`POST`/`PATCH`).
- HTTP security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`).
- Rate limiting per IP untuk endpoint autentikasi, profil, dan kuis.

---

## Tech Stack

| Layer                 | Teknologi                                                     |
| --------------------- | ------------------------------------------------------------- |
| **Framework & UI**    | Nuxt 4, Vue 3, TypeScript (strict)                            |
| **Backend & API**     | Nuxt Nitro Server (`server/api/`, `server/middleware/`)       |
| **Database & ORM**    | TiDB (MySQL-compatible), Drizzle ORM, `mysql2`, Drizzle Kit   |
| **Validasi**          | Zod                                                           |
| **Tipografi**         | Fontsource (`Bricolage Grotesque`, `Plus Jakarta Sans`)       |
| **Testing & Quality** | Vitest, ESLint (`@nuxt/eslint`), `vue-tsc` (`nuxt typecheck`) |

---

## Struktur Proyek

```text
bimbiu/
├── app/
│   ├── assets/css/          # Design tokens (tokens.css) & base styles (base.css)
│   ├── components/          # Komponen UI, layout, learning, quiz, dan rewards
│   ├── composables/         # useAuth, useSmartHeader
│   ├── layouts/             # default, learner, quiz-focus
│   ├── middleware/          # auth.global.ts (proteksi rute learner & onboarding)
│   └── pages/               # Landing, privacy, auth, beranda, katalog, kuis, hasil, progres, hadiah, profil
├── drizzle/                 # File migrasi SQL version-controlled untuk TiDB
├── public/                  # Aset publik (favicon.svg, robots.txt)
├── scripts/                 # Script validasi konten (validate-content.ts)
├── server/
│   ├── api/                 # Nitro API endpoints (auth, profile, content, quiz, progress, rewards, health)
│   ├── content/             # Static content server-only (categories, badges, 120 lesson JSON, schema)
│   ├── database/            # Drizzle client & schema 7 tabel operasional TiDB
│   ├── middleware/          # Security headers & API rate limiter
│   ├── repositories/        # Akses data TiDB & loader konten statis
│   ├── services/            # Business logic (auth, content, quiz, evaluator, progress)
│   └── utils/               # Crypto/PKCE, session cookies, CSRF, rate-limit
└── tests/
    └── unit/                # Unit tests (Vitest)
```
