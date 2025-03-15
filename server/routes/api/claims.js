// server/routes/api/claims.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { ipLimiter } = require('../../middleware/rateLimit');
const { trackSession, checkSessionClaim, checkIpClaim } = require('../../middleware/trackClaims');
const claimController = require('../../controllers/claimController');

// @route   GET api/claims
// @desc    Get all claims (for admin)
// @access  Private
router.get('/', auth, claimController.getAllClaims);

// @route   POST api/claims
// @desc    Claim a coupon (for guest user)
// @access  Public (with rate limiting and tracking)
router.post(
  '/',
  trackSession,        // Track user session
  checkSessionClaim,   // Check if session already claimed
  checkIpClaim,        // Check if IP already claimed recently
  ipLimiter,           // Rate limit by IP
  claimController.claimCoupon
);

module.exports = router;