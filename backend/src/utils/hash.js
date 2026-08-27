const crypto = require('crypto');

/**
 * Hash IP dengan salt server-side sebelum disimpan. Ini tetap memungkinkan
 * deteksi pola (mis. IP yang sama mengirim banyak pesan) tanpa menyimpan
 * alamat IP mentah pengguna di database.
 */
function hashIp(ip) {
  const salt = process.env.COOKIE_SECRET || 'fallback-salt';
  return crypto.createHash('sha256').update(`${ip}:${salt}`).digest('hex');
}

module.exports = { hashIp };
