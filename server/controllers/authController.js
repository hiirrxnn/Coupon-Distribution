// server/controllers/authController.js
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route   POST api/auth/login
// @desc    Login admin user & get token
// @access  Public
exports.login = async (req, res) => {
  console.log('Login request received:', { 
    body: req.body,
    username: req.body.username, 
    passwordReceived: !!req.body.password 
  });

  const { username, password } = req.body;

  try {
    // Check for admin user
    const admin = await Admin.findOne({ username });
    
    if (!admin) {
      console.log('Admin not found:', username);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await admin.matchPassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT payload
        // Create JWT payload
    const payload = {
      admin: {
        id: admin.id
      }
    };

    // Sign token
    try {
      const token = jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      );
      
      return res.json({ token });
    } catch (err) {
      console.error('JWT sign error:', err);
      return res.status(500).send('Server error');
    }
      } catch (err) {
        console.error('Server error during login:', err.message);
        res.status(500).send('Server error');
      }
};

// @route   GET api/auth
// @desc    Get admin user data
// @access  Private
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};