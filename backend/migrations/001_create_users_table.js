/**
 * Migration: Create users table
 * Created: Initial migration
 * 
 * Run: npm run migrate
 * Rollback: npm run migrate:rollback
 */

export async function up(knex) {
  // Check if table already exists (for existing databases)
  const exists = await knex.schema.hasTable('users');
  
  if (exists) {
    console.log('⚠️  Users table already exists, skipping creation');
    return;
  }
  
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.enum('role', ['user', 'manager', 'admin']).defaultTo('user');
    table.text('refreshToken').nullable();
    
    // Profile fields
    table.text('profile_bio').nullable();
    table.string('profile_phone', 50).nullable();
    table.json('profile_skills').nullable();
    table.string('profile_availability', 100).defaultTo('flexible');
    table.string('profile_location', 255).nullable();
    table.string('profile_avatarUrl', 500).nullable();
    table.json('profile_socials').nullable();
    
    // Stats fields
    table.integer('stats_hoursContributed').defaultTo(0);
    table.integer('stats_eventsCompleted').defaultTo(0);
    table.integer('stats_impactPoints').defaultTo(0);
    
    // Timestamps
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    
    // Indexes
    table.index('email', 'idx_email');
    table.index('role', 'idx_role');
  });
  
  console.log('✅ Created users table');
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('users');
  console.log('✅ Dropped users table');
}

