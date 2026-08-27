const serverless = require('serverless-http');
const app = require('../src/app');

// Vercel akan memuat file ini sebagai serverless function.
// Semua request ke /api/* diarahkan ke sini lewat vercel.json rewrites.
module.exports = serverless(app);
