import { NextResponse } from 'next/server';

/**
 * ============================================
 * MINDSHIFTR - REAL-TIME COMMUNICATION API
 * WebSocket & Live Features
 * ============================================
 */

// In-memory store for active connections (in production, use Redis)
const activeConnections = new Map();
const liveSessions = new Map();

export async function GET(req) {
    // WebSocket upgrade endpoint info
    return NextResponse.json({
        status: 'realtime_ready',
        service: 'MindshiftR Real-Time Communication',
        features: [
            'Live chat sessions',
            'Real-time emotion tracking',
            'Instant crisis alerts',
            'Live therapist handoff',
            'Group therapy sessions',
            'Progress monitoring',
            'Biometric streaming'
        ],
        endpoints: {
            websocket: '/api/realtime/connect',
            status: '/api/realtime/status',
            notifications: '/api/realtime/notifications',
            liveTherapy: '/api/realtime/therapy'
        }
    });
}

export async function POST(req) {
    try {
        const { action, userId, sessionId, data } = await req.json();

        switch (action) {
            case 'join_session':
                return await joinLiveSession(userId, sessionId, data);
            
            case 'send_message':
                return await sendLiveMessage(userId, sessionId, data);
            
            case 'update_emotion':
                return await updateLiveEmotion(userId, sessionId, data);
            
            case 'crisis_alert':
                return await handleCrisisAlert(userId, sessionId, data);
            
            case 'request_therapist':
                return await requestTherapistHandoff(userId, sessionId, data);
            
            case 'join_group':
                return await joinGroupSession(userId, data);
            
            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

    } catch (error) {
        console.error('Realtime API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function joinLiveSession(userId, sessionId, data) {
    const sessionInfo = {
        userId,
        sessionId,
        joinedAt: new Date(),
        status: 'active',
        preferences: data.preferences || {},
        biometricConsent: data.biometricConsent || false
    };

    liveSessions.set(sessionId, sessionInfo);
    
    // Notify any connected therapists or monitors
    await broadcastToMonitors({
        type: 'session_joined',
        userId,
        sessionId,
        timestamp: new Date()
    });

    return NextResponse.json({
        success: true,
        sessionId,
        status: 'connected',
        features: [
            'Real-time messaging',
            'Emotion tracking',
            'Crisis monitoring',
            'Progress analytics'
        ]
    });
}

async function sendLiveMessage(userId, sessionId, data) {
    const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        sessionId,
        content: data.message,
        timestamp: new Date(),
        messageType: data.type || 'text',
        metadata: {
            emotion: data.emotion,
            urgency: data.urgency || 'normal',
            attachments: data.attachments || []
        }
    };

    // Store message for session history
    if (!liveSessions.has(sessionId)) {
        liveSessions.set(sessionId, { messages: [] });
    }
    
    const session = liveSessions.get(sessionId);
    if (!session.messages) session.messages = [];
    session.messages.push(message);

    // Analyze message for real-time insights
    const analysis = await analyzeMessageRealtime(message);
    
    // Broadcast to all participants
    await broadcastToSession(sessionId, {
        type: 'new_message',
        message,
        analysis
    });

    // Check for crisis indicators
    if (analysis.crisisLevel >= 4) {
        await handleCrisisAlert(userId, sessionId, {
            message: message.content,
            crisisLevel: analysis.crisisLevel,
            indicators: analysis.crisisIndicators
        });
    }

    return NextResponse.json({
        success: true,
        messageId: message.id,
        analysis,
        timestamp: message.timestamp
    });
}

async function updateLiveEmotion(userId, sessionId, data) {
    const emotionUpdate = {
        userId,
        sessionId,
        emotions: data.emotions,
        intensity: data.intensity,
        triggers: data.triggers,
        timestamp: new Date(),
        biometricData: data.biometricData
    };

    // Update session emotion state
    const session = liveSessions.get(sessionId);
    if (session) {
        session.currentEmotion = emotionUpdate;
        session.emotionHistory = session.emotionHistory || [];
        session.emotionHistory.push(emotionUpdate);
        
        // Keep only last 100 emotion updates
        if (session.emotionHistory.length > 100) {
            session.emotionHistory.shift();
        }
    }

    // Broadcast emotion update to therapists/monitors
    await broadcastToMonitors({
        type: 'emotion_update',
        userId,
        sessionId,
        emotion: emotionUpdate
    });

    // Check for concerning patterns
    const emotionAnalysis = analyzeEmotionPatterns(session?.emotionHistory || []);
    if (emotionAnalysis.concerning) {
        await broadcastToMonitors({
            type: 'concerning_pattern',
            userId,
            sessionId,
            analysis: emotionAnalysis
        });
    }

    return NextResponse.json({
        success: true,
        emotionUpdate,
        analysis: emotionAnalysis
    });
}

async function handleCrisisAlert(userId, sessionId, data) {
    const crisisAlert = {
        id: `crisis_${Date.now()}`,
        userId,
        sessionId,
        severity: data.crisisLevel || 5,
        message: data.message,
        indicators: data.indicators || [],
        timestamp: new Date(),
        status: 'active',
        escalated: false
    };

    // Immediate broadcast to all available therapists
    await broadcastToTherapists({
        type: 'crisis_alert',
        alert: crisisAlert,
        userLocation: data.location || null,
        contactInfo: data.contactInfo || null
    });

    // Update session status
    const session = liveSessions.get(sessionId);
    if (session) {
        session.crisisMode = true;
        session.crisisAlert = crisisAlert;
    }

    // If no therapist responds within 2 minutes, escalate to emergency services
    setTimeout(async () => {
        if (!crisisAlert.escalated) {
            await escalateToEmergency(crisisAlert);
        }
    }, 120000);

    return NextResponse.json({
        success: true,
        crisisId: crisisAlert.id,
        message: 'Crisis alert sent to available therapists',
        resources: [
            { name: '988 Suicide & Crisis Lifeline', phone: '988' },
            { name: 'Crisis Text Line', text: 'HOME to 741741' },
            { name: 'Emergency Services', phone: '911' }
        ]
    });
}

async function requestTherapistHandoff(userId, sessionId, data) {
    const handoffRequest = {
        id: `handoff_${Date.now()}`,
        userId,
        sessionId,
        reason: data.reason,
        urgency: data.urgency || 'normal',
        preferredSpecialty: data.specialty || 'general',
        timestamp: new Date(),
        status: 'pending'
    };

    // Find available therapists
    const availableTherapists = await findAvailableTherapists({
        specialty: data.specialty,
        language: data.language,
        availability: 'immediate'
    });

    if (availableTherapists.length > 0) {
        // Send request to best match
        const therapist = availableTherapists[0];
        await notifyTherapist(therapist.id, handoffRequest);
        
        handoffRequest.assignedTherapist = therapist.id;
        handoffRequest.estimatedWait = therapist.estimatedWait || 5;
    } else {
        // Add to queue
        handoffRequest.queuePosition = await getQueuePosition();
        handoffRequest.estimatedWait = handoffRequest.queuePosition * 10;
    }

    return NextResponse.json({
        success: true,
        handoffId: handoffRequest.id,
        status: handoffRequest.status,
        estimatedWait: handoffRequest.estimatedWait,
        therapistAssigned: !!handoffRequest.assignedTherapist
    });
}

async function joinGroupSession(userId, data) {
    const groupSession = {
        userId,
        groupId: data.groupId,
        topic: data.topic,
        joinedAt: new Date(),
        role: data.role || 'participant'
    };

    // Add to group session
    // This would integrate with a group therapy system

    return NextResponse.json({
        success: true,
        groupId: data.groupId,
        participants: await getGroupParticipants(data.groupId),
        sessionStart: new Date()
    });
}

// ============================================
// 🔍 REAL-TIME ANALYSIS FUNCTIONS
// ============================================

async function analyzeMessageRealtime(message) {
    // Enhanced real-time message analysis
    const sentiment = analyzeSentiment(message.content);
    const emotions = detectEmotions(message.content);
    const crisisIndicators = detectCrisisIndicators(message.content);
    const cognitiveDistortions = detectCognitiveDistortions(message.content);

    return {
        sentiment,
        emotions,
        crisisLevel: calculateCrisisLevel(crisisIndicators, emotions),
        crisisIndicators,
        cognitiveDistortions,
        urgency: determineUrgency(sentiment, emotions),
        suggestedIntervention: suggestIntervention(sentiment, emotions, crisisIndicators)
    };
}

function analyzeEmotionPatterns(emotionHistory) {
    if (emotionHistory.length < 5) {
        return { concerning: false, reason: 'insufficient_data' };
    }

    const recent = emotionHistory.slice(-10);
    const avgIntensity = recent.reduce((sum, e) => sum + e.intensity, 0) / recent.length;
    const negativeEmotions = recent.filter(e => e.emotions.some(em => ['anxiety', 'depression', 'anger', 'fear'].includes(em.emotion)));
    
    const concerning = avgIntensity > 0.7 || negativeEmotions.length > 7;
    
    return {
        concerning,
        avgIntensity,
        negativeEmotionRatio: negativeEmotions.length / recent.length,
        trend: calculateEmotionTrend(recent),
        recommendations: concerning ? [
            'Immediate therapist check-in',
            'Crisis resource provision',
            'Increased monitoring frequency'
        ] : []
    };
}

// ============================================
// 📡 BROADCASTING FUNCTIONS
// ============================================

async function broadcastToSession(sessionId, data) {
    // In production, use WebSocket or Server-Sent Events
    console.log(`Broadcasting to session ${sessionId}:`, data);
}

async function broadcastToMonitors(data) {
    // Broadcast to therapist monitoring dashboard
    console.log('Broadcasting to monitors:', data);
}

async function broadcastToTherapists(data) {
    // Broadcast to all available therapists
    console.log('Broadcasting to therapists:', data);
}

async function notifyTherapist(therapistId, handoffRequest) {
    // Send notification to specific therapist
    console.log(`Notifying therapist ${therapistId}:`, handoffRequest);
}

// ============================================
// 🔧 UTILITY FUNCTIONS
// ============================================

function analyzeSentiment(text) {
    // Enhanced sentiment analysis
    const positiveWords = ['happy', 'good', 'great', 'wonderful', 'excellent'];
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'horrible'];
    
    let score = 0;
    const words = text.toLowerCase().split(' ');
    
    words.forEach(word => {
        if (positiveWords.includes(word)) score += 1;
        if (negativeWords.includes(word)) score -= 1;
    });
    
    return { score, classification: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral' };
}

function detectEmotions(text) {
    const emotionPatterns = {
        anxiety: ['anxious', 'worried', 'panic', 'nervous'],
        depression: ['sad', 'depressed', 'hopeless', 'worthless'],
        anger: ['angry', 'mad', 'furious', 'irritated'],
        fear: ['scared', 'afraid', 'terrified', 'panic']
    };
    
    const detected = [];
    const textLower = text.toLowerCase();
    
    Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
        const matches = patterns.filter(pattern => textLower.includes(pattern));
        if (matches.length > 0) {
            detected.push({ emotion, intensity: matches.length / patterns.length, triggers: matches });
        }
    });
    
    return detected;
}

