-- Initialize database with extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_journal_entries_content_gin ON journal_entries USING gin(to_tsvector('english', content));
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_message_gin ON chat_conversations USING gin(to_tsvector('english', user_message));

-- Create function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_streaks_updated_at BEFORE UPDATE ON user_streaks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for user analytics
CREATE OR REPLACE VIEW user_analytics AS
SELECT 
    u.id as user_id,
    u.username,
    u.created_at as user_created_at,
    COUNT(DISTINCT je.id) as journal_entries_count,
    COUNT(DISTINCT cr.id) as chat_messages_count,
    COUNT(DISTINCT sr.id) as screenings_count,
    COUNT(DISTINCT ml.id) as mood_logs_count,
    COUNT(DISTINCT ws.id) as wellness_sessions_count,
    COALESCE(us.current_streak, 0) as current_streak,
    COALESCE(us.longest_streak, 0) as longest_streak,
    MAX(je.created_at) as last_journal_entry,
    MAX(cr.created_at) as last_chat_message,
    MAX(ml.created_at) as last_mood_log
FROM users u
LEFT JOIN journal_entries je ON u.id = je.user_id
LEFT JOIN chat_conversations cr ON u.id = cr.user_id
LEFT JOIN screening_results sr ON u.id = sr.user_id
LEFT JOIN mood_logs ml ON u.id = ml.user_id
LEFT JOIN wellness_sessions ws ON u.id = ws.user_id
LEFT JOIN user_streaks us ON u.id = us.user_id
GROUP BY u.id, u.username, u.created_at, us.current_streak, us.longest_streak;

-- Create function for sentiment analysis (placeholder for future ML integration)
CREATE OR REPLACE FUNCTION analyze_sentiment(text_input TEXT)
RETURNS TABLE(
    positive_count INTEGER,
    negative_count INTEGER,
    score INTEGER,
    label TEXT
) AS $$
BEGIN
    -- This is a simplified sentiment analysis
    -- In production, you'd want to use a proper NLP library or external service
    RETURN QUERY
    SELECT 
        (array_length(regexp_split_to_array(lower(text_input), '\s+(happy|joy|love|great|good|wonderful|amazing|thankful|grateful)'), 1) - 1) as positive_count,
        (array_length(regexp_split_to_array(lower(text_input), '\s+(sad|angry|bad|terrible|hate|fear|anxious|depressed|lonely)'), 1) - 1) as negative_count,
        GREATEST(-5, LEAST(5, 
            (array_length(regexp_split_to_array(lower(text_input), '\s+(happy|joy|love|great|good|wonderful|amazing|thankful|grateful)'), 1) - 1) -
            (array_length(regexp_split_to_array(lower(text_input), '\s+(sad|angry|bad|terrible|hate|fear|anxious|depressed|lonely)'), 1) - 1)
        )) as score,
        CASE 
            WHEN GREATEST(-5, LEAST(5, 
                (array_length(regexp_split_to_array(lower(text_input), '\s+(happy|joy|love|great|good|wonderful|amazing|thankful|grateful)'), 1) - 1) -
                (array_length(regexp_split_to_array(lower(text_input), '\s+(sad|angry|bad|terrible|hate|fear|anxious|depressed|lonely)'), 1) - 1)
            )) > 2 THEN 'positive'
            WHEN GREATEST(-5, LEAST(5, 
                (array_length(regexp_split_to_array(lower(text_input), '\s+(happy|joy|love|great|good|wonderful|amazing|thankful|grateful)'), 1) - 1) -
                (array_length(regexp_split_to_array(lower(text_input), '\s+(sad|angry|bad|terrible|hate|fear|anxious|depressed|lonely)'), 1) - 1)
            )) < -2 THEN 'negative'
            ELSE 'neutral'
        END as label;
END;
$$ LANGUAGE plpgsql;

-- Create stored procedure for user wellness score calculation
CREATE OR REPLACE FUNCTION calculate_user_wellness_score(user_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
    wellness_score NUMERIC := 50; -- Base score
    mood_avg NUMERIC := 3;
    recent_sessions INTEGER := 0;
    current_streak INTEGER := 0;
BEGIN
    -- Get average mood score (convert mood to 1-5 scale)
    SELECT COALESCE(AVG(
        CASE mood
            WHEN 'great' THEN 5
            WHEN 'good' THEN 4
            WHEN 'okay' THEN 3
            WHEN 'neutral' THEN 3
            WHEN 'meh' THEN 2
            WHEN 'low' THEN 2
            WHEN 'bad' THEN 1
            WHEN 'awful' THEN 1
            WHEN 'struggling' THEN 1
            ELSE 3
        END
    ), 3) INTO mood_avg
    FROM mood_logs 
    WHERE user_id = user_uuid 
        AND created_at >= CURRENT_DATE - INTERVAL '7 days';
    
    -- Get recent wellness sessions
    SELECT COUNT(*) INTO recent_sessions
    FROM wellness_sessions 
    WHERE user_id = user_uuid 
        AND completed_at >= CURRENT_DATE - INTERVAL '7 days';
    
    -- Get current streak
    SELECT COALESCE(current_streak, 0) INTO current_streak
    FROM user_streaks 
    WHERE user_id = user_uuid;
    
    -- Calculate wellness score
    wellness_score := wellness_score + (mood_avg - 3) * 10;
    wellness_score := wellness_score + LEAST(recent_sessions * 2, 20);
    wellness_score := wellness_score + LEAST(current_streak * 2, 20);
    
    -- Ensure score is between 0 and 100
    wellness_score := GREATEST(0, LEAST(100, wellness_score));
    
    RETURN wellness_score;
END;
$$ LANGUAGE plpgsql;
