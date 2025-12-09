#!/usr/bin/env node

/**
 * Run SQL schema to create tables
 * Usage: node run-schema.js
 */

import mysql from "mysql2/promise";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runSchema() {
  let connection;
  
  try {
    const config = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      multipleStatements: true, // Allow multiple SQL statements
    };

    console.log("🔌 Connecting to MySQL...");
    connection = await mysql.createConnection(config);
    console.log("✅ Connected to MySQL");

    // Read SQL file
    const sqlPath = join(__dirname, "src", "config", "schema.sql");
    console.log(`📖 Reading schema from: ${sqlPath}`);
    const sql = await readFile(sqlPath, "utf-8");

    // Execute SQL
    console.log("🚀 Creating tables...");
    await connection.query(sql);
    console.log("✅ All tables created successfully!");

    console.log("\n📋 Tables created:");
    console.log("   - users");

    console.log("\n✅ Database setup complete!");
    console.log("   You can now start the server: npm start");

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("\n💡 Check your DB_USER and DB_PASSWORD in .env file");
    } else if (error.code === "ECONNREFUSED") {
      console.error("\n💡 Make sure MySQL server is running");
    } else if (error.code === "ER_DBACCESS_DENIED_ERROR") {
      console.error("\n💡 Make sure the database 'voluntry' exists");
      console.error("   Run: CREATE DATABASE voluntry;");
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runSchema();

