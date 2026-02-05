#!/usr/bin/env node

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seedDatabase() {
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://mindshiftr_user:mindshiftr_password@localhost:5432/mindshiftr';
  
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  try {
    console.log('🌱 Seeding MindshiftR database with sample data...');
    
    // Create sample user
    const sampleUserEmail = 'demo@mindshiftr.com';
    const sampleUserPassword = await bcrypt.hash('demo123', 12);
    
    const userResult = await pool.query(
      `INSERT INTO users (email, username, password_hash, first_name, last_name, preferences)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [
        sampleUserEmail,
        'demo_user',
        sampleUserPassword,
        'Demo',
        'User',
        JSON.stringify({
          theme: 'dark',
          notifications: true,
          privacy: 'high'
        })
      ]
    );
    
    const userId = userResult.rows[0]?.id;
    
    if (userId) {
      console.log(`👤 Created sample user: ${sampleUserEmail}`);
      
      // Initialize user streak
      await pool.query(
        'INSERT INTO user_streaks (user_id, current_streak, longest_streak) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO NOTHING',
        [userId, 3, 7]
      );
      
      // Add sample journal entries
      const journalEntries = [
        {
          content: "Today was challenging at work, but I managed to use the breathing exercises when I felt overwhelmed. It's amazing how something so simple can make such a difference. I'm grateful for having learned these coping mechanisms.",
          category: 'reflection',
          mood: 'neutral',
          tags: ['work', 'breathing', 'gratitude']
        },
        {
          content: "I'm feeling really anxious about the upcoming presentation. My heart keeps racing and I can't stop thinking about all the things that could go wrong. I know this is just my anxiety talking, but it feels so real right now.",
          category: 'anxiety',
          mood: 'low',
          tags: ['anxiety', 'work', 'presentation']
        },
        {
          content: "Had a great session with the AI companion today. It helped me reframe some negative thoughts I was having about myself. I'm starting to realize that I'm much harder on myself than I would be on a friend.",
          category: 'growth',
          mood: 'good',
          tags: ['ai-companion', 'self-compassion', 'growth']
        }
      ];
      
      for (const entry of journalEntries) {
        await pool.query(
          `INSERT INTO journal_entries (user_id, content, category, mood, tags, sentiment_score, detected_emotions, insights)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            userId,
            entry.content,
            entry.category,
            entry.mood,
            entry.tags,
            Math.floor(Math.random() * 5) - 2, // Random sentiment
            ['anxiety', 'gratitude'].slice(0, Math.floor(Math.random() * 2) + 1),
            JSON.stringify([
              { type: 'observation', message: 'Sample insight for demonstration' }
            ])
          ]
        );
      }
      
      console.log('📝 Added sample journal entries');
      
      // Add sample screening results
      const screeningResults = [
        {
          type: 'phq9',
          instrumentName: 'PHQ-9 (Patient Health Questionnaire)',
          score: 8,
          maxScore: 27,
          percentage: 30,
          severity: 'mild',
          clinicalRecommendation: 'Consider wellness activities and monitoring'
        },
        {
          type: 'gad7',
          instrumentName: 'GAD-7 (Generalized Anxiety Disorder)',
          score: 12,
          maxScore: 21,
          percentage: 57,
          severity: 'moderate',
          clinicalRecommendation: 'Consider professional guidance'
        }
      ];
      
      for (const screening of screeningResults) {
        await pool.query(
          `INSERT INTO screening_results (user_id, screening_type, instrument_name, score, max_score, percentage, severity, clinical_recommendation, personalized_recommendations, response_details)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            userId,
            screening.type,
            screening.instrumentName,
            screening.score,
            screening.maxScore,
            screening.percentage,
            screening.severity,
            screening.clinicalRecommendation,
            JSON.stringify([
              { category: 'relaxation', title: 'Practice breathing exercises', tool: '/tasks/breathing' }
            ]),
            JSON.stringify([{ question: 'Sample question', response: 2, adjustedScore: 2 }])
          ]
        );
      }
      
      console.log('📊 Added sample screening results');
      
      // Add sample mood logs
      const moods = ['great', 'good', 'okay', 'neutral', 'meh', 'low'];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        await pool.query(
          `INSERT INTO mood_logs (user_id, mood, intensity, context, created_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            userId,
            moods[Math.floor(Math.random() * moods.length)],
            Math.floor(Math.random() * 3) + 1,
            'Daily mood check-in',
            date
          ]
        );
      }
      
      console.log('😊 Added sample mood logs');
      
      // Add sample wellness sessions
      const sessionTypes = ['breathing', 'grounding', 'journal', 'meditation'];
      for (let i = 0; i < 5; i++) {
        await pool.query(
          `INSERT INTO wellness_sessions (user_id, session_type, duration, points_earned)
           VALUES ($1, $2, $3, $4)`,
          [
            userId,
            sessionTypes[Math.floor(Math.random() * sessionTypes.length)],
            Math.floor(Math.random() * 15) + 5, // 5-20 minutes
            Math.floor(Math.random() * 30) + 10 // 10-40 points
          ]
        );
      }
      
      console.log('🧘 Added sample wellness sessions');
      
      // Add sample vitals data
      for (let i = 0; i < 3; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        await pool.query(
          `INSERT INTO vitals_data (user_id, hrv, resting_hr, sleep_hours, sleep_quality, steps, active_minutes, wellness_score, detected_patterns, alerts, recommendations, recorded_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            userId,
            Math.floor(Math.random() * 40) + 30, // HRV 30-70
            Math.floor(Math.random() * 20) + 60, // RHR 60-80
            Math.random() * 3 + 6, // Sleep 6-9 hours
            Math.floor(Math.random() * 30) + 70, // Sleep quality 70-100
            Math.floor(Math.random() * 8000) + 2000, // Steps 2000-10000
            Math.floor(Math.random() * 45) + 15, // Active minutes 15-60
            Math.floor(Math.random() * 30) + 60, // Wellness score 60-90
            JSON.stringify([{ pattern: 'recovery', confidence: 75 }]),
            JSON.stringify([]),
            JSON.stringify([{ type: 'maintenance', task: 'Continue current habits' }]),
            date
          ]
        );
      }
      
      console.log('💓 Added sample vitals data');
    }
    
    console.log('✅ Database seeding completed successfully!');
    console.log('🔑 Demo credentials:');
    console.log('   Email: demo@mindshiftr.com');
    console.log('   Password: demo123');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the seeding
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
