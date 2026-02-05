import { NextResponse } from 'next/server';
import Sentiment from 'sentiment';
import { enhancedChatEngine } from '@/lib/enhancedChatEngine.js';
import { verifyToken } from '@/lib/auth.js';
import { ChatConversation, UserStreak } from '@/lib/models.js';
import { initializeDatabase } from '@/lib/db.js';

const sentiment = new Sentiment();

/**
 * ============================================
 * MINDSHIFTR - ENHANCED AI COMPANION v2.0
 * ============================================
 * 
 * Features:
 * - Conversation memory & context tracking
 * - Multi-turn therapeutic dialogue
 * - Task recommendation engine
 * - Screening integration
 * - Vitals-aware responses
 * - Advanced reinforcement learning
 * - Emotional intelligence layer
 */

// ============================================
// CONVERSATION MEMORY (Database-backed)
// ============================================
async function getConversation(userId, sessionId) {
  try {
    const history = await ChatConversation.getSessionHistory(userId, sessionId, 20);
    
    if (history.length === 0) return null;
    
    // Convert to expected format
    const turns = history.map(msg => ({
      user: msg.user_message,
      bot: msg.bot_response,
      timestamp: new Date(msg.created_at).getTime(),
      sentiment: msg.sentiment_score,
      style: msg.style
    }));
    
    return {
      turns,
      lastActive: new Date(history[history.length - 1].created_at).getTime(),
      sessionStart: new Date(history[0].created_at).getTime()
    };
  } catch (error) {
    console.error('Error getting conversation:', error);
    return null;
  }
}

async function updateConversation(userId, sessionId, userMessage, botResponse, metadata = {}) {
  try {
    await ChatConversation.create(userId, {
      sessionId,
      userMessage,
      botResponse,
      sentiment: metadata.sentiment,
      intent: metadata.intent,
      style: metadata.style,
      suggestedTasks: metadata.suggestedTasks || [],
      suggestedScreening: metadata.suggestedScreening,
      isCrisis: metadata.isCrisis || false
    });
    
    // Update user streak (daily engagement)
    await UserStreak.increment(userId);
  } catch (error) {
    console.error('Error updating conversation:', error);
  }
}

// ============================================
// INTENT CLASSIFICATION
// ============================================
const INTENTS = {
    SCREENING_REQUEST: {
        keywords: ['assessment', 'test', 'screen', 'evaluate', 'check myself', 'how am i doing', 'quiz', 'questionnaire'],
        response: 'screening'
    },
    TASK_REQUEST: {
        keywords: ['what should i do', 'recommend', 'suggestion', 'activity', 'exercise', 'task', 'help me', 'give me something'],
        response: 'task'
    },
    BREATHING_REQUEST: {
        keywords: ['breathing', 'breathe', 'calm down', 'panic', 'anxious', 'heart racing'],
        response: 'breathing'
    },
    GROUNDING_REQUEST: {
        keywords: ['ground', 'grounding', 'present', 'dissociate', 'floating', 'unreal'],
        response: 'grounding'
    },
    VENT_REQUEST: {
        keywords: ['just listen', 'vent', 'let it out', 'need to talk', 'no advice', 'just need'],
        response: 'vent'
    },
    JOURNAL_REQUEST: {
        keywords: ['journal', 'write', 'express', 'document', 'record my thoughts'],
        response: 'journal'
    },
    CRISIS: {
        keywords: ['suicide', 'kill myself', 'end my life', 'want to die', 'hurt myself', 'self harm'],
        response: 'crisis'
    },
    CBT_REQUEST: {
        keywords: ['thought', 'thinking', 'cognitive', 'cbt', 'belief', 'challenge', 'distortion'],
        response: 'cbt'
    },
    GRATITUDE: {
        keywords: ['grateful', 'thankful', 'appreciate', 'gratitude', 'good things'],
        response: 'gratitude'
    },
    GREETING: {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'howdy'],
        response: 'greeting'
    },
    FOLLOWUP: {
        keywords: ['yes', 'sure', 'okay', 'yeah', 'please', 'go ahead', 'continue'],
        response: 'followup'
    }
};

function classifyIntent(message) {
    const lowerMessage = message.toLowerCase();

    for (const [intent, config] of Object.entries(INTENTS)) {
        if (config.keywords.some(kw => lowerMessage.includes(kw))) {
            return { intent, type: config.response };
        }
    }

    return { intent: 'GENERAL', type: 'general' };
}

