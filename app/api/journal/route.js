import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth.js';
import { JournalEntry } from '@/lib/models.js';
import { initializeDatabase } from '@/lib/db.js';

// ============================================
// JOURNAL PROMPTS LIBRARY
// ============================================
const journalPrompts = {
    gratitude: [
        "Name 3 things you're grateful for today, no matter how small.",
        "Who in your life are you thankful for, and why?",
        "What's something good that happened recently that you might have overlooked?",
        "What simple pleasure did you enjoy today?",
        "What's a skill or ability you're grateful to have?"
    ],
    reflection: [
        "What emotions showed up for you today? Where did you feel them in your body?",
        "What would you tell your younger self about today?",
        "What's one thing you learned about yourself recently?",
        "If today had a theme, what would it be?",
        "What's something you're avoiding thinking about?"
    ],
    growth: [
        "What's a challenge you're facing, and what might it be teaching you?",
        "What would you attempt if you knew you couldn't fail?",
        "What's one small step you could take toward a goal tomorrow?",
        "What fear is holding you back right now?",
        "How have you grown in the past year?"
    ],
    anxiety: [
        "What's worrying you most right now? Write it all out without filtering.",
        "What would you tell a friend who had this same worry?",
        "What's the worst case scenario? Now, what's the most likely scenario?",
        "What's within your control about this situation? What's not?",
        "If this worry came true, what would you do to cope?"
    ],
    depression: [
        "What's one tiny thing you accomplished today, even if it seems insignificant?",
        "What would you do if you had unlimited energy right now?",
        "Who or what brings even a flicker of light to your darkness?",
        "Write a letter to yourself on your worst day. What does it say?",
        "What does your inner critic say? Now write what a compassionate friend would say instead."
    ],
    anger: [
        "What situation triggered your anger today? Describe it in detail.",
        "What boundary might have been crossed?",
        "What need of yours wasn't being met?",
        "If your anger could speak, what would it say?",
        "How might the other person have seen the same situation?"
    ],
    selfCompassion: [
        "What would you say to a beloved friend going through what you're going through?",
        "Write about a time you made a mistake. Now respond with kindness instead of criticism.",
        "What are 5 things you genuinely like about yourself?",
        "What do you need to hear right now that no one is saying?",
        "How can you show yourself love today?"
    ],
    freeWrite: [
        "Just write. Whatever comes to mind. No judgment, no editing. Go.",
        "Start with: 'Right now, I feel...' and keep writing for 5 minutes.",
        "Describe your mental state as if it were weather.",
        "Write stream of consciousness for the next 10 minutes.",
        "What's on your mind that you haven't told anyone?"
    ]
};

// ============================================
// GET - Retrieve Entries or Prompts
// ============================================
export async function GET(req) {
    try {
        // Ensure database is initialized
        await initializeDatabase();
        
        // Authenticate user
        const authHeader = req.headers.get('authorization');
        let userId = 'anonymous';
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                const user = await verifyToken(token);
                userId = user.id;
            } catch (error) {
                // Continue as anonymous if token is invalid
                console.log('Invalid token, continuing as anonymous');
            }
        }
        
        const { searchParams } = new URL(req.url);
        const action = searchParams.get('action');
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit')) || 20;

        // Get random prompt
        if (action === 'prompt') {
            const promptCategory = category ||
                Object.keys(journalPrompts)[Math.floor(Math.random() * Object.keys(journalPrompts).length)];

            const prompts = journalPrompts[promptCategory] || journalPrompts.freeWrite;
            const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

            return NextResponse.json({
                prompt: randomPrompt,
                category: promptCategory,
                allCategories: Object.keys(journalPrompts)
            });
        }

        // Get prompt categories
        if (action === 'categories') {
            return NextResponse.json({
                categories: Object.entries(journalPrompts).map(([key, prompts]) => ({
                    id: key,
                    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
                    promptCount: prompts.length
                }))
            });
        }

        // Get user's journal entries
        const userEntries = await JournalEntry.getByUserId(userId, limit);
        
        return NextResponse.json({
            entries: userEntries,
            totalCount: userEntries.length,
            categories: [...new Set(userEntries.map(e => e.category).filter(Boolean))]
        });

    } catch (error) {
        console.error('[Journal API Error]:', error);
        return NextResponse.json({ error: 'Failed to retrieve journal data' }, { status: 500 });
    }
}

// ============================================
// POST - Create New Entry
// ============================================
export async function POST(req) {
    try {
        // Ensure database is initialized
        await initializeDatabase();
        
        // Authenticate user
        const authHeader = req.headers.get('authorization');
        let userId = 'anonymous';
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                const user = await verifyToken(token);
                userId = user.id;
            } catch (error) {
                // Continue as anonymous if token is invalid
                console.log('Invalid token, continuing as anonymous');
            }
        }
        
        const body = await req.json();
        const {
            content,
            category = 'freeWrite',
            prompt = null,
            mood = null,
            tags = []
        } = body;

        if (!content || typeof content !== 'string') {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        // Basic sentiment analysis
        const sentiment = analyzeJournalSentiment(content);

        // Extract emotions from text
        const detectedEmotions = extractEmotions(content);

        // Create journal entry in database
        const entry = await JournalEntry.create(userId, {
            content,
            category,
            prompt,
            mood,
            tags,
            sentiment,
            detectedEmotions,
            insights: generateJournalInsights(content, sentiment, detectedEmotions)
        });

        return NextResponse.json({
            success: true,
            entry: {
                id: entry.id,
                timestamp: entry.created_at,
                wordCount: entry.word_count,
                sentiment: entry.sentiment_score,
                detectedEmotions: entry.detected_emotions,
                insights: entry.insights
            },
            message: "Journal entry saved successfully",
            pointsEarned: 20
        });

    } catch (error) {
        console.error('[Journal API Error]:', error);
        return NextResponse.json({ error: 'Failed to save journal entry' }, { status: 500 });
    }
}

