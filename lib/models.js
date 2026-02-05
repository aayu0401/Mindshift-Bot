import { query } from './db.js';

// Journal Entry Model
export const JournalEntry = {
  // Create a new journal entry
  async create(userId, entryData) {
    const {
      content,
      category = 'freeWrite',
      prompt,
      mood,
      tags = [],
      sentiment,
      detectedEmotions = [],
      insights = []
    } = entryData;

    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    const result = await query(
      `INSERT INTO journal_entries 
       (user_id, content, category, prompt, mood, tags, sentiment_score, detected_emotions, insights, word_count, read_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id, created_at, word_count, sentiment_score, detected_emotions, insights`,
      [
        userId, content, category, prompt, mood, tags,
        sentiment?.score || 0, detectedEmotions, insights, wordCount, readTime
      ]
    );

    return result.rows[0];
  },

  // Get user's journal entries
  async getByUserId(userId, limit = 20, offset = 0) {
    const result = await query(
      `SELECT id, content, category, prompt, mood, tags, sentiment_score, detected_emotions, 
              insights, word_count, read_time, created_at, updated_at
       FROM journal_entries 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  },

  // Get single entry by ID
  async getById(userId, entryId) {
    const result = await query(
      `SELECT id, content, category, prompt, mood, tags, sentiment_score, detected_emotions, 
              insights, word_count, read_time, created_at, updated_at
       FROM journal_entries 
       WHERE id = $1 AND user_id = $2`,
      [entryId, userId]
    );

    return result.rows[0] || null;
  },

  // Delete an entry
  async delete(userId, entryId) {
    const result = await query(
      'DELETE FROM journal_entries WHERE id = $1 AND user_id = $2 RETURNING id',
      [entryId, userId]
    );

    return result.rows.length > 0;
  },

  // Get entries by category
  async getByCategory(userId, category, limit = 10) {
    const result = await query(
      `SELECT id, content, category, mood, sentiment_score, detected_emotions, created_at
       FROM journal_entries 
       WHERE user_id = $1 AND category = $2 
       ORDER BY created_at DESC 
       LIMIT $3`,
      [userId, category, limit]
    );

    return result.rows;
  }
};

// Screening Result Model
export const ScreeningResult = {
  // Create a new screening result
  async create(userId, screeningData) {
    const {
      type,
      instrumentName,
      score,
      maxScore,
      percentage,
      severity,
      clinicalRecommendation,
      personalizedRecommendations = [],
      responseDetails = []
    } = screeningData;

    const result = await query(
      `INSERT INTO screening_results 
       (user_id, screening_type, instrument_name, score, max_score, percentage, 
        severity, clinical_recommendation, personalized_recommendations, response_details)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, screening_type, score, severity, created_at`,
      [
        userId, type, instrumentName, score, maxScore, percentage,
        severity, clinicalRecommendation, personalizedRecommendations, responseDetails
      ]
    );

    return result.rows[0];
  },

  // Get user's screening results
  async getByUserId(userId, limit = 20, offset = 0) {
    const result = await query(
      `SELECT id, screening_type, instrument_name, score, max_score, percentage, 
              severity, clinical_recommendation, personalized_recommendations, created_at
       FROM screening_results 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  },

  // Get latest result by type
  async getLatestByType(userId, screeningType) {
    const result = await query(
      `SELECT id, screening_type, score, severity, created_at
       FROM screening_results 
       WHERE user_id = $1 AND screening_type = $2 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId, screeningType]
    );

    return result.rows[0] || null;
  }
};

// Chat Conversation Model
export const ChatConversation = {
  // Create a new conversation message
  async create(userId, conversationData) {
    const {
      sessionId,
      userMessage,
      botResponse,
      sentiment,
      intent,
      style,
      suggestedTasks = [],
      suggestedScreening,
      isCrisis = false
    } = conversationData;

    const result = await query(
      `INSERT INTO chat_conversations 
       (user_id, session_id, user_message, bot_response, sentiment_score, intent, style, 
        suggested_tasks, suggested_screening, is_crisis)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id, created_at`,
      [
        userId, sessionId, userMessage, botResponse, sentiment?.score || 0,
        intent, style, suggestedTasks, suggestedScreening, isCrisis
      ]
    );

    return result.rows[0];
  },

  // Get conversation history for a session
  async getSessionHistory(userId, sessionId, limit = 50) {
    const result = await query(
      `SELECT id, user_message, bot_response, sentiment_score, intent, style, 
              suggested_tasks, suggested_screening, is_crisis, created_at
       FROM chat_conversations 
       WHERE user_id = $1 AND session_id = $2 
       ORDER BY created_at ASC 
       LIMIT $3`,
      [userId, sessionId, limit]
    );

    return result.rows;
  },

  // Get recent conversations
  async getRecent(userId, limit = 10) {
    const result = await query(
      `SELECT DISTINCT session_id, 
              MAX(created_at) as last_message,
              COUNT(*) as message_count
       FROM chat_conversations 
       WHERE user_id = $1 
       GROUP BY session_id 
       ORDER BY last_message DESC 
       LIMIT $2`,
      [userId, limit]
    );

    return result.rows;
  }
};

// Mood Log Model
export const MoodLog = {
  // Create a new mood log
  async create(userId, moodData) {
    const { mood, intensity = 1, context } = moodData;

    const result = await query(
      `INSERT INTO mood_logs (user_id, mood, intensity, context)
       VALUES ($1, $2, $3, $4)
       RETURNING id, mood, intensity, context, created_at`,
      [userId, mood, intensity, context]
    );

    return result.rows[0];
  },

  // Get mood history
  async getByUserId(userId, limit = 30, offset = 0) {
    const result = await query(
      `SELECT id, mood, intensity, context, created_at
       FROM mood_logs 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  },

  // Get mood trends for analytics
  async getTrends(userId, days = 7) {
    const result = await query(
      `SELECT DATE(created_at) as date, 
              AVG(intensity) as avg_intensity,
              COUNT(*) as entry_count
       FROM mood_logs 
       WHERE user_id = $1 
         AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [userId]
    );

    return result.rows;
  }
};

// Wellness Session Model
export const WellnessSession = {
  // Create a new wellness session
  async create(userId, sessionData) {
    const { sessionType, duration, pointsEarned = 0 } = sessionData;

    const result = await query(
      `INSERT INTO wellness_sessions (user_id, session_type, duration, points_earned)
       VALUES ($1, $2, $3, $4)
       RETURNING id, session_type, duration, points_earned, completed_at`,
      [userId, sessionType, duration, pointsEarned]
    );

    return result.rows[0];
  },

  // Get user's wellness sessions
  async getByUserId(userId, limit = 50, offset = 0) {
    const result = await query(
      `SELECT id, session_type, duration, points_earned, completed_at
       FROM wellness_sessions 
       WHERE user_id = $1 
       ORDER BY completed_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  },

  // Get session statistics
  async getStats(userId, days = 30) {
    const result = await query(
      `SELECT session_type, 
              COUNT(*) as session_count,
              AVG(duration) as avg_duration,
              SUM(points_earned) as total_points
       FROM wellness_sessions 
       WHERE user_id = $1 
         AND completed_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY session_type
       ORDER BY session_count DESC`,
      [userId]
    );

    return result.rows;
  }
};

// Vitals Data Model
export const VitalsData = {
  // Create new vitals data
  async create(userId, vitalsData) {
    const {
      hrv,
      restingHR,
      sleepHours,
      sleepQuality,
      deepSleepPercent,
      steps,
      activeMinutes,
      respiratoryRate,
      sleepOnsetLatency,
      morningHRV,
      eveningHRV,
      sleepMidpoint,
      wellnessScore,
      detectedPatterns = [],
      alerts = [],
      recommendations = []
    } = vitalsData;

    const result = await query(
      `INSERT INTO vitals_data 
       (user_id, hrv, resting_hr, sleep_hours, sleep_quality, deep_sleep_percent, 
        steps, active_minutes, respiratory_rate, sleep_onset_latency, morning_hrv, 
        evening_hrv, sleep_midpoint, wellness_score, detected_patterns, alerts, recommendations)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING id, wellness_score, detected_patterns, alerts, recommendations, recorded_at`,
      [
        userId, hrv, restingHR, sleepHours, sleepQuality, deepSleepPercent,
        steps, activeMinutes, respiratoryRate, sleepOnsetLatency, morningHRV,
        eveningHRV, sleepMidpoint, wellnessScore, detectedPatterns, alerts, recommendations
      ]
    );

    return result.rows[0];
  },

  // Get recent vitals data
  async getRecent(userId, limit = 30, offset = 0) {
    const result = await query(
      `SELECT id, hrv, resting_hr, sleep_hours, sleep_quality, deep_sleep_percent, 
              steps, active_minutes, respiratory_rate, wellness_score, detected_patterns, 
              alerts, recommendations, recorded_at
       FROM vitals_data 
       WHERE user_id = $1 
       ORDER BY recorded_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  },

  // Get vitals trends
  async getTrends(userId, days = 7) {
    const result = await query(
      `SELECT DATE(recorded_at) as date,
              AVG(wellness_score) as avg_wellness,
              AVG(hrv) as avg_hrv,
              AVG(resting_hr) as avg_resting_hr,
              AVG(sleep_hours) as avg_sleep,
              AVG(steps) as avg_steps
       FROM vitals_data 
       WHERE user_id = $1 
         AND recorded_at >= CURRENT_DATE - INTERVAL '${days} days'
       GROUP BY DATE(recorded_at)
       ORDER BY date ASC`,
      [userId]
    );

    return result.rows;
  }
};

// User Streak Model
export const UserStreak = {
  // Get user streak
  async getByUserId(userId) {
    const result = await query(
      'SELECT current_streak, longest_streak, last_active FROM user_streaks WHERE user_id = $1',
      [userId]
    );

    return result.rows[0] || { currentStreak: 0, longestStreak: 0, lastActive: null };
  },

  // Update streak
  async update(userId, currentStreak, longestStreak) {
    const result = await query(
      `UPDATE user_streaks 
       SET current_streak = $1, longest_streak = $2, last_active = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
       RETURNING current_streak, longest_streak, last_active`,
      [userId, currentStreak, longestStreak]
    );

    return result.rows[0];
  },

  // Increment streak
  async increment(userId) {
    const result = await query(
      `UPDATE user_streaks 
       SET current_streak = current_streak + 1,
           longest_streak = GREATEST(longest_streak, current_streak + 1),
           last_active = CURRENT_DATE,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
       RETURNING current_streak, longest_streak, last_active`,
      [userId]
    );

    return result.rows[0];
  },

  // Reset streak
  async reset(userId) {
    const result = await query(
      `UPDATE user_streaks 
       SET current_streak = 1, last_active = CURRENT_DATE, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1
       RETURNING current_streak, longest_streak, last_active`,
      [userId]
    );

    return result.rows[0];
  }
};
