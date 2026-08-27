const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const { signToken, setAuthCookie, clearAuthCookie, requireAuth } = require('../middleware/auth');
const { issueCsrfToken, verifyCsrf } = require('../middleware/csrf');
const { loginRateLimiter, clientKey } = require('../middleware/rateLimiter');
const { hashIp } = require('../utils/hash');

const router = express.Router();

router.get('/csrf-token', issueCsrfToken);

router.post(
  '/login',
  loginRateLimiter,
  verifyCsrf,
  [
    body('username').trim().isLength({ min: 3, max: 64 }).escape(),
    body('password').isLength({ min: 8, max: 200 }),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Input tidak valid.' });
      }

      const { username, password } = req.body;
      const ipHash = hashIp(clientKey(req));

      const result = await query(
        'SELECT id, username, password_hash, role, is_active FROM admins WHERE username = $1',
        [username]
      );
      const admin = result.rows[0];

      // Selalu jalankan bcrypt.compare walau user tidak ditemukan, memakai
      // hash dummy, agar waktu respons konsisten (mencegah timing attack
      // yang bisa dipakai untuk menebak username valid).
      const hashToCompare = admin?.password_hash || '$2a$12$invalidsaltinvalidsaltinvalidsaltinvalidsalt';
      const passwordOk = await bcrypt.compare(password, hashToCompare);

      const success = Boolean(admin && admin.is_active && passwordOk);

      await query(
        'INSERT INTO login_attempts (username, ip_hash, success, user_agent) VALUES ($1,$2,$3,$4)',
        [username, ipHash, success, req.get('user-agent') || null]
      );

      if (!success) {
        return res.status(401).json({ error: 'Username atau password salah.' });
      }

      await query('UPDATE admins SET last_login_at = now() WHERE id = $1', [admin.id]);

      const token = signToken({ sub: admin.id, username: admin.username, role: admin.role });
      setAuthCookie(res, token);

      return res.json({ username: admin.username, role: admin.role });
    } catch (err) {
      return next(err);
    }
  }
);

router.post('/logout', requireAuth, verifyCsrf, (req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Berhasil keluar.' });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ username: req.admin.username, role: req.admin.role });
});

module.exports = router;
