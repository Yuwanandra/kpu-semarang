const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const crypto = require('crypto');

/**
 * Helmet: mengatur security headers (CSP, HSTS, X-Frame-Options, dst).
 * Ini mencegah clickjacking, MIME-sniffing, dan sebagian XSS.
 */
const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"], // setara X-Frame-Options: DENY
      upgradeInsecureRequests: [],
    },
  },
  crossOriginResourcePolicy: { policy: 'same-site' },
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
});

/**
 * CORS allowlist ketat berdasarkan domain frontend yang sah.
 * Ini adalah lapisan utama anti-spoofing di sisi browser: request dari
 * origin yang tidak terdaftar akan ditolak sebelum mencapai controller.
 */
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsMiddleware = cors({
  origin(origin, callback) {
    // Request tanpa header Origin (misal dari curl/server-to-server) ditolak
    // untuk endpoint yang butuh kredensial; izinkan hanya jika origin cocok.
    if (!origin) return callback(null, false);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin tidak diizinkan oleh CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  maxAge: 600,
});

/**
 * Verifikasi tambahan Origin/Referer untuk method yang mengubah data
 * (defense-in-depth di luar CORS, karena CORS bisa saja dilewati oleh
 * klien non-browser yang memalsukan header).
 */
function verifyOriginForMutations(req, res, next) {
  const unsafeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (!unsafeMethods.includes(req.method)) return next();

  const origin = req.get('origin') || req.get('referer');
  if (!origin) {
    return res.status(403).json({ error: 'Header Origin/Referer wajib ada untuk permintaan ini.' });
  }
  const isAllowed = allowedOrigins.some((allowed) => origin.startsWith(allowed));
  if (!isAllowed) {
    return res.status(403).json({ error: 'Origin tidak dikenali.' });
  }
  return next();
}

/**
 * Menghasilkan/menyertakan request-id unik untuk tiap request, memudahkan
 * korelasi log saat menyelidiki pola traffic mencurigakan (mis. saat DDoS).
 */
function requestId(req, res, next) {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
}

/**
 * HPP: mencegah HTTP Parameter Pollution (mis. ?id=1&id=2 dipakai untuk
 * membingungkan validasi/query).
 */
const hppMiddleware = hpp();

module.exports = {
  helmetMiddleware,
  corsMiddleware,
  verifyOriginForMutations,
  requestId,
  hppMiddleware,
  allowedOrigins,
};