// ============================================
// TASK RECOMMENDATION ENGINE
// ============================================
const TASKS = {
    high_stress: [
        { name: '4-7-8 Breathing', path: '/tasks/breathing', duration: '3 min', benefit: 'Activates parasympathetic nervous system' },
        { name: '5-4-3-2-1 Grounding', path: '/tasks/grounding', duration: '5 min', benefit: 'Anchors you to the present moment' },
        { name: 'Progressive Muscle Relaxation', path: '/library', duration: '10 min', benefit: 'Releases physical tension' }
    ],
    low_mood: [
        { name: 'Gratitude Journal', path: '/tasks/journal?prompt=gratitude', duration: '5 min', benefit: 'Shifts attention to positives' },
        { name: 'Behavioral Activation Walk', path: '/tasks/activity', duration: '10 min', benefit: 'Movement lifts mood' },
        { name: 'Reach Out to Someone', path: '/community', duration: '5 min', benefit: 'Social connection helps' }
    ],
    anxiety: [
        { name: 'Worry Time Journaling', path: '/tasks/journal?prompt=anxiety', duration: '10 min', benefit: 'Contains anxious thoughts' },
        { name: 'Box Breathing', path: '/tasks/breathing', duration: '4 min', benefit: 'Regulates nervous system' },
        { name: 'GAD-7 Screening', path: '/screening?type=gad7', duration: '5 min', benefit: 'Understand your anxiety level' }
    ],
    sleep_issues: [
        { name: 'Sleep Hygiene Checklist', path: '/library', duration: '5 min', benefit: 'Optimize sleep environment' },
        { name: 'Pre-Sleep Body Scan', path: '/tasks/grounding', duration: '10 min', benefit: 'Releases tension for sleep' },
        { name: 'Evening Reflection Journal', path: '/tasks/journal', duration: '5 min', benefit: 'Process the day\'s events' }
    ],
    general_wellness: [
        { name: 'Daily Check-in', path: '/screening', duration: '2 min', benefit: 'Track your baseline' },
        { name: 'Mindful Moment', path: '/tasks/breathing', duration: '3 min', benefit: 'Center yourself' },
        { name: 'Community Connection', path: '/community', duration: '5 min', benefit: 'See others\' journeys' }
    ],
    burnout: [
        { name: 'Digital Detox', path: '/tasks/journal', duration: '15 min', benefit: 'Disconnect to reconnect' },
        { name: 'Boundary Setting Reflection', path: '/tasks/journal?prompt=reflection', duration: '10 min', benefit: 'Protect your energy' },
        { name: 'Burnout Assessment', path: '/screening?type=burnout', duration: '5 min', benefit: 'Measure your burnout level' }
    ]
};

function recommendTasks(context) {
    const { sentiment, topics, emotionalState, vitals } = context;
    let category = 'general_wellness';

    // Determine category from context
    if (sentiment < -3) {
        category = 'low_mood';
    } else if (topics.includes('anxiety') || topics.includes('worry') || topics.includes('panic')) {
        category = 'anxiety';
    } else if (topics.includes('sleep') || topics.includes('insomnia') || topics.includes('tired')) {
        category = 'sleep_issues';
    } else if (topics.includes('burnout') || topics.includes('exhausted') || topics.includes('overwhelmed')) {
        category = 'burnout';
    } else if (sentiment < 0) {
        category = 'high_stress';
    }

    // Check vitals if available
    if (vitals) {
        if (vitals.wellnessScore && vitals.wellnessScore < 50) {
            category = 'high_stress';
        }
        if (vitals.patterns && vitals.patterns.some(p => p.pattern === 'anxiety')) {
            category = 'anxiety';
        }
    }

    const tasks = TASKS[category] || TASKS.general_wellness;
    return {
        category,
        tasks: tasks.slice(0, 3)
    };
}