// ============================================
// DELETE - Remove Entry
// ============================================
export async function DELETE(req) {
    try {
        // Ensure database is initialized
        await initializeDatabase();
        
        // Authenticate user
        const authHeader = req.headers.get('authorization');
        let userId = 'anonymous';
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                const user = await verifyToken(token);
                userId = user.id;
            } catch (error) {
                return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
            }
        }
        
        const { searchParams } = new URL(req.url);
        const entryId = searchParams.get('id');

        if (!entryId) {
            return NextResponse.json({ error: 'Entry ID required' }, { status: 400 });
        }

        const success = await JournalEntry.delete(userId, entryId);

        if (!success) {
            return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Entry deleted successfully'
        });

    } catch (error) {
        console.error('[Journal API Error]:', error);
        return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
    }
}

// ============================================
// SENTIMENT ANALYSIS (Simple Rule-Based)
// ============================================
function analyzeJournalSentiment(text) {
    const positiveWords = [
        'happy', 'grateful', 'thankful', 'joy', 'love', 'excited', 'hopeful',
        'peaceful', 'calm', 'content', 'proud', 'accomplished', 'blessed',
        'amazing', 'wonderful', 'great', 'good', 'better', 'improving'
    ];

    const negativeWords = [
        'sad', 'angry', 'frustrated', 'anxious', 'worried', 'scared', 'hopeless',
        'depressed', 'lonely', 'overwhelmed', 'exhausted', 'stressed', 'hurt',
        'terrible', 'awful', 'bad', 'worse', 'hate', 'fear', 'panic'
    ];

    const lowerText = text.toLowerCase();

    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) positiveCount += matches.length;
    });

    negativeWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) negativeCount += matches.length;
    });

    const score = positiveCount - negativeCount;

    return {
        score,
        positiveCount,
        negativeCount,
        label: score > 2 ? 'positive' : score < -2 ? 'negative' : 'neutral'
    };
}

// ============================================
// EMOTION EXTRACTION
// ============================================
function extractEmotions(text) {
    const emotionKeywords = {
        anxiety: ['anxious', 'worried', 'nervous', 'panicked', 'scared', 'fear'],
        sadness: ['sad', 'depressed', 'down', 'hopeless', 'empty', 'crying'],
        anger: ['angry', 'furious', 'frustrated', 'irritated', 'annoyed', 'rage'],
        joy: ['happy', 'joyful', 'excited', 'grateful', 'thankful', 'delighted'],
        fear: ['afraid', 'terrified', 'scared', 'fearful', 'dread'],
        love: ['love', 'caring', 'affection', 'connected', 'grateful'],
        shame: ['ashamed', 'embarrassed', 'guilty', 'worthless', 'failure'],
        loneliness: ['lonely', 'isolated', 'alone', 'abandoned', 'disconnected']
    };

    const lowerText = text.toLowerCase();
    const detectedEmotions = [];

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
        const found = keywords.some(kw => lowerText.includes(kw));
        if (found) {
            detectedEmotions.push(emotion);
        }
    });

    return detectedEmotions;
}

// ============================================
// INSIGHT GENERATION
// ============================================
function generateJournalInsights(content, sentiment, emotions) {
    const insights = [];

    // Length-based insight
    const wordCount = content.split(/\s+/).length;
    if (wordCount > 200) {
        insights.push({
            type: 'observation',
            message: "You wrote quite a bit today. Extended writing often indicates processing something important."
        });
    }

    // Emotion-based insights
    if (emotions.includes('anxiety')) {
        insights.push({
            type: 'suggestion',
            message: "I noticed some anxiety in your writing. Would a breathing exercise help right now?",
            tool: '/tasks/breathing'
        });
    }

    if (emotions.includes('sadness') && sentiment.label === 'negative') {
        insights.push({
            type: 'support',
            message: "It sounds like you're going through a hard time. Remember, reaching out for support is a strength.",
            tool: '/bot'
        });
    }

    if (emotions.includes('anger')) {
        insights.push({
            type: 'suggestion',
            message: "Writing about anger can be cathartic. Consider what boundary might have been crossed.",
            tool: null
        });
    }

    if (emotions.length === 0 && sentiment.label === 'neutral') {
        insights.push({
            type: 'prompt',
            message: "Try going deeper next time. What emotion was underneath the facts you wrote about?",
            tool: null
        });
    }

    if (sentiment.label === 'positive') {
        insights.push({
            type: 'encouragement',
            message: "There's a positive tone in your writing today. That's wonderful to see!",
            tool: null
        });
    }

    return insights;
}
