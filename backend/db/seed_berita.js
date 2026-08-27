/**
 * Mengisi tabel `berita` dengan data kurasi nyata dari data_kpu_semarang.xlsx
 * (Berita, Pengumuman, Siaran Pers). Setiap item menyimpan `sumber` dan
 * `tautan_eksternal` — di frontend, kartu berita ini akan langsung mengarah
 * (buka tab baru) ke halaman aslinya, bukan ke halaman detail internal.
 *
 * Jalankan: `npm run db:seed:berita`
 * Aman dijalankan berulang kali — item dengan judul yang sama tidak diduplikasi.
 */
require('dotenv').config();
const { pool } = require('../src/config/db');

const BULAN = {
  januari: '01', februari: '02', maret: '03', april: '04',
  mei: '05', juni: '06', juli: '07', agustus: '08',
  september: '09', oktober: '10', november: '11', desember: '12',
};

function parseTanggalIndo(str) {
  // "19 Agustus 2026" -> "2026-08-19"
  const [d, bulanNama, y] = str.trim().split(/\s+/);
  const m = BULAN[bulanNama.toLowerCase()];
  return `${y}-${m}-${d.padStart(2, '0')}`;
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 200);
}

const items = [
  {
    kategori: 'berita',
    judul: 'Pendidikan Politik Inklusif untuk Memperkuat Partisipasi Pemilih Penyandang Disabilitas di Kota Semarang',
    tanggal: '19 Agustus 2026',
    sumber: 'Kesbangpol Pemkot Semarang (kesbangpol.semarangkota.go.id)',
    tautan: 'https://kesbangpol.semarangkota.go.id/pendidikan-politik-inklusif-untuk-memperkuat-partisipasi-pemilih-penyandang-disabilitas-di-kota-semarang/',
    ringkasan: 'Kesbangpol Kota Semarang berkolaborasi dengan KPU Kota Semarang menggelar pendidikan politik inklusif bagi pemilih penyandang disabilitas guna menjamin keterlibatan penuh dalam tahapan demokrasi.',
  },
  {
    kategori: 'berita',
    judul: 'Intensifikasi Pemutakhiran Data Pemilih Berkelanjutan (PDPB) 2026 dan Edukasi Publik via Podcast',
    tanggal: '05 Agustus 2026',
    sumber: 'Disway Jateng & Media Partner Pemkot',
    tautan: 'https://semarangkota.go.id/berita/pdpb-2026-kpu-semarang',
    ringkasan: 'KPU Kota Semarang menggencarkan pemutakhiran data pemilih berkelanjutan serta sosialisasi interaktif melalui program Live Podcast Lumpia setiap pekan.',
  },
  {
    kategori: 'berita',
    judul: 'Evaluasi & Sosialisasi Partisipasi Pemilih Tingkat Kelurahan se-Kota Semarang',
    tanggal: '22 Juli 2026',
    sumber: 'Portal Berita Resmi Pemkot Semarang',
    tautan: 'https://berita.semarangkota.go.id/evaluasi-partisipasi-pemilih-kpu',
    ringkasan: 'KPU Kota Semarang menyelenggarakan kegiatan evaluasi bersama lurah dan camat di 16 kecamatan untuk memetakan wilayah potensi partisipasi pemilih.',
  },
  {
    kategori: 'pengumuman',
    judul: 'Hasil Rekapitulasi Daftar Pemilih Berkelanjutan (DPB) Triwulan II Tahun 2026 Kota Semarang',
    tanggal: '07 Juli 2026',
    sumber: 'Kesbangpol Pemkot Semarang',
    tautan: 'https://kesbangpol.semarangkota.go.id/rekapitulasi-daftar-pemilih-berkelanjutan-triwulan-ii-tahun-2026-kota-semarang/',
    ringkasan: 'Pengumuman resmi penetapan hasil rekapitulasi Daftar Pemilih Berkelanjutan Triwulan II Tahun 2026 oleh KPU Kota Semarang untuk sinkronisasi data kependudukan.',
  },
  {
    kategori: 'pengumuman',
    judul: 'Pengumuman Pendaftaran Kelompok Penyelenggara Pemungutan Suara (KPPS) & Badan Adhoc',
    tanggal: '12 September 2024',
    sumber: 'Kelurahan Pakintelan / Portal Pemkot Semarang',
    tautan: 'https://pakintelan.semarangkota.go.id/berita/pendaftaran-kelompok-penyelenggara-pemungutan-suara-kpps-untuk-pilkada-serentak-2024-di-kota-semaran',
    ringkasan: 'Pengumuman syarat, berkas administrasi, serta tata cara pendaftaran calon anggota KPPS dan petugas Adhoc di seluruh wilayah Kota Semarang.',
  },
  {
    kategori: 'pengumuman',
    judul: 'Pengumuman Pendaftaran dan Pembekalan Lembaga Pemantau Pemilu Independen',
    tanggal: '14 Mei 2026',
    sumber: 'JDIH & Web Resmi Pemkot Semarang',
    tautan: 'https://semarangkota.go.id/pengumuman/pemantau-pemilu-2026',
    ringkasan: 'KPU Kota Semarang membuka kesempatan bagi lembaga/organisasi masyarakat sipil untuk mendaftar sebagai pemantau pemilu terakreditasi.',
  },
  {
    kategori: 'siaran_pers',
    judul: 'Rapat Koordinasi Sinergitas Fasilitasi Penyelenggaraan Pemilu dan Pemilihan Kota Semarang',
    tanggal: '07 Juli 2026',
    sumber: 'Dinas Kominfo & Kesbangpol Kota Semarang',
    tautan: 'https://kesbangpol.semarangkota.go.id/poldagri/',
    ringkasan: 'Siaran pers bersama mengenai penetapan dukungan logistik, pengamanan, serta koordinasi lintas instansi antara KPU, Bawaslu, Pemkot, dan Polrestabes Semarang.',
  },
  {
    kategori: 'siaran_pers',
    judul: 'Penetapan Pasangan Calon & Penetapan Kepala Daerah Terpilih Kota Semarang',
    tanggal: '09 Februari 2025',
    sumber: 'JDIH DPRD & Pemkot Semarang',
    tautan: 'https://jdihdprd.semarangkota.go.id/blog/Kepala-Daerah-Terpilih-Tahun-2024-30323',
    ringkasan: 'Rilis pers resmi pelaksanaan Sidang Pleno KPU Kota Semarang terkait penetapan pasangan calon terpilih dan penyerahan berkas penetapan ke DPRD Kota Semarang.',
  },
  {
    kategori: 'siaran_pers',
    judul: 'Laporan Pertanggungjawaban & Pengembalian Sisa Dana Hibah Pemilihan ke Kas Daerah',
    tanggal: '18 Maret 2025',
    sumber: 'Diskominfo / Tribunnews / KPU Kota Semarang',
    tautan: 'https://semarangkota.go.id/siaran-pers/laporan-hibah-kpu',
    ringkasan: 'Rilis transparansi anggaran KPU Kota Semarang terkait penyelesaian laporan keuangan dan pengembalian sisa penggunaan dana hibah Pilkada kepada Pemkot Semarang.',
  },
];

async function seedBerita() {
  for (const item of items) {
    const slug = slugify(item.judul);
    const tanggalIso = parseTanggalIndo(item.tanggal);
    // Konten internal tetap diisi (untuk fallback jika suatu saat tautan
    // eksternal diputus), berisi ringkasan + atribusi sumber.
    const konten = `<p>${item.ringkasan}</p><p><em>Sumber asli: ${item.sumber}.</em></p>`;

    await pool.query(
      `INSERT INTO berita (slug, judul, ringkasan, konten, kategori, sumber, tautan_eksternal, status, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'terbit',$8,$8)
       ON CONFLICT (slug) DO UPDATE SET
         ringkasan = EXCLUDED.ringkasan,
         konten = EXCLUDED.konten,
         sumber = EXCLUDED.sumber,
         tautan_eksternal = EXCLUDED.tautan_eksternal,
         updated_at = now()`,
      [slug, item.judul, item.ringkasan, konten, item.kategori, item.sumber, item.tautan, tanggalIso]
    );
  }

  // eslint-disable-next-line no-console
  console.log(`Seed berita selesai: ${items.length} item dimasukkan/diperbarui.`);
  await pool.end();
}

seedBerita().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
