-- =====================================================================
-- Skema database Portal Informasi KPU Kota Semarang
-- Jalankan di Neon SQL editor, atau: psql "$DATABASE_URL" -f db/schema.sql
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- untuk gen_random_uuid()

-- Akun admin/petugas yang boleh mengelola konten (CMS internal)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(64) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(150),
  role VARCHAR(30) NOT NULL DEFAULT 'editor' CHECK (role IN ('editor', 'superadmin')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Berita & pengumuman resmi
CREATE TABLE IF NOT EXISTS berita (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(220) UNIQUE NOT NULL,
  judul VARCHAR(250) NOT NULL,
  ringkasan VARCHAR(500),
  konten TEXT NOT NULL,
  kategori VARCHAR(50) NOT NULL DEFAULT 'berita' CHECK (kategori IN ('berita','pengumuman','siaran_pers')),
  gambar_url TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'terbit' CHECK (status IN ('draft','terbit','arsip')),
  dilihat INT NOT NULL DEFAULT 0,
  penulis_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_berita_status_created ON berita (status, created_at DESC);

-- Kolom tambahan untuk berita yang bersumber dari situs eksternal (mis. hasil
-- kurasi dari portal resmi Pemkot/Kesbangpol) — ditampilkan dengan atribusi
-- sumber dan tautan langsung ke halaman aslinya.
ALTER TABLE berita ADD COLUMN IF NOT EXISTS sumber VARCHAR(200);
ALTER TABLE berita ADD COLUMN IF NOT EXISTS tautan_eksternal TEXT;

-- Tahapan / agenda Pemilu & Pilkada
CREATE TABLE IF NOT EXISTS agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_tahapan VARCHAR(200) NOT NULL,
  deskripsi TEXT,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  urutan INT NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'akan_datang' CHECK (status IN ('selesai','berjalan','akan_datang')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_agenda_urutan ON agenda (urutan ASC);

-- Struktur organisasi / komisioner
CREATE TABLE IF NOT EXISTS anggota_komisi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(150) NOT NULL,
  jabatan VARCHAR(150) NOT NULL,
  divisi VARCHAR(150),
  deskripsi TEXT,
  foto_url TEXT,
  urutan INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE anggota_komisi ADD COLUMN IF NOT EXISTS deskripsi TEXT;

-- Pesan masuk dari form kontak / PPID
CREATE TABLE IF NOT EXISTS pesan_kontak (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  subjek VARCHAR(200) NOT NULL,
  pesan TEXT NOT NULL,
  jenis VARCHAR(30) NOT NULL DEFAULT 'umum' CHECK (jenis IN ('umum','ppid','pengaduan')),
  ip_hash TEXT, -- hash IP pengirim, bukan IP mentah, untuk mitigasi spam tanpa menyimpan PII langsung
  status VARCHAR(20) NOT NULL DEFAULT 'baru' CHECK (status IN ('baru','diproses','selesai')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pesan_created ON pesan_kontak (created_at DESC);

-- Log percobaan login admin, untuk mendeteksi brute-force / spoofing kredensial
CREATE TABLE IF NOT EXISTS login_attempts (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(64) NOT NULL,
  ip_hash TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_login_attempts_lookup ON login_attempts (username, created_at DESC);
