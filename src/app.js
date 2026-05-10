const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes     = require('./routes/auth');
const userRoutes     = require('./routes/users');
const tripRoutes     = require('./routes/trips');
const placeRoutes    = require('./routes/places');
const sectionRoutes  = require('./routes/sections');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));

// ── Health check ──────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', app: 'Traveloop API', version: '1.0.0' });
});

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',                       authRoutes);
app.use('/api/users',                      userRoutes);
app.use('/api/trips',                      tripRoutes);
app.use('/api/places',                     placeRoutes);
app.use('/api/trips/:tripId/sections',     sectionRoutes);

// ── 404 handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ── Global error handler ──────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Traveloop API running on http://localhost:${PORT}`);
  console.log(`📋 Health:    GET  http://localhost:${PORT}/health`);
  console.log(`🔐 Auth:      POST http://localhost:${PORT}/api/auth/register`);
  console.log(`              POST http://localhost:${PORT}/api/auth/login`);
  console.log(`🗺  Places:   GET  http://localhost:${PORT}/api/places/featured`);
  console.log(`✈️  Trips:    GET  http://localhost:${PORT}/api/trips`);
  console.log(`📝 Sections: GET  http://localhost:${PORT}/api/trips/:id/sections\n`);
});

module.exports = app;
