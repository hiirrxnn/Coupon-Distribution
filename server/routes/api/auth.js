// server/routes/api/auth.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const authController = require('../../controllers/authController');

// Debug middleware
router.use((req, res, next) => {
  console.log('Auth route accessed:', req.method, req.path);
  console.log('Request body:', req.body);
  next();
});

// @route   POST api/auth/login
// @desc    Login admin user & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET api/auth
// @desc    Get admin user data
// @access  Private
router.get('/', auth, authController.getAdmin);

module.exports = router;