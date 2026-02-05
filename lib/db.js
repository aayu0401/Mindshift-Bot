import { Pool } from 'pg';

// Database connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize database tables
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE,
        username VARCHAR(50) UNIQUE,
        password_hash VARCHAR(255),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        avatar_url TEXT,
        preferences JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )
    `);

    // User sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Journal entries table
    await client.query(`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'freeWrite',
        prompt TEXT,
        mood VARCHAR(50),
        tags TEXT[],
        sentiment_score INTEGER,
        detected_emotions TEXT[],
        insights JSONB DEFAULT '[]',
        word_count INTEGER,
        read_time INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Screening results table
    await client.query(`
      CREATE TABLE IF NOT EXISTS screening_results (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        screening_type VARCHAR(50) NOT NULL,
        instrument_name VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL,
        max_score INTEGER NOT NULL,
        percentage INTEGER NOT NULL,
        severity VARCHAR(50) NOT NULL,
        clinical_recommendation TEXT,
        personalized_recommendations JSONB DEFAULT '[]',
        response_details JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Chat conversations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_conversations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        session_id VARCHAR(255),
        user_message TEXT NOT NULL,
        bot_response TEXT NOT NULL,
        sentiment_score INTEGER,
        intent VARCHAR(100),
        style VARCHAR(50),
        suggested_tasks JSONB DEFAULT '[]',
        suggested_screening JSONB,
        is_crisis BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Mood logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS mood_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        mood VARCHAR(50) NOT NULL,
        intensity INTEGER DEFAULT 1,
        context TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Wellness sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS wellness_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        session_type VARCHAR(50) NOT NULL,
        duration INTEGER,
        points_earned INTEGER DEFAULT 0,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Vitals data table
    await client.query(`
      CREATE TABLE IF NOT EXISTS vitals_data (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        hrv DECIMAL(5,2),
        resting_hr DECIMAL(5,2),
        sleep_hours DECIMAL(4,2),
        sleep_quality DECIMAL(5,2),
        deep_sleep_percent DECIMAL(5,2),
        steps INTEGER,
        active_minutes INTEGER,
        respiratory_rate DECIMAL(4,2),
        sleep_onset_latency DECIMAL(5,2),
        morning_hrv DECIMAL(5,2),
        evening_hrv DECIMAL(5,2),
        sleep_midpoint DECIMAL(4,2),
        wellness_score DECIMAL(5,2),
        detected_patterns JSONB DEFAULT '[]',
        alerts JSONB DEFAULT '[]',
        recommendations JSONB DEFAULT '[]',
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User streaks table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_streaks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_active DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Analytics events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        event_type VARCHAR(50) NOT NULL,
        event_data JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Feedback table
    await client.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        message_id UUID,
        feedback_type VARCHAR(20) NOT NULL, -- 'up' or 'down'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at DESC)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_screening_results_user_id ON screening_results(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_chat_conversations_session_id ON chat_conversations(session_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_mood_logs_user_id ON mood_logs(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_vitals_data_user_id ON vitals_data(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id)');

    await client.query('COMMIT');
    console.log('Database initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Helper function to execute queries with error handling
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', { text, error });
    throw error;
  }
}

export { pool, query, initializeDatabase };
