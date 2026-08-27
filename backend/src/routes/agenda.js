const express = require('express');
const { query } = require('../config/db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, nama_tahapan, deskripsi, tanggal_mulai, tanggal_selesai, urutan, status
       FROM agenda ORDER BY urutan ASC`
    );
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
