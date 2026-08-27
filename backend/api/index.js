const app = require('../src/app');

// Runtime Node.js Vercel (@vercel/node) memanggil handler dengan signature
// standar (req, res) — Express app SUDAH berbentuk seperti itu secara
// langsung, jadi bisa di-export apa adanya. `serverless-http` sengaja
// dihapus: paket itu ditujukan untuk format event/callback AWS Lambda yang
// tidak cocok di sini, dan ini yang menyebabkan setiap request menggantung
// sampai batas waktu function Vercel (300 detik) tercapai.
module.exports = app;
