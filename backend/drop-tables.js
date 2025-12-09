#!/usr/bin/env node

/**
 * Drop removed tables from database
 * Usage: node drop-tables.js
 */

import mysql from "mysql2/promise";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function dropTables() {
  let connection;
  
  try {
    const config = {
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "voluntry",
      multipleStatements: true,
    };

    console.log("🔌 Connecting to MySQL...");
    connection = await mysql.createConnection(config);
    console.log("✅ Connected to MySQL");

    // Read SQL file
    const sqlPath = join(__dirname, "drop-tables.sql");
    console.log(`📖 Reading migration script from: ${sqlPath}`);
    const sql = await readFile(sqlPath, "utf-8");

    // Execute SQL
    console.log("🗑️  Dropping tables...");
    await connection.query(sql);
    console.log("✅ Tables dropped successfully!");

    console.log("\n📋 Removed tables:");
    console.log("   - activities");
    console.log("   - attendance");
    console.log("   - chat_messages");
    console.log("   - volunteer_activities");
    console.log("\n✅ Database migration complete!");

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    
    if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("\n💡 Check your DB_USER and DB_PASSWORD in .env file");
    } else if (error.code === "ECONNREFUSED") {
      console.error("\n💡 Make sure MySQL server is running");
    } else if (error.code === "ER_BAD_DB_ERROR") {
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

dropTables();

