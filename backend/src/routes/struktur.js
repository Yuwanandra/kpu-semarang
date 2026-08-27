const express = require('express');
const { query } = require('../config/db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, nama, jabatan, divisi, deskripsi, foto_url
       FROM anggota_komisi ORDER BY urutan ASC`
    );
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
