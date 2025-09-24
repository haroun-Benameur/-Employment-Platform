const mongoose = require('mongoose');

let isConnected = false;

async function connectDatabase() {
  if (isConnected) return;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not set');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    autoIndex: true
  });
  isConnected = true;
  console.log('Connected to MongoDB');
}

module.exports = { connectDatabase };
