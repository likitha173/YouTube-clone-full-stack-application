const mongoose = require("mongoose");

const mongoConnection = async (retries = 5) => {
  // Debug: Print out environment variables for Render troubleshooting
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/youtube-clone';
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      heartbeatFrequencyMS: 2000, // Check server status every 2s
    });
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);

    if (retries > 0) {
      console.log(`🔄 Retrying connection... (${retries} attempts left)`);
      setTimeout(() => mongoConnection(retries - 1), 5000);
    } else {
      console.error("💀 Database connection failed after all retries");
      process.exit(1);
    }
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('🔌 Database disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 Database reconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('👋 Database connection closed through app termination');
  process.exit(0);
});

module.exports = mongoConnection;
