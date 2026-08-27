# Portal Informasi KPU Kota Semarang

Aplikasi fullstack informasi resmi KPU Kota Semarang: profil lembaga, berita &amp;
pengumuman, tahapan pemilu, layanan PPID, dan kontak — dengan panel admin
sederhana untuk mengelola berita.

- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + PostgreSQL (via [Neon](https://neon.tech))
- **Hosting**: [Vercel](https://vercel.com) (frontend & backend sebagai dua proyek terpisah)
- **Keamanan**: lihat bagian [Ringkasan Keamanan](#ringkasan-keamanan) di bawah

```
kpu-semarang/
├── frontend/     React + Vite + Tailwind + Framer Motion
└── backend/      Express API + PostgreSQL (Neon) + keamanan
```

---

## 1. Menjalankan secara lokal

### 1.1 Database (Neon)
1. Buat akun gratis di https://neon.tech, buat project baru (region terdekat, mis. Singapore).
2. Salin **connection string** (pilih "Pooled connection") dari dashboard Neon.
3. Jalankan skema:
   ```bash
   cd backend
   cp .env.example .env
   # isi DATABASE_URL di .env dengan connection string dari Neon
   npm install
   npm run db:migrate
   npm run db:seed   # isi SEED_ADMIN_USERNAME & SEED_ADMIN_PASSWORD di .env dulu
   ```

### 1.2 Backend
```bash
cd backend
npm install
npm run dev      # jalan di http://localhost:4000
```

### 1.3 Frontend
```bash
cd frontend
npm install
npm run dev       # jalan di http://localhost:5173, proxy otomatis ke backend
```

Buka `http://localhost:5173`. Untuk masuk sebagai admin, buka
`http://localhost:5173/admin/login` dan gunakan akun yang dibuat lewat `npm run db:seed`.

---

## 2. Deploy ke Neon + Vercel

### 2.1 Database — Neon (production)
Gunakan project Neon yang sama seperti di atas, atau buat branch/project baru
khusus produksi. Jalankan `npm run db:migrate` dan `npm run db:seed` sekali
dengan `DATABASE_URL` production di file `.env` lokal Anda (skema dan seed
tidak perlu dijalankan ulang di Vercel).

### 2.2 Rate limiting terdistribusi — Upstash Redis (wajib untuk anti-DDoS di serverless)
Vercel menjalankan backend sebagai *serverless functions*: setiap invocation
bisa berjalan di instance berbeda, sehingga rate-limit in-memory tidak
efektif. Buat database Redis gratis di https://upstash.com, lalu salin
`UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN`.

### 2.3 Backend → Vercel
1. Push folder `backend/` sebagai repo Git (atau seluruh monorepo, lalu atur *Root Directory* = `backend` saat impor ke Vercel).
2. Di Vercel dashboard → **New Project** → pilih repo → Root Directory: `backend`.
3. Tambahkan Environment Variables (sesuai `.env.example`):
   - `DATABASE_URL` (Neon)
   - `JWT_SECRET`, `COOKIE_SECRET` (generate acak: `openssl rand -hex 64`)
   - `CORS_ORIGINS` = URL frontend Vercel Anda (isi setelah langkah 2.4)
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
   - `NODE_ENV=production`
4. Deploy. Catat URL backend, mis. `https://kpu-semarang-api.vercel.app`.

### 2.4 Frontend → Vercel
1. Buat proyek Vercel baru, Root Directory: `frontend`.
2. Environment Variable: `VITE_API_URL=https://kpu-semarang-api.vercel.app/api`.
3. Deploy. Catat URL frontend, mis. `https://kpu-semarang.vercel.app`.
4. **Kembali ke proyek backend** → update `CORS_ORIGINS` dengan URL frontend ini → redeploy backend agar CORS allowlist sinkron.

### 2.5 (Opsional) Domain kustom & Cloudflare
Untuk mitigasi DDoS lapisan jaringan yang lebih kuat (di luar app-level rate
limiting yang sudah ada), arahkan domain kustom Anda melalui Cloudflare
(proxy oranye aktif) sebelum ke Vercel, dan aktifkan "Under Attack Mode" saat
dibutuhkan. Vercel sendiri juga menyediakan mitigasi DDoS bawaan di edge
network-nya untuk seluruh proyek.

---

## 3. Ringkasan Keamanan

| Ancaman | Mitigasi yang diterapkan |
|---|---|
| **Spoofing origin / CSRF** | Allowlist CORS ketat (`CORS_ORIGINS`), verifikasi manual header Origin/Referer pada request pengubah data, token CSRF pola *double-submit cookie* (`X-CSRF-Token`) |
| **Pencurian sesi (XSS/token theft)** | Sesi admin memakai JWT di cookie `httpOnly` + `Secure` + `SameSite=Strict` (bukan localStorage) |
| **Brute-force / credential stuffing** | Rate limiter khusus login (5x/15 menit per IP), waktu respons bcrypt konstan, log percobaan login (`login_attempts`) |
| **DDoS / flood request** | Rate limiter terdistribusi (Upstash Redis) di semua endpoint API, `express-slow-down` progresif pada form kontak, batas ukuran body (`200kb`), Vercel edge network |
| **SQL Injection** | Seluruh query memakai parameterized query (`pg`), tidak ada string concatenation SQL |
| **Stored XSS** | Sanitasi konten HTML (`xss()`) sebelum disimpan ke database |
| **Spam bot pada form publik** | Honeypot field tersembunyi, dukungan opsional Cloudflare Turnstile (`TURNSTILE_SECRET_KEY`) |
| **HTTP Parameter Pollution** | Middleware `hpp` |
| **Header berbahaya / clickjacking** | `helmet` (CSP, HSTS, `frame-ancestors: none`, dll.) |
| **Kebocoran detail internal** | Error handler terpusat yang menyembunyikan stack trace & pesan error DB di production |

Semua mitigasi di atas adalah lapisan *application-level*. Untuk perlindungan
DDoS jaringan yang lebih kuat, kombinasikan dengan Cloudflare atau layanan
WAF di depan domain Anda (lihat 2.5).

---

## 4. Struktur data & isi konten

Isi awal (`db/seed.js`) hanya membuat 1 akun admin dan contoh tahapan pemilu.
Data **profil komisioner**, **berita**, dan detail lain masih kosong secara
sengaja — isi melalui panel admin (`/admin`) atau tambahkan langsung lewat
SQL/endpoint API, karena konten resmi KPU Kota Semarang perlu diverifikasi
oleh pihak yang berwenang sebelum dipublikasikan.

## 5. Lisensi & penafian
Ini adalah kerangka aplikasi teknis, bukan situs resmi KPU Kota Semarang.
Sebelum digunakan sebagai kanal informasi resmi, pastikan seluruh konten,
identitas visual, dan kebijakan keamanan direview oleh KPU Kota Semarang dan
tim IT/keamanan yang berwenang.
