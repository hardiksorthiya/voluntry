-- Voluntry Database Schema for MySQL
-- Run this SQL script to create all tables

CREATE DATABASE IF NOT EXISTS voluntry;
USE voluntry;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'manager', 'admin') DEFAULT 'user',
  refreshToken TEXT,
  profile_bio TEXT,
  profile_phone VARCHAR(50),
  profile_skills JSON,
  profile_availability VARCHAR(100) DEFAULT 'flexible',
  profile_location VARCHAR(255),
  profile_avatarUrl VARCHAR(500),
  profile_socials JSON,
  stats_hoursContributed INT DEFAULT 0,
  stats_eventsCompleted INT DEFAULT 0,
  stats_impactPoints INT DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  conversation_id VARCHAR(255),
  role ENUM('user', 'assistant') NOT NULL,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_created_at (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

