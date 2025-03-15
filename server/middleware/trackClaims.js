const Claim = require('../models/Claim');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');

// Middleware to track unique visits through cookies
exports.trackSession = (req, res, next) => {
  // Check if session ID exists in cookies
  let sessionId = req.cookies.sessionId;
  
  // If not, create a new one
  if (!sessionId) {
    sessionId = uuidv4();
    
    // Set cookie to expire in 7 days
    res.cookie('sessionId', sessionId, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }
  
  // Add sessionId to request for further use
  req.sessionId = sessionId;
  next();
};

// Check if this session has already claimed a coupon
exports.checkSessionClaim = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId || req.body.sessionId;
    
    if (!sessionId) {
      return next();
    }
    
    // Look for previous claims from this session
    const existingClaim = await Claim.findOne({ sessionId });
    
    if (existingClaim) {
      return res.status(403).json({ 
        msg: 'You have already claimed a coupon with this browser session' 
      });
    }
    
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Check if this IP has claimed a coupon recently (within cooldown period)
exports.checkIpClaim = async (req, res, next) => {
  try {
    const ipAddress = req.ip;
    const cooldownPeriod = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    // Look for claims from this IP within cooldown period
    const recentClaim = await Claim.findOne({
      ipAddress,
      claimedAt: { $gt: new Date(Date.now() - cooldownPeriod) }
    });
    
    if (recentClaim) {
      return res.status(403).json({ 
        msg: 'Too many coupon claims from this IP, please try again later' 
      });
    }
    
    next();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};