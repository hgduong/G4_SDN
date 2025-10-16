require('dotenv').config();
const mongoose = require('mongoose');

// Use the environment variable if provided, otherwise default to a
// local MongoDB instance (useful for development).
const getMongoUri = () => {
   if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
   return 'mongodb://127.0.0.1:27017/g4_sdn';
};

const connectDB = async () => {
   const uri = getMongoUri();
   try {
      // Mongoose 6+ no longer requires most options, but passing a couple
      // of common ones is harmless and explicit.
      await mongoose.connect(uri, {
         // useNewUrlParser and useUnifiedTopology are defaults in modern mongoose
      });
      console.log('MongoDB connected to', uri);
   } catch (error) {
      console.error('MongoDB connection failed:', error.message || error);
      // Keep the original behavior of exiting on failure so problems are noticed.
      process.exit(1);
   }
};

module.exports = connectDB;
