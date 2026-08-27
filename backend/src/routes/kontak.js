const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const { contactSlowDown, clientKey } = require('../middleware/rateLimiter');
const { verifyCsrf } = require('../middleware/csrf');
const { hashIp } = require('../utils/hash');

const router = express.Router();

async function verifyTurnstile(token, ip) {
  if (!process.env.TURNSTILE_SECRET_KEY) return true; // fitur opsional
  if (!token) return false;

  const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
  });
  const data = await resp.json();
  return Boolean(data.success);
}

router.post(
  '/',
  contactSlowDown,
  verifyCsrf,
  [
    body('nama').trim().isLength({ min: 2, max: 150 }).escape(),
    body('email').trim().isEmail().normalizeEmail(),
    body('subjek').trim().isLength({ min: 3, max: 200 }).escape(),
    body('pesan').trim().isLength({ min: 10, max: 5000 }).escape(),
    body('jenis').optional().isIn(['umum', 'ppid', 'pengaduan']),
    // Honeypot: field tersembunyi di form yang hanya akan terisi oleh bot.
    body('website').optional().isEmpty(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty() || req.body.website) {
        // Jika honeypot terisi, balas sukses palsu agar bot tidak tahu ia terdeteksi.
        if (req.body.website) return res.status(200).json({ message: 'Pesan terkirim.' });
        return res.status(400).json({ error: 'Input tidak valid.', details: errors.array() });
      }

      const ip = clientKey(req);
      const turnstileOk = await verifyTurnstile(req.body.turnstileToken, ip);
      if (!turnstileOk) {
        return res.status(400).json({ error: 'Verifikasi anti-bot gagal. Silakan coba lagi.' });
      }

      await query(
        `INSERT INTO pesan_kontak (nama, email, subjek, pesan, jenis, ip_hash)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [req.body.nama, req.body.email, req.body.subjek, req.body.pesan, req.body.jenis || 'umum', hashIp(ip)]
      );

      res.status(201).json({ message: 'Pesan berhasil terkirim. Terima kasih.' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