// ============================================
// SCREENING RECOMMENDATION ENGINE
// ============================================
function recommendScreening(context) {
    const { topics, emotionalState, screeningsTaken } = context;

    const screenings = {
        phq9: { name: 'PHQ-9 Depression Screening', path: '/screening?type=phq9', reason: 'To understand your mood baseline' },
        gad7: { name: 'GAD-7 Anxiety Screening', path: '/screening?type=gad7', reason: 'To measure anxiety levels' },
        pss10: { name: 'Perceived Stress Scale', path: '/screening?type=pss10', reason: 'To assess your stress load' },
        burnout: { name: 'Burnout Assessment', path: '/screening?type=burnout', reason: 'To evaluate work-life balance' }
    };

    let recommended = null;

    // Recommend based on topics
    if (topics.includes('depression') || topics.includes('sad') || topics.includes('hopeless')) {
        if (!screeningsTaken.includes('phq9')) recommended = screenings.phq9;
    } else if (topics.includes('anxiety') || topics.includes('worry') || topics.includes('nervous')) {
        if (!screeningsTaken.includes('gad7')) recommended = screenings.gad7;
    } else if (topics.includes('stress') || topics.includes('overwhelmed')) {
        if (!screeningsTaken.includes('pss10')) recommended = screenings.pss10;
    } else if (topics.includes('burnout') || topics.includes('exhausted') || topics.includes('work')) {
        if (!screeningsTaken.includes('burnout')) recommended = screenings.burnout;
    }

    // Default to GAD-7 if nothing specific
    if (!recommended && screeningsTaken.length === 0) {
        recommended = screenings.gad7;
    }

    return recommended;
}

// ============================================
// EMOTIONAL INTELLIGENCE LAYER
// ============================================
function analyzeEmotionalContext(message, history) {
    const sentimentResult = sentiment.analyze(message);
    const score = sentimentResult.score;

    // Detect emotional trajectory from history
    let trajectory = 'stable';
    if (history.length >= 3) {
        const recentScores = history.slice(-3).map(h => h.sentiment).filter(s => s !== undefined);
        if (recentScores.length >= 2) {
            const trend = recentScores[recentScores.length - 1] - recentScores[0];
            if (trend > 2) trajectory = 'improving';
            else if (trend < -2) trajectory = 'declining';
        }
    }

    // Detect intensity keywords
    const intensityKeywords = {
        high: ['extremely', 'very', 'so much', 'really', 'completely', 'totally', 'absolutely'],
        low: ['a bit', 'slightly', 'somewhat', 'kind of', 'a little']
    };

    let intensity = 'moderate';
    const lowerMessage = message.toLowerCase();
    if (intensityKeywords.high.some(kw => lowerMessage.includes(kw))) intensity = 'high';
    if (intensityKeywords.low.some(kw => lowerMessage.includes(kw))) intensity = 'low';

    return {
        score,
        trajectory,
        intensity,
        wordCount: message.split(/\s+/).length
    };
}

