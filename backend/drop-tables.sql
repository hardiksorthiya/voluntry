-- Migration script to drop removed tables
-- Run this SQL script to remove chat, activity, attendance, and volunteer_activity tables
-- Usage: mysql -u root -p voluntry < drop-tables.sql

USE voluntry;

-- Drop tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS volunteer_activities;
DROP TABLE IF EXISTS activities;

-- Update users table role enum to remove 'volunteer' option
ALTER TABLE users MODIFY COLUMN role ENUM('user', 'manager', 'admin') DEFAULT 'user';

SELECT 'Tables dropped successfully!' AS result;

