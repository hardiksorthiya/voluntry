# Database Migration Guide

This project uses **Knex.js** for database migrations (similar to Alembic for Python/SQLAlchemy).

## 📋 Available Commands

### Run Migrations
```bash
npm run migrate
```
Applies all pending migrations to the database.

### Check Migration Status
```bash
npm run migrate:status
```
Shows which migrations have been applied and which are pending.

### Rollback Last Migration
```bash
npm run migrate:rollback
```
Rolls back the last batch of migrations.

### Rollback All Migrations
```bash
npm run migrate:rollback -- --all
```
Rolls back all migrations.

### Create New Migration
```bash
npm run migrate:make migration_name
```
Creates a new migration file in the `migrations/` directory.

## 📁 Migration Files

Migrations are stored in `backend/migrations/` directory:

- `001_create_users_table.js` - Creates the users table
- `002_drop_removed_tables.js` - Drops removed tables (activities, chat, etc.)

## 🔄 Migration Workflow

### Initial Setup
1. Make sure your `.env` file has correct database credentials
2. Create the database: `CREATE DATABASE voluntry;`
3. Run migrations: `npm run migrate`

### Making Changes
1. Create a new migration: `npm run migrate:make add_new_column`
2. Edit the migration file in `migrations/` directory
3. Test locally: `npm run migrate`
4. Commit the migration file to version control

### Deployment
1. Pull latest code
2. Run migrations: `npm run migrate`
3. Start the application: `npm start`

## 📝 Migration File Structure

Each migration file exports two functions:

```javascript
export async function up(knex) {
  // Code to apply the migration
  await knex.schema.createTable('table_name', (table) => {
    // Define table structure
  });
}

export async function down(knex) {
  // Code to rollback the migration
  await knex.schema.dropTableIfExists('table_name');
}
```

## 🗄️ Migration Tracking

Knex.js automatically creates a `knex_migrations` table to track which migrations have been applied. This ensures:
- Migrations run only once
- Migrations run in the correct order
- You can see migration history

## ⚠️ Important Notes

1. **Always test migrations** on a development database first
2. **Never edit existing migrations** that have been run in production
3. **Create new migrations** for any changes to existing tables
4. **Backup your database** before running migrations in production
5. **Review migration files** before running them

## 🔍 Checking Migration Status

```bash
npm run migrate:status
```

Output example:
```
Batch 1 run: 2 migrations
  ✓ 001_create_users_table.js
  ✓ 002_drop_removed_tables.js
```

## 🆘 Troubleshooting

### Migration fails
- Check database connection in `.env`
- Verify MySQL server is running
- Check migration file syntax
- Review error messages carefully

### Need to reset database
```bash
# Rollback all migrations
npm run migrate:rollback -- --all

# Run migrations again
npm run migrate
```

### Migration already applied
- Knex tracks applied migrations
- Each migration runs only once
- Check status with `npm run migrate:status`

