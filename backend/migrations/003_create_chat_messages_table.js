/**
 * Migration: Create chat_messages table
 * Created: For AI chat functionality
 * 
 * Run: npm run migrate
 * Rollback: npm run migrate:rollback
 */

export async function up(knex) {
  // Check if table already exists
  const exists = await knex.schema.hasTable('chat_messages');
  
  if (exists) {
    console.log('⚠️  chat_messages table already exists, skipping creation');
    return;
  }
  
  await knex.schema.createTable('chat_messages', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.string('conversation_id', 255).nullable();
    table.enum('role', ['user', 'assistant']).notNullable();
    table.text('content').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    
    // Foreign key constraint
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    
    // Indexes for better query performance
    table.index('user_id', 'idx_chat_user_id');
    table.index('conversation_id', 'idx_chat_conversation_id');
    table.index('createdAt', 'idx_chat_created_at');
  });
  
  console.log('✅ Created chat_messages table');
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('chat_messages');
  console.log('✅ Dropped chat_messages table');
}