function detectCrisisIndicators(text) {
    const crisisKeywords = [
        'suicide', 'kill myself', 'end my life', 'want to die',
        'hurt myself', 'self-harm', 'cutting', 'overdose'
    ];
    
    const textLower = text.toLowerCase();
    return crisisKeywords.filter(keyword => textLower.includes(keyword));
}

function detectCognitiveDistortions(text) {
    const distortions = {
        all_or_nothing: ['always', 'never', 'perfect', 'failure'],
        catastrophizing: ['terrible', 'awful', 'horrible', 'disaster'],
        mind_reading: ['they think', 'everyone thinks', 'they know']
    };
    
    const detected = [];
    const textLower = text.toLowerCase();
    
    Object.entries(distortions).forEach(([distortion, patterns]) => {
        if (patterns.some(pattern => textLower.includes(pattern))) {
            detected.push(distortion);
        }
    });
    
    return detected;
}

function calculateCrisisLevel(indicators, emotions) {
    let level = 1;
    
    // Crisis keywords
    if (indicators.length > 0) level += 3;
    
    // High intensity negative emotions
    const highIntensityEmotions = emotions.filter(e => e.intensity > 0.7);
    level += highIntensityEmotions.length;
    
    return Math.min(level, 5);
}

function determineUrgency(sentiment, emotions) {
    if (sentiment.score < -2) return 'high';
    if (emotions.some(e => e.intensity > 0.8)) return 'high';
    if (sentiment.score < -1) return 'medium';
    return 'low';
}

