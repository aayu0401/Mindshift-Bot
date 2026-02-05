import { NextResponse } from 'next/server';

/**
 * ============================================
 * MINDSHIFTR - USER ANALYTICS API
 * Track and analyze user mental health patterns
 * ============================================
 */

// Mock data store (in production, use a real database)
let analyticsStore = {
    moodEntries: [],
    sessionsCompleted: [],
    streakData: {},
    wellnessMetrics: {}
};

// ============================================
// POST - Log Analytics Event
// ============================================
export async function POST(req) {
    try {
        const body = await req.json();
        const { eventType, data, userId = 'anonymous', timestamp = new Date().toISOString() } = body;

        const event = {
            id: `evt_${Date.now()}`,
            eventType,
            data,
            userId,
            timestamp
        };

        switch (eventType) {
            case 'mood_log':
                analyticsStore.moodEntries.push({
                    ...event,
                    mood: data.mood,
                    intensity: data.intensity || 1,
                    context: data.context || null
                });
                break;

            case 'session_complete':
                analyticsStore.sessionsCompleted.push({
                    ...event,
                    sessionType: data.sessionType,
                    duration: data.duration,
                    pointsEarned: data.pointsEarned
                });
                break;

            case 'streak_update':
                analyticsStore.streakData[userId] = {
                    currentStreak: data.streak,
                    lastActive: timestamp,
                    longestStreak: Math.max(
                        analyticsStore.streakData[userId]?.longestStreak || 0,
                        data.streak
                    )
                };
                break;

            case 'wellness_metric':
                if (!analyticsStore.wellnessMetrics[userId]) {
                    analyticsStore.wellnessMetrics[userId] = [];
                }
                analyticsStore.wellnessMetrics[userId].push({
                    ...event,
                    metric: data.metric,
                    value: data.value,
                    category: data.category
                });
                break;

            default:
                console.log(`[Analytics] Unhandled event type: ${eventType}`);
        }

        return NextResponse.json({
            success: true,
            eventId: event.id,
            message: `Event '${eventType}' logged successfully`
        });

    } catch (error) {
        console.error('[Analytics API Error]:', error);
        return NextResponse.json({ error: 'Failed to log analytics' }, { status: 500 });
    }
}

// ============================================
// GET - Retrieve Analytics Summary
// ============================================
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId') || 'anonymous';
        const period = searchParams.get('period') || '7d';

        // Calculate date range
        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case '24h':
                startDate.setHours(startDate.getHours() - 24);
                break;
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
            default:
                startDate.setDate(startDate.getDate() - 7);
        }

        // Filter mood entries by date range
        const recentMoods = analyticsStore.moodEntries.filter(
            entry => new Date(entry.timestamp) >= startDate
        );

        // Calculate mood average
        const moodValues = {
            'great': 5, 'good': 4, 'okay': 3, 'neutral': 3,
            'meh': 2, 'low': 2, 'bad': 1, 'awful': 1, 'struggling': 1
        };

        const moodSum = recentMoods.reduce((sum, entry) => {
            return sum + (moodValues[entry.mood?.toLowerCase()] || 3);
        }, 0);

        const averageMood = recentMoods.length > 0 ? (moodSum / recentMoods.length).toFixed(2) : null;

        // Filter sessions by date range
        const recentSessions = analyticsStore.sessionsCompleted.filter(
            session => new Date(session.timestamp) >= startDate
        );

        // Calculate session stats
        const totalSessions = recentSessions.length;
        const totalMinutes = recentSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        const totalPoints = recentSessions.reduce((sum, s) => sum + (s.pointsEarned || 0), 0);

        // Session breakdown by type
        const sessionsByType = recentSessions.reduce((acc, session) => {
            const type = session.sessionType || 'unknown';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        // Get streak data
        const streakInfo = analyticsStore.streakData[userId] || {
            currentStreak: 0,
            longestStreak: 0,
            lastActive: null
        };

        // Wellness score calculation (0-100)
        let wellnessScore = 50; // Base score
        if (averageMood) wellnessScore += (parseFloat(averageMood) - 3) * 10;
        if (streakInfo.currentStreak > 0) wellnessScore += Math.min(streakInfo.currentStreak * 2, 20);
        if (totalSessions > 0) wellnessScore += Math.min(totalSessions * 2, 20);
        wellnessScore = Math.max(0, Math.min(100, Math.round(wellnessScore)));

        return NextResponse.json({
            userId,
            period,
            summary: {
                wellnessScore,
                averageMood: averageMood ? parseFloat(averageMood) : null,
                totalMoodLogs: recentMoods.length,
                totalSessions,
                totalMinutes,
                totalPoints,
                currentStreak: streakInfo.currentStreak,
                longestStreak: streakInfo.longestStreak
            },
            breakdown: {
                sessionsByType,
                moodTrend: recentMoods.slice(-7).map(m => ({
                    mood: m.mood,
                    timestamp: m.timestamp
                }))
            },
            insights: generateInsights(averageMood, totalSessions, streakInfo.currentStreak),
            generatedAt: now.toISOString()
        });

    } catch (error) {
        console.error('[Analytics API Error]:', error);
        return NextResponse.json({ error: 'Failed to retrieve analytics' }, { status: 500 });
    }
}

// ============================================
// INSIGHTS GENERATOR
// ============================================
function generateInsights(avgMood, sessionCount, streak) {
    const insights = [];

    if (avgMood && avgMood < 2.5) {
        insights.push({
            type: 'mood_alert',
            priority: 'high',
            message: "Your mood has been lower than usual. Consider reaching out to a professional or using our crisis resources.",
            action: '/crisis'
        });
    } else if (avgMood && avgMood >= 4) {
        insights.push({
            type: 'positive',
            priority: 'low',
            message: "Your mood has been great! Keep up the positive habits.",
            action: null
        });
    }

    if (sessionCount === 0) {
        insights.push({
            type: 'engagement',
            priority: 'medium',
            message: "You haven't completed any wellness sessions recently. Even 2 minutes of breathing can help.",
            action: '/tasks/breathing'
        });
    }

    if (streak >= 7) {
        insights.push({
            type: 'achievement',
            priority: 'low',
            message: `Amazing! You're on a ${streak}-day streak! Consistency is key to mental wellness.`,
            action: null
        });
    } else if (streak === 0) {
        insights.push({
            type: 'motivation',
            priority: 'medium',
            message: "Start fresh today! Complete one task to begin your streak.",
            action: '/dashboard'
        });
    }

    return insights;
}
