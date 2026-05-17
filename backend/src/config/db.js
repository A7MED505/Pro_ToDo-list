const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  const uri = mongoUri || process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is required to connect to MongoDB');
  }

  await mongoose.connect(uri);
};

module.exports = connectDB;
