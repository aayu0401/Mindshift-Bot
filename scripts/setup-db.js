#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://mindshiftr_user:mindshiftr_password@localhost:5432/mindshiftr';
  
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  try {
    console.log('🗄️  Setting up MindshiftR database...');
    
    // Read and execute the init script
    const initScriptPath = path.join(__dirname, 'init-db.sql');
    const initScript = fs.readFileSync(initScriptPath, 'utf8');
    
    await pool.query(initScript);
    
    console.log('✅ Database setup completed successfully!');
    console.log('📊 Tables created: users, user_sessions, journal_entries, screening_results, chat_conversations, mood_logs, wellness_sessions, vitals_data, user_streaks, analytics_events, feedback');
    console.log('🔍 Indexes created for performance optimization');
    console.log('🧠 Stored procedures and views created');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
