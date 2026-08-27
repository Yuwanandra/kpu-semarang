const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const {
  helmetMiddleware,
  corsMiddleware,
  verifyOriginForMutations,
  requestId,
  hppMiddleware,
} = require('./middleware/security');
const { apiRateLimiter } = require('./middleware/rateLimiter');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const beritaRoutes = require('./routes/berita');
const agendaRoutes = require('./routes/agenda');
const strukturRoutes = require('./routes/struktur');
const kontakRoutes = require('./routes/kontak');

const app = express();

// Vercel/serverless berjalan di belakang proxy — perlu ini agar req.ip dan
// header X-Forwarded-* dibaca dengan benar (penting untuk rate limiting).
app.set('trust proxy', 1);

app.use(requestId);
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(hppMiddleware);
// compression() dilewati saat berjalan di Vercel: dikenal bisa membuat
// response serverless-http menggantung tanpa batas (bug interaksi stream
// antara `compression` dan emulasi response serverless-http). Vercel sendiri
// sudah mengompresi response secara otomatis di level edge/CDN-nya, jadi
// tidak ada fungsi yang hilang dengan melewatinya di sana.
if (!process.env.VERCEL) {
  app.use(compression());
}
app.use(express.json({ limit: '200kb' })); // batasi ukuran body untuk mitigasi payload-flood
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(verifyOriginForMutations);
app.use('/api', apiRateLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/berita', beritaRoutes);
app.use('/api/agenda', agendaRoutes);
app.use('/api/struktur', strukturRoutes);
app.use('/api/kontak', kontakRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
