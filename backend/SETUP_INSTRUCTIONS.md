# MySQL Setup Instructions

## ✅ Database Created!

Great! You've created the `voluntry` database. Now let's set up the tables.

## Step 1: Run the Schema

You have two options:

### Option A: Using the Setup Script (Easiest)
```bash
cd backend
npm run setup-db
```

### Option B: Manual SQL
1. Open MySQL command line or MySQL Workbench
2. Connect to your MySQL server
3. Select the database: `USE voluntry;`
4. Copy and paste the contents of `backend/src/config/schema.sql`
5. Execute the SQL

## Step 2: Update .env File

Create or update `backend/.env`:
```env
PORT=4000

# MySQL Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=voluntry

# JWT Secret
JWT_SECRET=super-secret-key

# OpenAI API Key (optional)
OPENAI_API_KEY=sk-your-key
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password.

## Step 3: Install Dependencies

```bash
cd backend
npm install
```

This will install `mysql2`.

## Step 4: Test Connection

```bash
npm start
```

You should see:
```
✅ MySQL connected successfully
   Database: voluntry
   Host: localhost
🚀 VOLUNTRY API SERVER STARTED
```

## ✅ Migration Complete!

All controllers use MySQL. The API works with MySQL database.

## 📋 What Changed

- ✅ All models converted to MySQL
- ✅ All controllers updated
- ✅ Database connection configured
- ✅ SQL schema created
- ✅ Validation utilities added

## 🧪 Test Your API

1. Start the server: `npm start`
2. Test health check: `http://localhost:4000/health`
3. Register a user: `POST /api/auth/register`
4. Login: `POST /api/auth/login`

## 🆘 Troubleshooting

### "Access denied for user"
- Check `DB_USER` and `DB_PASSWORD` in `.env`
- Verify MySQL user has proper permissions

### "Database doesn't exist"
- Make sure database `voluntry` exists
- Check `DB_NAME` in `.env`

### "Table doesn't exist"
- Run the schema: `npm run setup-db`
- Or manually run SQL from `src/config/schema.sql`

### Connection refused
- Make sure MySQL server is running
- Check `DB_HOST` (default: localhost)

## 📝 Next Steps

1. ✅ Run schema: `npm run setup-db`
2. ✅ Update `.env` with MySQL credentials
3. ✅ Start server: `npm start`
4. ✅ Test API endpoints

Your backend is now fully migrated to MySQL! 🎉

