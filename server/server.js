const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const config = require('config');

// Create Express app
const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cookieParser(config.get('cookieSecret')));
app.use(cors({
  origin: '*', // Allow requests from any origin for now
  credentials: true
}));

// Trust first proxy for IP detection
app.set('trust proxy', 1);

// Define API Routes - make sure these are prefixed with /api
app.use('/api', require('./routes/index'));

// For API-only deployment, don't try to serve static files
app.get('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));