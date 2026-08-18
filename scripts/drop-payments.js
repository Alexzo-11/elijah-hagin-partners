const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

async function dropAndRecreatePayments() {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // Check if collection exists
    const collections = await db.listCollections({ name: 'payments' }).toArray();
    
    if (collections.length > 0) {
      // Drop the collection
      await db.dropCollection('payments');
      console.log('✅ Payments collection dropped successfully');
    } else {
      console.log('ℹ️ Payments collection does not exist');
    }
    
    // Create the collection without indexes
    await db.createCollection('payments');
    console.log('✅ Payments collection created successfully');
    
    console.log('✅ Done! You can now restart the server.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

dropAndRecreatePayments();