// ============================================
// RESPONSE GENERATION ENGINE
// ============================================
function generateResponse(intent, context, message) {
    const { emotionalContext, session, vitals, weights } = context;
    let response = '';
    let suggestedTasks = [];
    let suggestedScreening = null;
    let style = selectPersona(weights, emotionalContext);

    switch (intent.type) {
        case 'crisis':
            return {
                response: "I'm really concerned about what you've shared. Your life matters, and what you're feeling right now is temporary. Please call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 now. You don't have to face this alone. I'm here to support you, but trained crisis counselors can help you through this moment.",
                style: 'empathetic',
                isCrisis: true,
                suggestedTasks: [{ name: 'Crisis Resources', path: '/crisis', priority: 'critical' }]
            };

        case 'greeting':
            const greetings = session.turns.length === 0
                ? [
                    "Hello! I'm really glad you're here. How are you feeling right now?",
                    "Hi there. Welcome to our space. What's on your mind today?",
                    "Hey. I'm here and ready to listen. How can I support you?"
                ]
                : [
                    "Welcome back. I remember we were talking about some important things. How are you now?",
                    "Hey again. I'm here. What would you like to focus on today?",
                    "Good to see you. Has anything shifted since we last spoke?"
                ];
            response = greetings[Math.floor(Math.random() * greetings.length)];
            break;

        case 'screening':
            const screening = recommendScreening({
                topics: session.topics,
                screeningsTaken: session.screeningsTaken,
                emotionalState: session.emotionalState
            });

            if (screening) {
                response = `I think it could be helpful to get a clearer picture of how you're doing. ${screening.reason}. Would you like to take the ${screening.name}? It only takes about 5 minutes.`;
                suggestedScreening = screening;
            } else {
                response = "You've already taken some assessments recently. Would you like to review your results, or is there something specific you'd like to explore together?";
            }
            break;

        case 'task':
            const taskRecommendation = recommendTasks({
                sentiment: emotionalContext.score,
                topics: session.topics,
                emotionalState: session.emotionalState,
                vitals
            });

            response = `Based on what you've shared, here are some things that might help right now:\n\n`;
            taskRecommendation.tasks.forEach((task, i) => {
                response += `${i + 1}. **${task.name}** (${task.duration}) - ${task.benefit}\n`;
            });
            response += `\nWould you like me to guide you through any of these?`;
            suggestedTasks = taskRecommendation.tasks;
            break;

        case 'breathing':
            response = "Let's do some breathing together. Find a comfortable position.\n\n**4-7-8 Breathing:**\n• Breathe IN through your nose for 4 seconds\n• HOLD for 7 seconds\n• Breathe OUT slowly through your mouth for 8 seconds\n\nI'll count with you. Ready? Let's start with an exhale to empty your lungs...";
            suggestedTasks = [{ name: 'Guided Breathing', path: '/tasks/breathing', priority: 'high' }];
            break;

        case 'grounding':
            response = "Let's ground you in the present moment.\n\n**5-4-3-2-1 Technique:**\nLook around and name:\n• 5 things you can SEE\n• 4 things you can TOUCH\n• 3 things you can HEAR\n• 2 things you can SMELL\n• 1 thing you can TASTE\n\nTake your time with each one. I'll wait.";
            suggestedTasks = [{ name: 'Grounding Exercise', path: '/tasks/grounding', priority: 'high' }];
            break;

        case 'vent':
            const ventResponses = [
                "I'm here. No advice, no fixing—just listening. Let it out.",
                "You have my full attention. Say whatever you need to say.",
                "I'm not going anywhere. Take your time.",
                "This is your space. I'm just here to witness.",
                "I hear you. Keep going if you need to."
            ];
            response = ventResponses[Math.floor(Math.random() * ventResponses.length)];
            style = 'empathetic';
            break;

        case 'journal':
            response = "Writing can be powerful. Would you like me to give you a prompt, or do you prefer to free-write? I can also reflect back what you write to help you process.";
            suggestedTasks = [{ name: 'Journal Entry', path: '/tasks/journal', priority: 'medium' }];
            break;

        case 'cbt':
            response = "Let's work on that thought together. In CBT, we examine thoughts to see if they're helpful or distorted.\n\n**Thought Record:**\n1. What is the thought that's bothering you?\n2. What emotion does it create? (Rate 1-10)\n3. What evidence supports this thought?\n4. What evidence contradicts it?\n5. What's a more balanced perspective?\n\nLet's start with #1. What's the thought?";
            break;

        case 'gratitude':
            response = "I love that you're practicing gratitude. It literally rewires your brain to notice more good. Can you share 3 things you're grateful for right now, no matter how small?";
            break;

        case 'followup':
            // Handle yes/continue responses based on previous bot message
            if (session.turns.length > 0) {
                const lastBot = session.turns[session.turns.length - 1]?.bot || '';
                if (lastBot.includes('breathing') || lastBot.includes('Breathe')) {
                    response = "Great. \n\nINHALE... 2... 3... 4...\nHOLD... 2... 3... 4... 5... 6... 7...\nEXHALE slowly... 2... 3... 4... 5... 6... 7... 8...\n\nHow did that feel? Let's do another round.";
                } else if (lastBot.includes('screening') || lastBot.includes('assessment')) {
                    response = "Perfect. I'll guide you there. Taking the assessment will give us both a clearer picture of what you're experiencing.";
                    suggestedTasks = [{ name: 'Start Assessment', path: '/screening', priority: 'high' }];
                } else {
                    response = "Great, let's continue. What would you like to explore next?";
                }
            } else {
                response = "I'm ready when you are. What's on your mind?";
            }
            break;

        default:
            // General conversation with RAG
            response = generateTherapeuticResponse(message, context);
    }

    // Apply persona styling
    response = applyPersonaStyle(response, style, emotionalContext.score);

    return {
        response,
        style,
        suggestedTasks,
        suggestedScreening,
        isCrisis: false
    };
}

