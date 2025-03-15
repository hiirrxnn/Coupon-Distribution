// server/routes/api/coupons.js
const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const couponController = require('../../controllers/couponController');

// @route   GET api/coupons
// @desc    Get all coupons (for admin)
// @access  Private
router.get('/', auth, couponController.getAllCoupons);

// @route   POST api/coupons
// @desc    Create a new coupon
// @access  Private
router.post('/', auth, couponController.createCoupon);

// @route   PUT api/coupons/:id
// @desc    Update a coupon
// @access  Private
router.put('/:id', auth, couponController.updateCoupon);

// @route   DELETE api/coupons/:id
// @desc    Delete a coupon
// @access  Private
router.delete('/:id', auth, couponController.deleteCoupon);

module.exports = router;
