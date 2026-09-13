const mongoose = require('mongoose');
const { seedDatabase } = require('../services/seedService');

let mongod = null;

const connectDB = async () => {
  try {
    const connUri = 
      process.env.MONGODB_URI || 
      process.env.MONGO_URI || 
      process.env.MONGO_URL || 
      process.env.DATABASE_URL || 
      'mongodb://127.0.0.1:27017/roommatehub';
    
    // Attempt standard connection with 5-second timeout
    await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to: ${mongoose.connection.host}`);
    // Auto-seed default accounts & properties if database is empty
    await seedDatabase(false);
  } catch (err) {
    console.warn(`[MongoDB] Standard connection to URI failed: ${err.message}`);
    console.log(`[MongoDB] Starting fallback in-memory MongoDB server for seamless development/demo...`);
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      try {
        // Try binding to standard port 27017 first for easy MongoDB Compass connection
        mongod = await MongoMemoryServer.create({
          instance: {
            port: 27017,
            dbName: 'roommatehub',
          },
        });
      } catch (portErr) {
        // Fallback to random available port if 27017 is unavailable
        mongod = await MongoMemoryServer.create({
          instance: {
            dbName: 'roommatehub',
          },
        });
      }

      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`[MongoDB] Database running and connected at: ${uri}`);
      console.log(`[MongoDB] 👉 Open MongoDB Compass and connect to: ${uri}`);
      // Auto-seed default accounts & properties if database is empty
      await seedDatabase(false);
    } catch (memErr) {
      console.error(`[MongoDB] Fatal error initializing database:`, memErr.message);
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('Error during DB disconnect:', err.message);
  }
};

module.exports = { connectDB, disconnectDB };

