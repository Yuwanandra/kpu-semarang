/**
 * Mengisi data awal: 1 akun admin (password di-hash dengan bcrypt) + contoh
 * agenda tahapan pemilu supaya frontend punya sesuatu untuk ditampilkan.
 * Jalankan sekali: `npm run db:seed`
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/db');

async function seed() {
  const username = process.env.SEED_ADMIN_USERNAME || 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password || password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD wajib diisi di .env dan minimal 12 karakter.');
  }

  const hash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO admins (username, password_hash, full_name, role)
     VALUES ($1, $2, $3, 'superadmin')
     ON CONFLICT (username) DO NOTHING`,
    [username, hash, 'Administrator Portal']
  );

  const agenda = [
    ['Pemutakhiran Data Pemilih', 'Penyusunan dan verifikasi daftar pemilih tetap.', '2027-01-10', '2027-02-20', 1, 'selesai'],
    ['Pendaftaran Pasangan Calon', 'Pendaftaran bakal pasangan calon ke KPU Kota Semarang.', '2027-03-01', '2027-03-15', 2, 'berjalan'],
    ['Kampanye', 'Masa kampanye seluruh peserta pemilu.', '2027-04-01', '2027-05-20', 3, 'akan_datang'],
    ['Pemungutan Suara', 'Hari pemungutan dan penghitungan suara di TPS.', '2027-06-01', '2027-06-01', 4, 'akan_datang'],
  ];

  for (const row of agenda) {
    await pool.query(
      `INSERT INTO agenda (nama_tahapan, deskripsi, tanggal_mulai, tanggal_selesai, urutan, status)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT DO NOTHING`,
      row
    );
  }

  // eslint-disable-next-line no-console
  console.log(`Seed selesai. Akun admin: ${username}`);
  await pool.end();
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
