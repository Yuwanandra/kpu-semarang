const logger = require('../utils/logger');

/**
 * Handler error terpusat. PENTING: jangan pernah mengirim stack trace atau
 * detail error mentah (mis. pesan error PostgreSQL) ke klien di production —
 * itu bisa membocorkan struktur database/skema ke penyerang.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  logger.error({
    requestId: req.id,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err.message === 'Origin tidak diizinkan oleh CORS') {
    return res.status(403).json({ error: 'Akses ditolak: origin tidak dikenali.' });
  }

  const publicMessage =
    process.env.NODE_ENV === 'production' && status >= 500
      ? 'Terjadi kesalahan pada server. Silakan coba lagi nanti.'
      : err.message;

  res.status(status).json({ error: publicMessage });
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Endpoint tidak ditemukan.' });
}

module.exports = { errorHandler, notFoundHandler };
