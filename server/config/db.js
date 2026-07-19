import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerflow-ai';
    await mongoose.connect(uri);
    console.log('[MongoDB] Connected');
  } catch (error) {
    error.context = 'MongoDB Connection Error';
    throw error;
  }
};

export default connectDB;