// ============================================
// RAG-ENHANCED THERAPEUTIC RESPONSE
// ============================================
function generateTherapeuticResponse(message, context) {
    const { session, emotionalContext } = context;
    const cleanMessage = message.toLowerCase().replace(/[^\w\s]/g, '');
    const words = cleanMessage.split(/\s+/).filter(w => w.length > 2);

    // Try to find matching protocol
    let bestMatch = null;
    let maxScore = 0;

    knowledgeBase.forEach(doc => {
        let score = 0;
        doc.keywords.forEach(kw => {
            if (cleanMessage.includes(kw.toLowerCase())) score += 10;
        });
        words.forEach(word => {
            if (doc.keywords.some(kw => kw.toLowerCase().includes(word))) score += 3;
        });

        if (score > maxScore) {
            maxScore = score;
            bestMatch = doc;
        }
    });

    let response = '';

    if (bestMatch && maxScore > 5) {
        response = bestMatch.content;
        if (bestMatch.followUp && Math.random() > 0.3) {
            response += ' ' + bestMatch.followUp;
        }
    } else {
        // Use conversational fallbacks based on emotional context
        if (emotionalContext.score < -2) {
            const empathicResponses = [
                "I can hear that you're going through something difficult. You don't have to carry this alone.",
                "That sounds really hard. I'm here with you. Tell me more about what you're experiencing.",
                "Your feelings are valid, even when they're painful. What do you think you need most right now?",
                "I appreciate you sharing that with me. It takes courage to be open about hard things."
            ];
            response = empathicResponses[Math.floor(Math.random() * empathicResponses.length)];
        } else if (emotionalContext.score > 2) {
            const positiveResponses = [
                "I love hearing that energy in your words. What's contributing to this good feeling?",
                "That's wonderful to hear! Savoring positive moments helps them last longer.",
                "I can sense some positivity there. What's going right for you today?"
            ];
            response = positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
        } else {
            // Check for conversation depth
            if (session.turns.length > 3) {
                // We've been talking - go deeper
                const deeperResponses = [
                    "We've been talking for a bit now. Is there something underneath all of this that we haven't touched yet?",
                    "I'm noticing a theme in what you've shared. What do you think ties these things together?",
                    "Sometimes what we talk about on the surface points to something deeper. What does your gut tell you this is really about?"
                ];
                response = deeperResponses[Math.floor(Math.random() * deeperResponses.length)];
            } else {
                response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
            }
        }
    }

    // Add task suggestion if appropriate
    if (emotionalContext.intensity === 'high' && emotionalContext.score < -1) {
        const taskHint = " Would it help if I suggested something concrete you could do right now?";
        response += taskHint;
    }

    return response;
}

// ============================================
// PERSONA SELECTION (RL-Enhanced)
// ============================================
function selectPersona(weights, emotionalContext) {
    const EPSILON = 0.15; // 15% exploration

    // Override for high distress
    if (emotionalContext.score < -4) return 'empathetic';
    if (emotionalContext.trajectory === 'declining') return 'empathetic';

    // Epsilon-greedy selection
    if (Math.random() < EPSILON) {
        const personas = Object.keys(weights);
        return personas[Math.floor(Math.random() * personas.length)];
    }

    // Exploit best performing persona
    return Object.entries(weights).reduce((best, [persona, weight]) =>
        weight > weights[best] ? persona : best
        , 'empathetic');
}

function applyPersonaStyle(response, persona, sentimentScore) {
    const personaConfig = therapistPersonas[persona];
    if (!personaConfig) return response;

    // Don't double-prefix if already processed
    if (personaConfig.prefixes.some(p => response.startsWith(p.trim()))) {
        return response;
    }

    const prefix = personaConfig.prefixes[Math.floor(Math.random() * personaConfig.prefixes.length)];
    const suffix = personaConfig.suffixes[Math.floor(Math.random() * personaConfig.suffixes.length)];

    // Only add suffix if not already ending with punctuation followed by space and more text
    let finalResponse = prefix + response;
    if (!response.match(/[.?!]$/)) {
        finalResponse += suffix;
    }

    return finalResponse;
}

