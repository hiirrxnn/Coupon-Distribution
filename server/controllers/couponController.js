const Coupon = require('../models/Coupon');
const Claim = require('../models/Claim');

// @route   GET api/coupons
// @desc    Get all coupons (for admin)
// @access  Private
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST api/coupons
// @desc    Create a new coupon
// @access  Private
exports.createCoupon = async (req, res) => {
  const { code, description, value, isPercentage, expiryDate } = req.body;

  try {
    // Check if coupon with same code exists
    let coupon = await Coupon.findOne({ code });
    
    if (coupon) {
      return res.status(400).json({ msg: 'Coupon code already exists' });
    }

    // Create new coupon
    coupon = new Coupon({
      code,
      description,
      value,
      isPercentage,
      expiryDate
    });

    await coupon.save();
    res.json(coupon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PUT api/coupons/:id
// @desc    Update a coupon
// @access  Private
exports.updateCoupon = async (req, res) => {
  const { code, description, value, isPercentage, active, expiryDate } = req.body;

  try {
    let coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ msg: 'Coupon not found' });
    }

    // Update fields
    coupon.code = code || coupon.code;
    coupon.description = description || coupon.description;
    coupon.value = value || coupon.value;
    coupon.isPercentage = isPercentage !== undefined ? isPercentage : coupon.isPercentage;
    coupon.active = active !== undefined ? active : coupon.active;
    coupon.expiryDate = expiryDate || coupon.expiryDate;

    await coupon.save();
    res.json(coupon);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   DELETE api/coupons/:id
// @desc    Delete a coupon
// @access  Private
exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    
    if (!coupon) {
      return res.status(404).json({ msg: 'Coupon not found' });
    }

    await coupon.remove();
    res.json({ msg: 'Coupon removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
