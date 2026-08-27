const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

/**
 * Kenapa perlu penanganan khusus untuk serverless (Vercel):
 * setiap invocation function bisa berjalan di instance yang berbeda,
 * sehingga rate limiter in-memory (express-rate-limit default) TIDAK
 * efektif untuk mencegah DDoS lintas-instance. Jika kredensial Upstash
 * tersedia, kita pakai penghitung terdistribusi (Redis) sebagai sumber
 * kebenaran bersama; jika tidak (mis. saat development lokal / single
 * server Node biasa), kita jatuh ke penyimpanan in-memory bawaan.
 */

let distributedLimiter = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  // Lazy require agar paket tidak wajib ada saat memakai mode in-memory.
  const { Ratelimit } = require('@upstash/ratelimit');
  const { Redis } = require('@upstash/redis');

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  distributedLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 request / menit / IP untuk API umum
    analytics: true,
    prefix: 'kpu-smg:api',
  });
}

function clientKey(req) {
  // Di belakang Vercel/CDN, IP asli ada di X-Forwarded-For (leftmost = klien asli).
  const forwarded = req.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip;
  return ip || 'unknown';
}

/**
 * Rate limiter umum untuk seluruh API publik.
 */
async function apiRateLimiter(req, res, next) {
  if (distributedLimiter) {
    const { success, limit, remaining, reset } = await distributedLimiter.limit(clientKey(req));
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    if (!success) {
      res.setHeader('Retry-After', Math.ceil((reset - Date.now()) / 1000));
      return res.status(429).json({ error: 'Terlalu banyak permintaan. Coba lagi sebentar lagi.' });
    }
    return next();
  }
  // Fallback in-memory (development / server tunggal non-serverless)
  return inMemoryApiLimiter(req, res, next);
}

const inMemoryApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: clientKey,
  message: { error: 'Terlalu banyak permintaan. Coba lagi sebentar lagi.' },
});

/**
 * Rate limiter ketat khusus login admin — mitigasi brute-force/credential
 * stuffing (bentuk umum "spoofing" identitas admin).
 */
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: clientKey,
  message: { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
});

/**
 * Slow-down progresif untuk endpoint publik yang lebih berat (mis. form
 * kontak), agar bot yang mengirim permintaan beruntun makin diperlambat
 * alih-alih langsung diblokir keras.
 */
const contactSlowDown = slowDown({
  windowMs: 10 * 60 * 1000,
  delayAfter: 3,
  delayMs: (hits) => hits * 500,
  keyGenerator: clientKey,
});

module.exports = { apiRateLimiter, loginRateLimiter, contactSlowDown, clientKey };
