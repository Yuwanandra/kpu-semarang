/**
 * Mengisi tabel `anggota_komisi` dengan data komisioner dan sekretariat
 * KPU Kota Semarang. Urutan (`urutan`) dipakai frontend untuk menyusun
 * org chart: urutan 1 = Ketua, 2-5 = Anggota Komisioner, 6 = Sekretariat.
 * Aman dijalankan berulang (upsert berdasarkan nama).
 *
 * Jalankan: `npm run db:seed:struktur`
 */
require('dotenv').config();
const { pool } = require('../src/config/db');

const anggota = [
  {
    nama: 'Ahmad Zaini',
    jabatan: 'Ketua KPU Kota Semarang',
    divisi: null,
    deskripsi:
      'Memimpin jalannya rapat pleno, mengoordinasikan seluruh tahapan pemilu, serta bertanggung jawab terhadap keputusan kolektif kolegial lembaga.',
    urutan: 1,
  },
  {
    nama: 'Henry Casandra Gultom',
    jabatan: 'Anggota Komisioner',
    divisi: 'Keuangan, Umum, Rumah Tangga, dan Logistik',
    deskripsi: null,
    urutan: 2,
  },
  {
    nama: 'Agus Supriyono',
    jabatan: 'Anggota Komisioner',
    divisi: 'Teknis Penyelenggaraan',
    deskripsi:
      'Bertanggung jawab atas mekanisme pencalonan, pemungutan, hingga penghitungan suara.',
    urutan: 3,
  },
  {
    nama: 'Novi Maria Ulfah',
    jabatan: 'Anggota Komisioner',
    divisi: 'Sosialisasi, Pendidikan Pemilih, Partisipasi Masyarakat (Sosdiklih Parmas), dan SDM',
    deskripsi: null,
    urutan: 4,
  },
  {
    nama: 'M. A. Agung Nugroho',
    jabatan: 'Anggota Komisioner',
    divisi: 'Data dan Informasi',
    deskripsi: 'Membidangi pemutakhiran daftar pemilih dan sistem informasi pemilu.',
    urutan: 5,
  },
  {
    nama: 'Tobirin',
    jabatan: 'Sekretaris KPU Kota Semarang',
    divisi: 'Sekretariat',
    deskripsi:
      'Mendukung kinerja komisioner dalam urusan administrasi dan operasional kesekretariatan.',
    urutan: 6,
  },
];

async function seedStruktur() {
  for (const a of anggota) {
    await pool.query(
      `INSERT INTO anggota_komisi (nama, jabatan, divisi, deskripsi, urutan)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT DO NOTHING`,
      [a.nama, a.jabatan, a.divisi, a.deskripsi, a.urutan]
    );
  }
  // Hapus duplikasi jika script pernah dijalankan tanpa constraint unik pada nama,
  // lalu pastikan data terbaru (jabatan/divisi/deskripsi) selalu sinkron dengan atas.
  for (const a of anggota) {
    await pool.query(
      `UPDATE anggota_komisi SET jabatan=$2, divisi=$3, deskripsi=$4, urutan=$5 WHERE nama=$1`,
      [a.nama, a.jabatan, a.divisi, a.deskripsi, a.urutan]
    );
  }

  // eslint-disable-next-line no-console
  console.log(`Seed struktur organisasi selesai: ${anggota.length} orang.`);
  await pool.end();
}

seedStruktur().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
