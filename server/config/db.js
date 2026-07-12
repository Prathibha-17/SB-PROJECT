import mongoose from 'mongoose';
import colors from 'colors';

let isDbConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore', {
      serverSelectionTimeoutMS: 3000, // Quick timeout (3s) so it doesn't hang on connection failures
    });
    isDbConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    isDbConnected = false;
    console.log(`\n⚠️  MongoDB connection failed: ${error.message}`.yellow.bold);
    console.log(`👉 Running in fallback mode using local memory-based database instead.\n`.green);
  }
};

export { isDbConnected };
export default connectDB;
