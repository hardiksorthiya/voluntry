import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/voluntry";
  if (!process.env.MONGO_URI) {
    console.warn(
      "⚠️  MONGO_URI missing; falling back to local mongodb://127.0.0.1:27017/voluntry"
    );
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;

