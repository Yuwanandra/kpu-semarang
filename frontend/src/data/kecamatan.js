/**
 * Data 16 kecamatan Kota Semarang.
 *
 * Populasi: estimasi berdasarkan data BPS Jawa Tengah / Pemprov Jateng
 * (kombinasi angka 2023 dan proyeksi 2024) — dibulatkan, bisa berbeda
 * sedikit dari publikasi BPS Kota Semarang terbaru. Perbarui berkala.
 *
 * x, y: posisi persentase TITIK KLIK pada gambar peta administrasi asli
 * (public/peta-semarang.png) — diperkirakan mengikuti letak label nama
 * kecamatan pada peta tersebut, bukan koordinat geografis presisi (lat/lon).
 */
const kecamatan = [
  {
    id: 'tugu',
    nama: 'Tugu',
    populasi: 34092,
    x: 26,
    y: 19,
    keunikan: 'Kawasan industri besar (Kawasan Industri Wijayakusuma) dan lokasi Bandara Ahmad Yani; kecamatan dengan penduduk paling sedikit di Kota Semarang.',
  },
  {
    id: 'semarang-barat',
    nama: 'Semarang Barat',
    populasi: 149327,
    x: 55,
    y: 26,
    keunikan: 'Permukiman padat di sisi barat kota, dilalui jalur utama menuju bandara dan tol Semarang.',
  },
  {
    id: 'semarang-utara',
    nama: 'Semarang Utara',
    populasi: 117865,
    x: 63,
    y: 18,
    keunikan: 'Kawasan pesisir dengan Pelabuhan Tanjung Emas; rawan rob namun menjadi simpul logistik utama Jawa Tengah.',
  },
  {
    id: 'semarang-tengah',
    nama: 'Semarang Tengah',
    populasi: 55208,
    x: 64,
    y: 26,
    keunikan: 'Pusat kota dengan kawasan Kota Lama dan Simpang Lima; kecamatan dengan luas wilayah terkecil.',
  },
  {
    id: 'semarang-timur',
    nama: 'Semarang Timur',
    populasi: 66481,
    x: 72,
    y: 21,
    keunikan: 'Kepadatan penduduk tertinggi per km² di Kota Semarang, area campuran permukiman dan perdagangan.',
  },
  {
    id: 'genuk',
    nama: 'Genuk',
    populasi: 137356,
    x: 91,
    y: 17,
    keunikan: 'Kawasan industri di pesisir timur, berbatasan dengan Kabupaten Demak, sebagian rawan banjir rob.',
  },
  {
    id: 'gayamsari',
    nama: 'Gayamsari',
    populasi: 70409,
    x: 72,
    y: 27,
    keunikan: 'Wilayah kecil padat penduduk di antara Semarang Timur dan Genuk, banyak industri rumahan.',
  },
  {
    id: 'gajahmungkur',
    nama: 'Gajahmungkur',
    populasi: 56334,
    x: 55,
    y: 40,
    keunikan: 'Berbukit-bukit dengan kawasan permukiman menengah-atas serta beberapa rumah sakit besar.',
  },
  {
    id: 'candisari',
    nama: 'Candisari',
    populasi: 75614,
    x: 66,
    y: 42,
    keunikan: 'Perbukitan dekat Gombel, dikenal dengan jalur kuliner dan pemandangan kota dari ketinggian.',
  },
  {
    id: 'semarang-selatan',
    nama: 'Semarang Selatan',
    populasi: 62179,
    x: 59,
    y: 36,
    keunikan: 'Berdekatan dengan pusat bisnis Simpang Lima, kawasan pendidikan dan perkantoran.',
  },
  {
    id: 'ngaliyan',
    nama: 'Ngaliyan',
    populasi: 146628,
    x: 18,
    y: 33,
    keunikan: 'Berkembang pesat sebagai kawasan permukiman baru, dekat kampus UIN Walisongo.',
  },
  {
    id: 'pedurungan',
    nama: 'Pedurungan',
    populasi: 197468,
    x: 85,
    y: 34,
    keunikan: 'Kecamatan terpadat kedua, berkembang cepat sebagai kawasan perumahan modern di timur kota.',
  },
  {
    id: 'gunungpati',
    nama: 'Gunungpati',
    populasi: 101577,
    x: 46,
    y: 69,
    keunikan: 'Kecamatan terluas, berbukit dan agraris, rumah bagi kampus UNNES serta Waduk Jatibarang.',
  },
  {
    id: 'banyumanik',
    nama: 'Banyumanik',
    populasi: 143746,
    x: 67,
    y: 70,
    keunikan: 'Jalur utama Semarang–Solo/Ungaran, kawasan perumahan berkontur perbukitan.',
  },
  {
    id: 'tembalang',
    nama: 'Tembalang',
    populasi: 201821,
    x: 80,
    y: 61,
    keunikan: 'Kecamatan berpenduduk terbanyak, dikenal sebagai kawasan pendidikan tinggi karena keberadaan Universitas Diponegoro (Undip).',
  },
  {
    id: 'mijen',
    nama: 'Mijen',
    populasi: 93088,
    x: 23,
    y: 62,
    keunikan: 'Kawasan agropolitan dan pengembangan kota baru di ujung barat daya, berbatasan dengan Kabupaten Kendal.',
  },
];

export default kecamatan;
