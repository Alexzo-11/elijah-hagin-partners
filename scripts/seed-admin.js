// scripts/seed-admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

// Define Admin Schema directly in the script to avoid model issues
const AdminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

let Admin;

async function seedAdmin() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env.local');
      console.error('Please create .env.local with your MongoDB connection string');
      process.exit(1);
    }

    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Define the model
    Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

    const adminEmail = 'admin@exousiafellowship.org';
    const adminPassword = 'Admin@2026';

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('ℹ️ Admin already exists');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin
    const admin = await Admin.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      phone: '+1 234 567 890',
      role: 'admin',
      isActive: true,
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('🆔 Admin ID:', admin._id);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('Could not connect to MongoDB. Please check your connection string.');
    }
    process.exit(1);
  }
}

seedAdmin();