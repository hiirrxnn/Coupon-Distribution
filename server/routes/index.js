// server/routes/index.js
const express = require('express');
const router = express.Router();

// API routes
router.use('/auth', require('./api/auth'));
router.use('/coupons', require('./api/coupons'));
router.use('/claims', require('./api/claims'));

module.exports = router;