const express = require('express');
const { body, param, query: queryValidator, validationResult } = require('express-validator');
const xss = require('xss');
const { query } = require('../config/db');
const { requireAuth, requireRole } = require('../middleware/auth');
const { verifyCsrf } = require('../middleware/csrf');

const router = express.Router();

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 200);
}

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Input tidak valid.', details: errors.array() });
  }
  return next();
}

// ---- Publik: daftar berita terbit, dengan paginasi & filter kategori ----
router.get(
  '/',
  [
    queryValidator('page').optional().isInt({ min: 1 }).toInt(),
    queryValidator('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    queryValidator('kategori').optional().isIn(['berita', 'pengumuman', 'siaran_pers']),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 9;
      const offset = (page - 1) * limit;
      const kategori = req.query.kategori;

      const params = ['terbit'];
      let where = 'status = $1';
      if (kategori) {
        params.push(kategori);
        where += ` AND kategori = $${params.length}`;
      }

      const listResult = await query(
        `SELECT id, slug, judul, ringkasan, kategori, gambar_url, sumber, tautan_eksternal, dilihat, created_at
         FROM berita WHERE ${where}
         ORDER BY created_at DESC
         LIMIT ${limit} OFFSET ${offset}`,
        params
      );
      const countResult = await query(`SELECT COUNT(*)::int AS total FROM berita WHERE ${where}`, params);

      res.json({
        data: listResult.rows,
        pagination: { page, limit, total: countResult.rows[0].total },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ---- Publik: detail berita by slug ----
router.get(
  '/:slug',
  [param('slug').trim().isLength({ min: 1, max: 220 })],
  handleValidation,
  async (req, res, next) => {
    try {
      const result = await query(
        `SELECT id, slug, judul, ringkasan, konten, kategori, gambar_url, sumber, tautan_eksternal, dilihat, created_at, updated_at
         FROM berita WHERE slug = $1 AND status = 'terbit'`,
        [req.params.slug]
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Berita tidak ditemukan.' });

      query('UPDATE berita SET dilihat = dilihat + 1 WHERE id = $1', [result.rows[0].id]).catch(() => {});

      res.json({ data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

// ---- Terproteksi: buat berita baru (admin/editor) ----
router.post(
  '/',
  requireAuth,
  requireRole('editor', 'superadmin'),
  verifyCsrf,
  [
    body('judul').trim().isLength({ min: 5, max: 250 }),
    body('ringkasan').optional().trim().isLength({ max: 500 }),
    body('konten').trim().isLength({ min: 20 }),
    body('kategori').isIn(['berita', 'pengumuman', 'siaran_pers']),
    body('gambar_url').optional().isURL(),
    body('sumber').optional().trim().isLength({ max: 200 }),
    body('tautan_eksternal').optional().isURL(),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      // xss() men-strip tag/atribut berbahaya dari konten HTML yang disimpan,
      // mencegah stored-XSS saat konten ditampilkan kembali ke pengunjung publik.
      const konten = xss(req.body.konten);
      const ringkasan = req.body.ringkasan ? xss(req.body.ringkasan) : null;
      const slug = `${slugify(req.body.judul)}-${Date.now().toString(36)}`;

      const result = await query(
        `INSERT INTO berita (slug, judul, ringkasan, konten, kategori, gambar_url, sumber, tautan_eksternal, penulis_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id, slug`,
        [
          slug,
          req.body.judul,
          ringkasan,
          konten,
          req.body.kategori,
          req.body.gambar_url || null,
          req.body.sumber || null,
          req.body.tautan_eksternal || null,
          req.admin.sub,
        ]
      );
      res.status(201).json({ data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

// ---- Terproteksi: update berita ----
router.put(
  '/:id',
  requireAuth,
  requireRole('editor', 'superadmin'),
  verifyCsrf,
  [
    param('id').isUUID(),
    body('judul').optional().trim().isLength({ min: 5, max: 250 }),
    body('ringkasan').optional().trim().isLength({ max: 500 }),
    body('konten').optional().trim().isLength({ min: 20 }),
    body('kategori').optional().isIn(['berita', 'pengumuman', 'siaran_pers']),
    body('status').optional().isIn(['draft', 'terbit', 'arsip']),
    body('sumber').optional().trim().isLength({ max: 200 }),
    body('tautan_eksternal').optional().isURL(),
  ],
  handleValidation,
  async (req, res, next) => {
    try {
      const fields = ['judul', 'ringkasan', 'konten', 'kategori', 'gambar_url', 'status', 'sumber', 'tautan_eksternal'];
      const updates = [];
      const values = [];
      let idx = 1;

      for (const f of fields) {
        if (req.body[f] !== undefined) {
          const val = f === 'konten' || f === 'ringkasan' ? xss(req.body[f]) : req.body[f];
          updates.push(`${f} = $${idx}`);
          values.push(val);
          idx += 1;
        }
      }
      if (updates.length === 0) return res.status(400).json({ error: 'Tidak ada field untuk diperbarui.' });

      updates.push(`updated_at = now()`);
      values.push(req.params.id);

      const result = await query(
        `UPDATE berita SET ${updates.join(', ')} WHERE id = $${idx} RETURNING id, slug`,
        values
      );
      if (!result.rows[0]) return res.status(404).json({ error: 'Berita tidak ditemukan.' });
      res.json({ data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }
);

// ---- Terproteksi: hapus berita (superadmin saja) ----
router.delete(
  '/:id',
  requireAuth,
  requireRole('superadmin'),
  verifyCsrf,
  [param('id').isUUID()],
  handleValidation,
  async (req, res, next) => {
    try {
      const result = await query('DELETE FROM berita WHERE id = $1 RETURNING id', [req.params.id]);
      if (!result.rows[0]) return res.status(404).json({ error: 'Berita tidak ditemukan.' });
      res.json({ message: 'Berita dihapus.' });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
