import mysql from "mysql2/promise";

let pool = null;

const connectDB = async (retries = 3, delay = 2000) => {
  const config = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "voluntry",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  };

  if (!process.env.DB_HOST && !process.env.DB_USER) {
    console.warn(
      "⚠️  Database config missing; falling back to defaults (localhost/root)"
    );
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      pool = mysql.createPool(config);
      
      // Test connection
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      
      console.log("✅ MySQL connected successfully");
      console.log(`   Database: ${config.database}`);
      console.log(`   Host: ${config.host}`);
      
      return pool;
    } catch (error) {
      const isLastAttempt = attempt === retries;
      
      console.error(`❌ MySQL connection attempt ${attempt}/${retries} failed:`, error.message);
      
      // Provide helpful error messages
      if (error.code === "ECONNREFUSED") {
        console.error("\n📋 Connection Refused:");
        console.error("   → Make sure MySQL server is running");
        console.error("   → Check host and port in DB_HOST\n");
      } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
        console.error("\n🔐 Authentication Issue:");
        console.error("   → Check DB_USER and DB_PASSWORD in .env file");
        console.error("   → Verify MySQL user has proper permissions\n");
      } else if (error.code === "ER_BAD_DB_ERROR") {
        console.error("\n📦 Database Not Found:");
        console.error(`   → Database "${config.database}" does not exist`);
        console.error("   → Create it first: CREATE DATABASE voluntry;\n");
      }

      if (isLastAttempt) {
        console.error("\n💡 Troubleshooting Tips:");
        console.error("   1. Verify MySQL server is running");
        console.error("   2. Check DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in .env");
        console.error("   3. Create database: CREATE DATABASE voluntry;");
        console.error("   4. Ensure MySQL user has proper permissions\n");
        process.exit(1);
      }

      // Wait before retrying with exponential backoff
      const waitTime = delay * attempt;
      console.log(`⏳ Retrying in ${waitTime / 1000} seconds...\n`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
};

// Handle process termination
process.on("SIGINT", async () => {
  if (pool) {
    await pool.end();
    console.log("MySQL connection pool closed due to app termination");
  }
  process.exit(0);
});

export { pool };
export default connectDB;
