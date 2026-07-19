const mongoose = require('mongoose');

const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('Error: MONGODB_URI is not defined in the environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`Success: MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDatabase;
