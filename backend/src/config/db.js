import mongoose from "mongoose";

const connectDB = async (retries = 3, delay = 2000) => {
  const uri = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/voluntry";
  if (!process.env.MONGO_URI) {
    console.warn(
      "⚠️  MONGO_URI missing; falling back to local mongodb://127.0.0.1:27017/voluntry"
    );
  }

  // Set up connection event handlers
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB connected successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected");
  });

  // Handle process termination
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000, // Increased to 10 seconds
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxPoolSize: 10,
        retryWrites: true,
        w: "majority",
      });
      console.log("✅ MongoDB connected");
      return; // Success, exit the function
    } catch (error) {
      const isLastAttempt = attempt === retries;
      
      console.error(`❌ MongoDB connection attempt ${attempt}/${retries} failed:`, error.message);
      
      // Provide helpful error messages
      if (error.message.includes("IP") || error.message.includes("whitelist")) {
        console.error("\n📋 IP Whitelist Issue Detected:");
        console.error("   → Your IP address may not be whitelisted in MongoDB Atlas");
        console.error("   → Go to: https://cloud.mongodb.com → Network Access → Add IP Address");
        console.error("   → Or use 0.0.0.0/0 to allow all IPs (for development only)\n");
      } else if (error.message.includes("authentication")) {
        console.error("\n🔐 Authentication Issue Detected:");
        console.error("   → Check your MongoDB username and password in MONGO_URI");
        console.error("   → Format: mongodb+srv://username:password@cluster.mongodb.net/dbname\n");
      } else if (error.message.includes("ENOTFOUND") || error.message.includes("DNS")) {
        console.error("\n🌐 DNS/Network Issue Detected:");
        console.error("   → Check your internet connection");
        console.error("   → Verify the MongoDB cluster hostname in MONGO_URI\n");
      }

      if (isLastAttempt) {
        console.error("\n💡 Troubleshooting Tips:");
        console.error("   1. Verify MONGO_URI in your .env file");
        console.error("   2. Check MongoDB Atlas Network Access settings");
        console.error("   3. Ensure MongoDB Atlas cluster is running");
        console.error("   4. For local MongoDB: ensure the service is running\n");
        process.exit(1);
      }

      // Wait before retrying with exponential backoff
      const waitTime = delay * attempt;
      console.log(`⏳ Retrying in ${waitTime / 1000} seconds...\n`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
};

export default connectDB;

