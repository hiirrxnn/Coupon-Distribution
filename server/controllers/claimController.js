// server/controllers/claimController.js
const Coupon = require('../models/Coupon');
const Claim = require('../models/Claim');

// @route   GET api/claims
// @desc    Get all claims (for admin)
// @access  Private
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate('coupon', 'code value isPercentage')
      .sort({ claimedAt: -1 });
    res.json(claims);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/claims
// @desc    Claim a coupon (for guest user)
// @access  Public (with rate limiting and tracking)
exports.claimCoupon = async (req, res) => {
  const { sessionId } = req.body;
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  try {
    // Find the next available coupon using round-robin approach
    const availableCoupon = await Coupon.findOne({
      claimed: false,
      active: true,
      expiryDate: { $gt: new Date() }
    }).sort({ createdAt: 1 });

    if (!availableCoupon) {
      return res.status(404).json({ msg: 'No coupons available at this time' });
    }

    // Mark coupon as claimed
    availableCoupon.claimed = true;
    await availableCoupon.save();

    // Create a record of this claim
    const newClaim = new Claim({
      coupon: availableCoupon._id,
      ipAddress,
      userAgent,
      sessionId
    });

    await newClaim.save();

    res.json({
      success: true,
      coupon: {
        code: availableCoupon.code,
        description: availableCoupon.description,
        value: availableCoupon.value,
        isPercentage: availableCoupon.isPercentage,
        expiryDate: availableCoupon.expiryDate
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};