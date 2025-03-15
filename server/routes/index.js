// server/routes/index.js
const express = require('express');
const router = express.Router();

// API routes
router.use('/api/auth', require('./api/auth'));
router.use('/api/coupons', require('./api/coupons'));
router.use('/api/claims', require('./api/claims'));

module.exports = router;