# MySQL Database Setup - Quick Start

## ✅ Migration Status

**Completed:**
- ✅ Database connection (mysql2)
- ✅ SQL schema created
- ✅ All models converted to MySQL
- ✅ Auth controller updated
- ✅ Validation utilities created

**Next Steps:**
- Update remaining controllers (see MYSQL_MIGRATION_GUIDE.md)
- Test all endpoints

## 🚀 Quick Setup

### 1. Install MySQL
Download and install MySQL from: https://dev.mysql.com/downloads/mysql/

### 2. Create Database
```sql
CREATE DATABASE voluntry;
```

### 3. Run Schema
```bash
# Option 1: Using MySQL command line
mysql -u root -p voluntry < backend/src/config/schema.sql

# Option 2: Copy and paste SQL from backend/src/config/schema.sql into MySQL client
```

### 4. Update .env File
Create/update `backend/.env`:
```env
PORT=4000

# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=voluntry

# JWT Secret
JWT_SECRET=super-secret-key

# OpenAI API Key
OPENAI_API_KEY=sk-your-key
```

### 5. Install Dependencies
```bash
cd backend
npm install
```

### 6. Test Connection
```bash
npm start
```

You should see:
```
✅ MySQL connected successfully
   Database: voluntry
   Host: localhost
```

## 📋 Database Schema

The schema includes these tables:
- `users` - User accounts and profiles
- `activities` - Volunteer activities
- `attendance` - Activity attendance records
- `chat_messages` - AI chat messages
- `volunteer_activities` - Legacy volunteer activities

## 🔧 Troubleshooting

### Connection Refused
- Make sure MySQL server is running
- Check DB_HOST and port (default: 3306)

### Access Denied
- Verify DB_USER and DB_PASSWORD
- Check MySQL user permissions

### Database Not Found
- Create database: `CREATE DATABASE voluntry;`
- Or update DB_NAME in .env

### JSON Column Errors
- Requires MySQL 5.7.8+ or MariaDB 10.2.7+
- Upgrade if using older version

## 📝 Notes

- All IDs are now integers (not MongoDB ObjectIds)
- JSON fields store arrays/objects as JSON
- Timestamps are auto-managed by MySQL
- Foreign keys enforce referential integrity

