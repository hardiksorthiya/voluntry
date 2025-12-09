/**
 * Migration: Drop removed tables (activities, attendance, chat_messages, volunteer_activities)
 * Created: Cleanup migration after removing chat and activity features
 * 
 * This migration removes tables that are no longer needed:
 * - activities
 * - attendance
 * - chat_messages
 * - volunteer_activities
 * 
 * Run: npm run migrate
 * Rollback: npm run migrate:rollback
 */

export async function up(knex) {
  // Drop tables in correct order (respecting foreign key constraints)
  const tablesDropped = [];
  
  if (await knex.schema.hasTable('attendance')) {
    await knex.schema.dropTable('attendance');
    tablesDropped.push('attendance');
    console.log('✅ Dropped attendance table');
  }
  
  if (await knex.schema.hasTable('chat_messages')) {
    await knex.schema.dropTable('chat_messages');
    tablesDropped.push('chat_messages');
    console.log('✅ Dropped chat_messages table');
  }
  
  if (await knex.schema.hasTable('volunteer_activities')) {
    await knex.schema.dropTable('volunteer_activities');
    tablesDropped.push('volunteer_activities');
    console.log('✅ Dropped volunteer_activities table');
  }
  
  if (await knex.schema.hasTable('activities')) {
    await knex.schema.dropTable('activities');
    tablesDropped.push('activities');
    console.log('✅ Dropped activities table');
  }
  
  if (tablesDropped.length === 0) {
    console.log('ℹ️  No tables to drop (they may have already been removed)');
  }
  
  // Update users table role enum to remove 'volunteer' option
  // Check if users table exists and has the role column
  if (await knex.schema.hasTable('users')) {
    try {
      await knex.raw(`
        ALTER TABLE users 
        MODIFY COLUMN role ENUM('user', 'manager', 'admin') DEFAULT 'user'
      `);
      console.log('✅ Updated users.role enum (removed volunteer option)');
    } catch (error) {
      // If enum is already correct, ignore the error
      if (error.message.includes('Duplicate value') || error.message.includes('already exists')) {
        console.log('ℹ️  Users.role enum already updated');
      } else {
        throw error;
      }
    }
  }
}

export async function down(knex) {
  // Recreate volunteer_activities table
  await knex.schema.createTable('volunteer_activities', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.string('title', 255).notNullable();
    table.text('description').nullable();
    table.enum('status', ['planned', 'in_progress', 'completed']).defaultTo('planned');
    table.integer('hours').defaultTo(0);
    table.integer('impactScore').defaultTo(0);
    table.dateTime('date').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.index('user_id', 'idx_user');
    table.index('status', 'idx_status');
  });
  
  // Recreate chat_messages table
  await knex.schema.createTable('chat_messages', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.enum('role', ['user', 'assistant', 'system']).defaultTo('user');
    table.text('content').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.index('user_id', 'idx_user');
    table.index('createdAt', 'idx_createdAt');
  });
  
  // Recreate activities table
  await knex.schema.createTable('activities', (table) => {
    table.increments('id').primary();
    table.integer('owner_id').notNullable();
    table.string('title', 255).notNullable();
    table.text('description').nullable();
    table.dateTime('date').notNullable();
    table.string('location', 255).nullable();
    table.integer('slots').defaultTo(0);
    table.json('tags').nullable();
    table.enum('state', ['draft', 'open', 'closed', 'cancelled']).defaultTo('draft');
    table.enum('status', ['upcoming', 'ongoing', 'completed', 'cancelled']).defaultTo('upcoming');
    table.json('participants').nullable();
    table.json('mediaUrls').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    
    table.foreign('owner_id').references('id').inTable('users').onDelete('CASCADE');
    table.index('owner_id', 'idx_owner');
    table.index('date', 'idx_date');
    table.index('state', 'idx_state');
    table.index('status', 'idx_status');
  });
  
  // Recreate attendance table
  await knex.schema.createTable('attendance', (table) => {
    table.increments('id').primary();
    table.integer('activity_id').notNullable();
    table.integer('user_id').notNullable();
    table.enum('status', ['present', 'absent']).notNullable();
    table.integer('recordedBy_id').notNullable();
    table.text('notes').nullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    
    table.foreign('activity_id').references('id').inTable('activities').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('recordedBy_id').references('id').inTable('users').onDelete('CASCADE');
    table.index(['activity_id', 'user_id'], 'idx_activity_user');
    table.index('user_id', 'idx_user');
    table.unique(['activity_id', 'user_id'], 'unique_attendance');
  });
  
  // Restore volunteer role option
  await knex.raw(`
    ALTER TABLE users 
    MODIFY COLUMN role ENUM('user', 'manager', 'admin', 'volunteer') DEFAULT 'user'
  `);
  
  console.log('✅ Recreated removed tables');
}

