const crypto = require('crypto');

/**
 * Double-submit-cookie CSRF protection.
 *
 * Kenapa bukan library csurf (deprecated) dan bukan session-based CSRF:
 * backend ini stateless/serverless-friendly. Pola double-submit cocok
 * karena tidak butuh penyimpanan sesi di server:
 *   1. GET /api/csrf-token menaruh token acak di cookie (readable by JS,
 *      not httpOnly) DAN mengembalikannya di body response.
 *   2. Frontend menyalin token itu ke header `X-CSRF-Token` pada setiap
 *      request yang mengubah data (POST/PUT/PATCH/DELETE).
 *   3. Server membandingkan cookie vs header — hanya kode yang berjalan
 *      di origin yang sah yang bisa membaca cookie itu lewat JS (karena
 *      SameSite + CORS) sehingga request palsu dari situs lain akan gagal
 *      mencocokkan token, walau mereka bisa memicu request via <form>.
 */
function issueCsrfToken(req, res) {
  const token = crypto.randomBytes(32).toString('hex');
  res.cookie('kpu_csrf', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 2 * 60 * 60 * 1000,
    path: '/',
  });
  return res.json({ csrfToken: token });
}

function verifyCsrf(req, res, next) {
  const unsafeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!unsafeMethods.includes(req.method)) return next();

  const cookieToken = req.cookies?.kpu_csrf;
  const headerToken = req.get('x-csrf-token');

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: 'Token CSRF tidak valid atau tidak ada.' });
  }
  return next();
}

module.exports = { issueCsrfToken, verifyCsrf };
