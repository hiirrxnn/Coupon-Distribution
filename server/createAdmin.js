const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('config');

// Connect to MongoDB
mongoose.connect(config.get('mongoURI'), {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('MongoDB Connected');
  
  try {
    // First, drop the admin collection to start fresh
    await mongoose.connection.db.collection('admins').drop().catch(err => {
      // It's okay if the collection doesn't exist yet
      console.log('No admins collection to drop');
    });
    
    // Create the admin schema
    const adminSchema = new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    // Create Admin model directly (without using the existing model)
    const TempAdmin = mongoose.model('Admin', adminSchema);
    
    // Create a simple hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    console.log('Generated hashed password:', hashedPassword);
    
    // Create new admin
    const newAdmin = new TempAdmin({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword
    });
    
    await newAdmin.save();
    console.log('Admin user created successfully');
    
    // Verify the password hash works
    console.log('Verifying password...');
    const isMatch = await bcrypt.compare('password123', hashedPassword);
    console.log('Password verification result:', isMatch);
    
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
  
  mongoose.disconnect();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});