function suggestIntervention(sentiment, emotions, crisisIndicators) {
    if (crisisIndicators.length > 0) return 'crisis_intervention';
    if (sentiment.score < -2) return 'intensive_support';
    if (emotions.some(e => e.emotion === 'anxiety')) return 'anxiety_management';
    if (emotions.some(e => e.emotion === 'depression')) return 'depression_support';
    return 'general_support';
}

function calculateEmotionTrend(emotions) {
    if (emotions.length < 3) return 'stable';
    
    const recent = emotions.slice(-3);
    const avgIntensity = recent.reduce((sum, e) => sum + e.intensity, 0) / recent.length;
    const earlier = emotions.slice(-6, -3);
    const earlierAvg = earlier.reduce((sum, e) => sum + e.intensity, 0) / earlier.length;
    
    if (avgIntensity > earlierAvg + 0.2) return 'worsening';
    if (avgIntensity < earlierAvg - 0.2) return 'improving';
    return 'stable';
}

async function findAvailableTherapists(criteria) {
    // Mock therapist data - in production, query database
    return [
        {
            id: 'therapist_1',
            name: 'Dr. Sarah Johnson',
            specialty: 'anxiety',
            estimatedWait: 5,
            rating: 4.8
        }
    ];
}

async function getQueuePosition() {
    // Mock queue position
    return Math.floor(Math.random() * 10) + 1;
}

async function getGroupParticipants(groupId) {
    // Mock group participants
    return [
        { id: 'user_1', name: 'Anonymous User 1' },
        { id: 'user_2', name: 'Anonymous User 2' }
    ];
}

async function escalateToEmergency(crisisAlert) {
    crisisAlert.escalated = true;
    crisisAlert.escalatedAt = new Date();
    
    // In production, integrate with emergency services API
    console.log('CRISIS ESCALATED TO EMERGENCY SERVICES:', crisisAlert);
}
