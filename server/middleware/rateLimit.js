// server/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');
const Claim = require('../models/Claim');

// Rate limiting for IP-based requests
const createIpRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { msg: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

exports.ipLimiter = createIpRateLimiter(
  30 * 60 * 1000,
  1, 
  'Too many coupon claims from this IP, please try again later'
);