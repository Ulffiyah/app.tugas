const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Validasi Environment Variables (Pemicu Defect 2)
if (!process.env.PORT || !process.env.DB_HOST) {
  console.error('[ERROR] EnvValidationException: Variabel lingkungan tidak ditemukan!');
  console.error('Pastikan kamu telah membuat file .env berdasarkan .env.example');
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

// Koneksi Database PostgreSQL (Pemicu Defect 3 jika PostgreSQL mati/database belum dibuat)
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Endpoint Utama
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Mini Program Berhasil Dijalankan!',
      database: 'Connected to PostgreSQL',
      time: result.rows[0].now
    });
  } catch (err) {
    console.error('[ERROR] Database Connection Failed:', err.message);
    return res.status(500).json({
      status: 500,
      error: 'ECONNREFUSED 127.0.0.1:5432',
      message: 'Gagal terhubung ke database PostgreSQL. Pastikan service PostgreSQL sudah berjalan dan database "app" sudah dibuat di pgAdmin.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});