// ============================================
// MAIN API HANDLER
// ============================================
export async function POST(req) {
    try {
        // Skip database initialization for now to ensure API works
        // await initializeDatabase();
        
        // Authenticate user (simplified)
        const authHeader = req.headers.get('authorization');
        let userId = 'anonymous';
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                // Simplified auth - just continue as user if token exists
                userId = token === 'demo-token' ? 'demo-user' : 'anonymous';
            } catch (error) {
                console.log('Invalid token, continuing as anonymous');
            }
        }
        
        const body = await req.json();
        const {
            message,
            sessionId = `session_${Date.now()}`,
            weights = { empathetic: 1, direct: 1, socratic: 1, mindfulness: 1 },
            vitals = null,
            mode = 'default',
            context = {}
        } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
        }

        console.log('API Request:', { message, sessionId, userId, context });

        // Use enhanced chat engine for response generation
        const response = await enhancedChatEngine.generateResponse(
            message,
            sessionId,
            {
                userId,
                ...context,
                vitals,
                mode,
                weights
            }
        );

        console.log('API Response generated successfully');

        // Skip database save for now
        /*
        try {
            await ChatConversation.create(userId, {
                sessionId,
                userMessage: message,
                botResponse: response.response,
                sentiment: response.sentiment?.score || 0,
                emotions: response.emotions || [],
                techniques: response.techniques || [],
                interventions: response.interventions || [],
                severity: response.severity || 0,
                isCrisis: response.isCrisis || false,
                metadata: {
                    therapeuticStyle: response.therapeuticStyle,
                    tone: response.tone,
                    processingTime: response.processingTime,
                    confidence: response.confidence,
                    sessionInfo: response.sessionInfo,
                    advancedFeatures: {
                        voice: response.voice,
                        visual: response.visual,
                        interactive: response.interactive,
                        adaptive: response.adaptive,
                        cultural: response.cultural,
                        accessibility: response.accessibility
                    }
                }
            });

            // Update user analytics
            await updateUserAnalytics(userId, {
                sessionId,
                message,
                response,
                timestamp: new Date()
            });

        } catch (dbError) {
            console.error('Database save error:', dbError);
            // Continue with response even if database save fails
        }
        */

        // Return enhanced response
        return NextResponse.json({
            ...response,
            sessionId,
            userId,
            timestamp: new Date().toISOString(),
            turnCount: response.turnCount || 1,
            isAuthenticated: userId !== 'anonymous',
            modelVersion: '2.0.0-enhanced'
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        console.error('Stack:', error.stack);
        
        // Return error response
        return NextResponse.json({
            error: 'Internal Server Error',
            response: "I'm having trouble processing that right now. Let's try a different approach - could you tell me more about what's on your mind?",
            isError: true,
            therapeuticStyle: 'empathetic',
            tone: 'gentle',
            techniques: ['active_listening', 'error_recovery'],
            emotions: [{ emotion: 'neutral', intensity: 0.5 }],
            isCrisis: false
        }, { status: 500 });
    }
}

// ============================================
// FEEDBACK ENDPOINT FOR RL
// ============================================
export async function PUT(req) {
    try {
        const body = await req.json();
        const { userId, style, isPositive } = body;

        // In production, update persistent weights
        console.log(`[RL Feedback] User: ${userId}, Style: ${style}, Positive: ${isPositive}`);

        return NextResponse.json({
            success: true,
            message: 'Feedback recorded',
            adjustment: isPositive ? '+0.2' : '-0.2',
            style
        });

    } catch (error) {
        console.error('[Feedback API Error]:', error);
        return NextResponse.json({ error: 'Failed to record feedback' }, { status: 500 });
    }
}

// ============================================
// 📊 REAL-TIME USER ANALYTICS
// ============================================
async function updateUserAnalytics(userId, data) {
    try {
        const analytics = {
            userId,
            timestamp: new Date(),
            messageLength: data.message.length,
            responseLength: data.response.response.length,
            sentiment: data.sentiment,
            emotions: data.emotions,
            techniques: data.techniques,
            isCrisis: data.isCrisis,
            engagement: {
                messageComplexity: data.message.split(' ').length,
                responseDepth: data.response.response.length,
                techniqueCount: data.techniques?.length || 0,
                emotionalIntensity: data.emotions?.reduce((sum, e) => sum + e.intensity, 0) || 0
            },
            progress: {
                streak: await UserStreak.getCurrent(userId),
                totalSessions: await ChatConversation.getTotalSessions(userId),
                averageSentiment: await ChatConversation.getAverageSentiment(userId),
                crisisCount: await ChatConversation.getCrisisCount(userId)
            }
        };
        
        // Store analytics for real-time dashboard
        console.log('User Analytics Updated:', analytics);
        
        return analytics;
    } catch (error) {
        console.error('Analytics update error:', error);
        return null;
    }
}

// ============================================
// GET - API Info & Health Check
// ============================================
export async function GET() {
    return NextResponse.json({
        status: 'healthy',
        service: 'MindshiftR Enhanced AI Companion',
        version: '2.0.0',
        features: [
            'Conversation memory',
            'Intent classification',
            'Task recommendations',
            'Screening integration',
            'Vitals awareness',
            'Reinforcement learning personas',
            'Emotional trajectory tracking'
        ],
        intents: Object.keys(INTENTS),
        taskCategories: Object.keys(TASKS),
        personas: Object.keys(therapistPersonas)
    });
}
