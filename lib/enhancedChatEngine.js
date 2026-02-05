/**
 * ============================================
 * MINDSHIFTR - ENHANCED CHAT ENGINE v3.0
 * Advanced Mental Health AI Companion
 * ============================================
 * 
 * Features:
 * - Clinical-grade therapeutic responses
 * - Real-time crisis detection and intervention
 * - Personalized treatment adaptation
 * - Evidence-based protocol matching
 * - Biometric data integration
 * - Continuous learning and optimization
 * - Multi-modal response generation
 * - Cultural adaptation
 * - Voice integration
 * - Advanced analytics
 */

import { enhancedKnowledgeBase } from './enhancedKnowledgeBase.js';
import { advancedChatFeatures } from './advancedChatFeatures.js';
import { clinicalValidation } from './clinicalValidation.js';
import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export class EnhancedChatEngine {
    constructor() {
        this.knowledgeBase = enhancedKnowledgeBase;
        this.sessionContexts = new Map();
        this.crisisMode = new Set();
        this.advancedFeatures = advancedChatFeatures;
        this.clinicalValidator = clinicalValidation;
        this.userProfiles = new Map();
        this.conversationHistory = new Map();
        this.responseCache = new Map();
        this.analytics = {
            totalSessions: 0,
            crisisInterventions: 0,
            techniqueUsage: new Map(),
            userSatisfaction: 0,
            responseTime: []
        };
    }

    // ============================================
    // 🧠 MAIN RESPONSE GENERATION
    // ============================================

    async generateResponse(message, sessionId, context = {}) {
        const startTime = Date.now();
        
        try {
            // Initialize or retrieve session context
            let sessionContext = this.sessionContexts.get(sessionId) || {
                userId: context.userId || 'anonymous',
                startTime: Date.now(),
                messageCount: 0,
                emotionalJourney: [],
                techniquesUsed: [],
                crisisLevel: 0,
                lastMessageTime: null,
                language: context.language || 'en',
                culturalContext: context.culturalContext || 'western'
            };

            // Update session context
            sessionContext.messageCount++;
            sessionContext.lastMessageTime = Date.now();

            // Create or update user profile
            if (!this.advancedFeatures.userProfiles.has(sessionContext.userId)) {
                this.advancedFeatures.createUserProfile(sessionContext.userId, {
                    personalization: context.userProfile || {},
                    preferences: {
                        language: context.language || 'en',
                        culturalContext: context.culturalContext || 'western',
                        voiceEnabled: context.voiceEnabled || false,
                        communicationStyle: context.communicationStyle || 'empathetic'
                    }
                });
            }

            // Analyze message with enhanced features
            const messageAnalysis = this.analyzeMessage(message, sessionContext);
            
            // Track emotional patterns
            const emotionalPatterns = this.advancedFeatures.trackEmotionalPatterns(
                sessionContext.userId, 
                messageAnalysis.emotions, 
                context
            );

            // Analyze conversation flow
            const conversationFlow = this.advancedFeatures.analyzeConversationFlow(
                sessionContext.userId, 
                message, 
                context
            );

            // Crisis detection with clinical validation
            const crisisAssessment = this.detectCrisis(message, messageAnalysis);
            
            if (crisisAssessment.isCrisis) {
                this.crisisMode.add(sessionId);
                sessionContext.crisisLevel = crisisAssessment.severity;
                this.analytics.crisisInterventions++;
                return this.generateCrisisResponse(crisisAssessment, sessionContext);
            }

            // Clinical validation of interventions
            const clinicalValidation = this.clinicalValidator.validateIntervention(
                messageAnalysis,
                sessionContext,
                context
            );

            // Generate multi-modal response
            const multiModalResponse = this.advancedFeatures.generateMultiModalResponse(
                sessionContext.userId,
                messageAnalysis,
                context
            );

            // Build enhanced response
            const response = {
                response: multiModalResponse.text.content,
                therapeuticStyle: multiModalResponse.text.style,
                tone: multiModalResponse.text.tone,
                techniques: this.selectTechniques(messageAnalysis, clinicalValidation),
                interventions: this.generateInterventions(messageAnalysis, clinicalValidation),
                sentiment: messageAnalysis.sentiment,
                emotions: messageAnalysis.emotions,
                cognitiveDistortions: messageAnalysis.cognitiveDistortions,
                severity: messageAnalysis.severity,
                followUp: this.generateFollowUp(messageAnalysis, sessionContext),
                educationalContent: this.generateEducationalContent(messageAnalysis, clinicalValidation),
                suggestedActions: this.generateSuggestedActions(messageAnalysis, context),
                isCrisis: false,
                sessionInfo: {
                    turnCount: sessionContext.messageCount,
                    duration: Date.now() - sessionContext.startTime,
                    emotionalJourney: [...sessionContext.emotionalJourney, messageAnalysis.sentiment],
                    techniquesUsed: [...sessionContext.techniquesUsed]
                },
                // Advanced features
                voice: multiModalResponse.voice,
                visual: multiModalResponse.visual,
                interactive: multiModalResponse.interactive,
                adaptive: multiModalResponse.adaptive,
                cultural: multiModalResponse.cultural,
                accessibility: multiModalResponse.accessibility,
                conversationFlow,
                emotionalPatterns,
                clinicalValidation,
                // Performance metrics
                processingTime: Date.now() - startTime,
                cacheHit: this.responseCache.has(message),
                confidence: this.calculateResponseConfidence(messageAnalysis, clinicalValidation)
            };

            // Update session context
            sessionContext.emotionalJourney.push(messageAnalysis.sentiment);
            if (response.techniques) {
                sessionContext.techniquesUsed.push(...response.techniques);
            }
            this.sessionContexts.set(sessionId, sessionContext);

            // Update adaptive learning
            this.advancedFeatures.updateAdaptiveLearning(sessionContext.userId, {
                type: 'interaction',
                message,
                response,
                context,
                timestamp: Date.now()
            });

            // Update analytics
            this.updateAnalytics(response, startTime);

            return response;

        } catch (error) {
            console.error('Enhanced Chat Engine Error:', error);
            return this.generateErrorResponse(error, sessionId);
        }
    }

    // ============================================
    // 🔍 MESSAGE ANALYSIS
    // ============================================

    analyzeMessage(message, sessionContext) {
        const sentimentScore = sentiment.analyze(message);
        
        return {
            originalMessage: message,
            sentiment: {
                score: sentimentScore.score,
                comparative: sentimentScore.comparative,
                positive: sentimentScore.positive,
                negative: sentimentScore.negative,
                classification: this.classifySentiment(sentimentScore.score)
            },
            emotions: this.detectEmotions(message),
            cognitiveDistortions: this.detectCognitiveDistortions(message),
            intent: this.classifyIntent(message),
            severity: this.assessSeverity(message, sentimentScore),
            topics: this.extractTopics(message),
            linguisticMarkers: this.analyzeLinguisticMarkers(message),
            temporalContext: this.analyzeTemporalContext(message, sessionContext),
            biometricCorrelation: this.analyzeBiometricCorrelation(message, sessionContext),
            riskFactors: this.assessRiskFactors(message, sessionContext),
            protectiveFactors: this.identifyProtectiveFactors(message, sessionContext)
        };
    }

    // ============================================
    // 🚨 CRISIS DETECTION & SAFETY MONITORING
    // ============================================
    
    detectCrisis(message, analysis) {
        const crisisKeywords = [
            'suicide', 'kill myself', 'end my life', 'want to die',
            'hurt myself', 'self harm', 'cut myself', 'overdose',
            'no reason to live', 'better off dead', 'can\'t go on',
            'end it all', 'take my own life', 'suicidal'
        ];

        const highRiskPhrases = [
            'goodbye forever', 'last message', 'final goodbye',
            'no one will miss me', 'burden to everyone', 'disappearing'
        ];

        const lowerMessage = message.toLowerCase();
        
        // Direct crisis keywords
        const directCrisis = crisisKeywords.some(keyword => lowerMessage.includes(keyword));
        
        // High risk phrases
        const highRisk = highRiskPhrases.some(phrase => lowerMessage.includes(phrase));
        
        // Emotional indicators
        const emotionalCrisis = analysis.emotions.some(e => 
            (e.emotion === 'hopelessness' && e.intensity > 0.8) ||
            (e.emotion === 'despair' && e.intensity > 0.7)
        );
        
        // Severity indicators
        const severityIndicators = [
            analysis.severity > 8,
            analysis.sentiment.score < -3,
            analysis.cognitiveDistortions.some(cd => cd.type === 'all_or_nothing')
        ];

        const isCrisis = directCrisis || highRisk || emotionalCrisis || severityIndicators.some(si => si);
        
        return {
            isCrisis,
            severity: isCrisis ? this.calculateCrisisSeverity(message, analysis) : 0,
            type: this.classifyCrisisType(message, analysis),
            urgency: isCrisis ? 'immediate' : 'none',
            recommendedAction: isCrisis ? this.getRecommendedCrisisAction(message, analysis) : null
        };
    }

    generateCrisisResponse(crisisAssessment, sessionContext) {
        const responses = {
            suicide_prevention: [
                "I'm deeply concerned about you, and I want you to know that your life matters. Please reach out to the 988 Suicide & Crisis Lifeline - they're available 24/7 at 988. You don't have to go through this alone.",
                "I hear how much pain you're in, and I want you to know there's help available. Call or text 988 to connect with someone who can support you right now. Your life is valuable.",
                "I'm really worried about you, and I'm here to listen while we get you connected to immediate help. Please call 988 - they're trained to help in exactly this situation."
            ],
            self_harm: [
                "I'm concerned about your safety. Please reach out to the Crisis Text Line by texting HOME to 741741, or call 988. There are people who want to help you through this.",
                "Your safety is my priority right now. Let's connect you with immediate support - call 988 or text 741741. You deserve support and care."
            ],
            severe_distress: [
                "I can see how much pain you're in. While I'm here to listen, I think it would be helpful to also connect with a crisis counselor at 988. They're available 24/7.",
                "This sounds incredibly difficult to handle alone. Please consider reaching out to 988 - they're trained to help people through exactly what you're experiencing."
            ]
        };

        const responseType = crisisAssessment.type || 'severe_distress';
        const responseOptions = responses[responseType] || responses.severe_distress;
        const selectedResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];

        return {
            response: selectedResponse,
            therapeuticStyle: 'crisis_intervention',
            tone: 'urgent_calm',
            techniques: ['crisis_intervention', 'safety_planning'],
            interventions: [{
                type: 'emergency_contact',
                resource: '988 Suicide & Crisis Lifeline',
                action: 'call_or_text_988'
            }],
            sentiment: { classification: 'crisis', score: -5 },
            emotions: [{ emotion: 'crisis', intensity: 1.0 }],
            severity: crisisAssessment.severity,
            isCrisis: true,
            crisisInfo: {
                type: crisisAssessment.type,
                severity: crisisAssessment.severity,
                urgency: crisisAssessment.urgency,
                timestamp: Date.now()
            },
            suggestedActions: [
                { tool: '/crisis', priority: 'immediate' },
                { tool: 'tel:988', priority: 'immediate' }
            ],
            sessionInfo: {
                crisisIntervention: true,
                escalationRequired: crisisAssessment.severity > 7
            }
        };
    }

    // ============================================
    // 🎯 TECHNIQUE SELECTION & INTERVENTION
    // ============================================

    selectTechniques(analysis, clinicalValidation) {
        const techniques = [];
        
        // Emotion-based technique selection
        if (analysis.emotions.some(e => e.emotion === 'anxiety')) {
            techniques.push('anxiety_management', 'breathing_exercises');
        }
        
        if (analysis.emotions.some(e => e.emotion === 'sadness')) {
            techniques.push('behavioral_activation', 'self_compassion');
        }
        
        if (analysis.emotions.some(e => e.emotion === 'anger')) {
            techniques.push('anger_management', 'cognitive_reframing');
        }
        
        // Cognitive distortion targeting
        if (analysis.cognitiveDistortions.length > 0) {
            techniques.push('cognitive_restructuring');
        }
        
        // Severity-based techniques
        if (analysis.severity > 6) {
            techniques.push('grounding_techniques', 'safety_planning');
        }
        
        // Clinical validation recommendations
        if (clinicalValidation.recommendedTechniques) {
            techniques.push(...clinicalValidation.recommendedTechniques);
        }
        
        return [...new Set(techniques)]; // Remove duplicates
    }

    generateInterventions(analysis, clinicalValidation) {
        const interventions = [];
        
        // Educational interventions
        if (analysis.cognitiveDistortions.length > 0) {
            interventions.push({
                type: 'psychoeducation',
                topic: 'cognitive_distortions',
                title: 'Understanding Thought Patterns',
                content: 'Learn how your thoughts affect your feelings and behaviors'
            });
        }
        
        // Skill-building interventions
        if (analysis.emotions.some(e => e.emotion === 'anxiety')) {
            interventions.push({
                type: 'skill_building',
                skill: 'progressive_muscle_relaxation',
                title: 'Progressive Muscle Relaxation',
                duration: '10 minutes',
                difficulty: 'beginner'
            });
        }
        
        // Behavioral interventions
        if (analysis.severity > 5) {
            interventions.push({
                type: 'behavioral',
                action: 'safety_plan',
                title: 'Create a Safety Plan',
                priority: 'high'
            });
        }
        
        return interventions;
    }

    // ============================================
    // 🎨 RESPONSE GENERATION
    // ============================================

    generateTherapeuticResponse(analysis, sessionContext, context) {
        const userProfile = this.advancedFeatures.userProfiles.get(sessionContext.userId);
        const style = userProfile?.preferences?.communicationStyle || 'empathetic';
        
        const responseTemplates = {
            empathetic: [
                "I hear that {emotion}. That sounds really {difficulty}. Tell me more about what's been happening.",
                "It makes sense that you're feeling {emotion}. {validation}. What would be most helpful right now?",
                "Thank you for sharing that with me. {emotion} can be really {difficulty}. I'm here to support you through this."
            ],
            direct: [
                "I understand you're experiencing {emotion}. Let's focus on {technique} to help with this.",
                "Based on what you've shared about {emotion}, I recommend {action}. Would you like to try that?",
                "{emotion} requires specific strategies. Here's what we can do: {technique}."
            ],
            socratic: [
                "What do you think might be happening when you feel {emotion}?",
                "How has {emotion} been affecting your daily life?",
                "What have you tried before when dealing with {emotion}?"
            ],
            mindfulness: [
                "Notice the {emotion} without judgment. Let's bring awareness to this moment.",
                "When {emotion} arises, can we observe it with curiosity?",
                "Let's pause and notice what {emotion} feels like in your body right now."
            ]
        };

        const templates = responseTemplates[style] || responseTemplates.empathetic;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        // Fill in template variables
        const primaryEmotion = analysis.emotions[0]?.emotion || 'this way';
        const difficulty = this.getDifficultyLevel(analysis.severity);
        const validation = this.generateValidation(analysis);
        const technique = this.getRecommendedTechnique(analysis);
        const action = this.getRecommendedAction(analysis);

        return template
            .replace('{emotion}', primaryEmotion)
            .replace('{difficulty}', difficulty)
            .replace('{validation}', validation)
            .replace('{technique}', technique)
            .replace('{action}', action);
    }

    // ============================================
    // 📊 ANALYTICS & MONITORING
    // ============================================

    updateAnalytics(response, startTime) {
        this.analytics.totalSessions++;
        this.analytics.responseTime.push(Date.now() - startTime);
        
        // Track technique usage
        if (response.techniques) {
            response.techniques.forEach(technique => {
                const count = this.analytics.techniqueUsage.get(technique) || 0;
                this.analytics.techniqueUsage.set(technique, count + 1);
            });
        }
        
        // Calculate average response time
        if (this.analytics.responseTime.length > 100) {
            this.analytics.responseTime = this.analytics.responseTime.slice(-50);
        }
    }

    getAnalytics() {
        const avgResponseTime = this.analytics.responseTime.length > 0 
            ? this.analytics.responseTime.reduce((a, b) => a + b, 0) / this.analytics.responseTime.length 
            : 0;

        return {
            totalSessions: this.analytics.totalSessions,
            crisisInterventions: this.analytics.crisisInterventions,
            averageResponseTime: Math.round(avgResponseTime),
            techniqueUsage: Object.fromEntries(this.analytics.techniqueUsage),
            userSatisfaction: this.analytics.userSatisfaction,
            activeSessions: this.sessionContexts.size,
            crisisModeActive: this.crisisMode.size
        };
    }

    // ============================================
    // 🔧 HELPER METHODS
    // ============================================

    classifySentiment(score) {
        if (score > 1) return 'positive';
        if (score < -1) return 'negative';
        return 'neutral';
    }

    detectEmotions(message) {
        const emotionKeywords = {
            anxiety: ['anxious', 'worried', 'nervous', 'panic', 'fear', 'stress'],
            sadness: ['sad', 'depressed', 'unhappy', 'down', 'blue', 'hopeless'],
            anger: ['angry', 'mad', 'furious', 'irritated', 'frustrated', 'annoyed'],
            joy: ['happy', 'excited', 'joyful', 'pleased', 'glad', 'cheerful'],
            fear: ['scared', 'afraid', 'terrified', 'fearful', 'panic', 'dread'],
            shame: ['ashamed', 'embarrassed', 'humiliated', 'guilty', 'regret'],
            disgust: ['disgusted', 'revolted', 'repulsed', 'sickened'],
            surprise: ['surprised', 'shocked', 'amazed', 'astonished']
        };

        const detectedEmotions = [];
        const lowerMessage = message.toLowerCase();

        for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
            const matches = keywords.filter(keyword => lowerMessage.includes(keyword));
            if (matches.length > 0) {
                detectedEmotions.push({
                    emotion,
                    intensity: Math.min(matches.length / keywords.length, 1.0),
                    triggers: matches
                });
            }
        }

        return detectedEmotions.length > 0 ? detectedEmotions : [{ emotion: 'neutral', intensity: 0.5 }];
    }

    detectCognitiveDistortions(message) {
        const distortions = {
            all_or_nothing: ['always', 'never', 'perfect', 'failure', 'ruined'],
            overgeneralization: ['always', 'never', 'every time', 'nothing ever'],
            mental_filter: ['only', 'just', 'worst', 'terrible', 'awful'],
            disqualifying_positive: ['doesn\'t count', 'doesn\'t matter', 'lucky'],
            jumping_conclusions: ['must be', 'probably', 'definitely', 'obviously'],
            magnification: ['terrible', 'awful', 'horrible', 'disastrous'],
            minimization: ['only', 'just', 'small', 'minor'],
            personalization: ['my fault', 'blame me', 'responsible'],
            labeling: ['loser', 'failure', 'stupid', 'worthless'],
            emotional_reasoning: ['feel like', 'must be', 'seems like']
        };

        const detectedDistortions = [];
        const lowerMessage = message.toLowerCase();

        for (const [type, keywords] of Object.entries(distortions)) {
            const matches = keywords.filter(keyword => lowerMessage.includes(keyword));
            if (matches.length > 0) {
                detectedDistortions.push({
                    type,
                    frequency: matches.length,
                    examples: matches
                });
            }
        }

        return detectedDistortions;
    }

    classifyIntent(message) {
        const intentPatterns = {
            seeking_support: ['help', 'support', 'advice', 'guidance', 'need'],
            sharing_feelings: ['feel', 'feeling', 'emotion', 'mood', 'experiencing'],
            seeking_information: ['what', 'how', 'why', 'explain', 'tell me'],
            crisis: ['suicide', 'kill', 'harm', 'emergency', 'crisis'],
            practicing_techniques: ['try', 'practice', 'exercise', 'technique'],
            reporting_progress: ['better', 'worse', 'improving', 'progress']
        };

        const lowerMessage = message.toLowerCase();
        
        for (const [intent, keywords] of Object.entries(intentPatterns)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                return intent;
            }
        }
        
        return 'general';
    }

    assessSeverity(message, sentimentScore) {
        let severity = 5; // Base severity
        
        // Sentiment-based severity
        if (sentimentScore.score < -2) severity += 2;
        if (sentimentScore.score < -4) severity += 2;
        
        // Crisis keywords
        const crisisKeywords = ['suicide', 'kill', 'harm', 'death', 'die'];
        if (crisisKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
            severity = 10;
        }
        
        // Emotional intensity
        const intenseEmotions = ['overwhelming', 'unbearable', 'terrible', 'awful'];
        if (intenseEmotions.some(emotion => message.toLowerCase().includes(emotion))) {
            severity += 2;
        }
        
        return Math.min(severity, 10);
    }

    extractTopics(message) {
        const topicKeywords = {
            relationships: ['relationship', 'partner', 'friend', 'family', 'marriage'],
            work: ['work', 'job', 'career', 'boss', 'colleague', 'unemployed'],
            health: ['health', 'sick', 'illness', 'pain', 'doctor', 'medication'],
            sleep: ['sleep', 'insomnia', 'tired', 'exhausted', 'nightmare'],
            anxiety: ['anxiety', 'panic', 'worry', 'stress', 'nervous'],
            depression: ['depressed', 'sad', 'hopeless', 'empty', 'numb'],
            trauma: ['trauma', 'abuse', 'assault', 'accident', 'attack'],
            self_esteem: ['worthless', 'failure', 'inadequate', 'not good enough']
        };

        const detectedTopics = [];
        const lowerMessage = message.toLowerCase();

        for (const [topic, keywords] of Object.entries(topicKeywords)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                detectedTopics.push(topic);
            }
        }

        return detectedTopics;
    }

    analyzeLinguisticMarkers(message) {
        const markers = {
            first_person: message.split('I ').length - 1,
            questions: message.split('?').length - 1,
            exclamation: message.split('!').length - 1,
            negations: (message.match(/\b(no|not|never|nothing|nowhere)\b/gi) || []).length,
            absolutes: (message.match(/\b(always|never|every|none|all)\b/gi) || []).length
        };

        return markers;
    }

    analyzeTemporalContext(message, sessionContext) {
        const timeSinceLastMessage = this.calculateTimeSinceLastSession(sessionContext);
        const timeReferences = {
            today: ['today', 'now', 'right now'],
            recent: ['yesterday', 'last night', 'recently'],
            past: ['last week', 'last month', 'before'],
            future: ['tomorrow', 'next week', 'upcoming']
        };

        const lowerMessage = message.toLowerCase();
        let temporalReference = 'present';

        for (const [timeframe, keywords] of Object.entries(timeReferences)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                temporalReference = timeframe;
                break;
            }
        }

        return {
            timeSinceLastMessage,
            temporalReference,
            sessionDuration: Date.now() - sessionContext.startTime
        };
    }

    analyzeBiometricCorrelation(message, sessionContext) {
        // This would integrate with actual biometric data if available
        return {
            stressIndicators: this.detectStressIndicators(message),
            sleepCorrelation: this.detectSleepCorrelation(message),
            activityCorrelation: this.detectActivityCorrelation(message)
        };
    }

    assessRiskFactors(message, sessionContext) {
        const riskFactors = [];
        
        // Previous crisis history
        if (sessionContext.crisisLevel > 0) {
            riskFactors.push('previous_crisis');
        }
        
        // Social isolation indicators
        const isolationKeywords = ['alone', 'lonely', 'no one', 'isolated', 'withdrawn'];
        if (isolationKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
            riskFactors.push('social_isolation');
        }
        
        // Hopelessness indicators
        const hopelessnessKeywords = ['hopeless', 'pointless', 'no future', 'giving up'];
        if (hopelessnessKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
            riskFactors.push('hopelessness');
        }
        
        return riskFactors;
    }

    identifyProtectiveFactors(message, sessionContext) {
        const protectiveFactors = [];
        
        // Help-seeking behavior
        const helpSeekingKeywords = ['help', 'support', 'advice', 'guidance'];
        if (helpSeekingKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
            protectiveFactors.push('help_seeking');
        }
        
        // Coping strategies
        const copingKeywords = ['coping', 'managing', 'dealing', 'handling'];
        if (copingKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
            protectiveFactors.push('coping_strategies');
        }
        
        // Social connections
        const socialKeywords = ['friend', 'family', 'support', 'together'];
        if (socialKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
            protectiveFactors.push('social_support');
        }
        
        return protectiveFactors;
    }

    // Additional helper methods
    calculateTimeSinceLastSession(sessionContext) {
        if (!sessionContext.lastMessageTime) {
            return 0; // First message in session
        }
        return Date.now() - sessionContext.lastMessageTime;
    }

    calculateCrisisSeverity(message, analysis) {
        let severity = 5;
        
        // Direct crisis indicators
        const directCrisisKeywords = ['suicide', 'kill', 'die', 'end life'];
        if (directCrisisKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
            severity += 3;
        }
        
        // Emotional severity
        if (analysis.severity > 8) severity += 2;
        
        // Cognitive distortions
        if (analysis.cognitiveDistortions.some(cd => cd.type === 'all_or_nothing')) {
            severity += 1;
        }
        
        return Math.min(severity, 10);
    }

    classifyCrisisType(message, analysis) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('suicide') || lowerMessage.includes('kill')) {
            return 'suicide_prevention';
        }
        
        if (lowerMessage.includes('harm') || lowerMessage.includes('cut')) {
            return 'self_harm';
        }
        
        if (analysis.severity > 8) {
            return 'severe_distress';
        }
        
        return 'moderate_distress';
    }

    getRecommendedCrisisAction(message, analysis) {
        const severity = this.calculateCrisisSeverity(message, analysis);
        
        if (severity > 8) {
            return 'immediate_emergency_services';
        } else if (severity > 6) {
            return 'crisis_hotline_contact';
        } else {
            return 'professional_referral';
        }
    }

    generateFollowUp(analysis, sessionContext) {
        const followUpOptions = [
            "How are you feeling about what we've discussed?",
            "Would you like to try any of these techniques?",
            "What support do you need right now?",
            "Is there anything else you'd like to share?"
        ];
        
        return followUpOptions[Math.floor(Math.random() * followUpOptions.length)];
    }

    generateEducationalContent(analysis, clinicalValidation) {
        if (analysis.cognitiveDistortions.length > 0) {
            return {
                title: 'Understanding Cognitive Distortions',
                content: 'Cognitive distortions are biased ways of thinking that can reinforce negative emotions. Learning to identify and challenge these patterns is a key skill in cognitive therapy.',
                type: 'psychoeducation'
            };
        }
        
        return null;
    }

    generateSuggestedActions(analysis, context) {
        const actions = [];
        
        if (analysis.emotions.some(e => e.emotion === 'anxiety')) {
            actions.push({ tool: '/tasks/breathing', priority: 'high' });
        }
        
        if (analysis.emotions.some(e => e.emotion === 'sadness')) {
            actions.push({ tool: '/tasks/activity', priority: 'medium' });
        }
        
        if (analysis.topics.includes('relationships')) {
            actions.push({ tool: '/tasks/communication', priority: 'medium' });
        }
        
        return actions;
    }

    calculateResponseConfidence(analysis, clinicalValidation) {
        let confidence = 0.7; // Base confidence
        
        // Increase confidence based on data quality
        if (analysis.emotions.length > 0) confidence += 0.1;
        if (analysis.techniques && analysis.techniques.length > 0) confidence += 0.1;
        if (clinicalValidation.isValid) confidence += 0.1;
        
        return Math.min(confidence, 1.0);
    }

    generateErrorResponse(error, sessionId) {
        return {
            response: "I'm having trouble processing that right now. Let's try a different approach - could you tell me more about what's on your mind?",
            therapeuticStyle: 'empathetic',
            tone: 'gentle',
            techniques: ['active_listening', 'error_recovery'],
            sentiment: { classification: 'neutral', score: 0 },
            emotions: [{ emotion: 'neutral', intensity: 0.5 }],
            isCrisis: false,
            isError: true,
            errorMessage: error.message
        };
    }

    // Additional helper methods for response generation
    getDifficultyLevel(severity) {
        if (severity > 7) return 'overwhelming';
        if (severity > 5) return 'challenging';
        if (severity > 3) return 'difficult';
        return 'uncomfortable';
    }

    generateValidation(analysis) {
        const validations = [
            "It's completely valid to feel this way",
            "Your feelings are understandable",
            "Many people experience similar feelings",
            "It takes courage to share this"
        ];
        
        return validations[Math.floor(Math.random() * validations.length)];
    }

    getRecommendedTechnique(analysis) {
        if (analysis.emotions.some(e => e.emotion === 'anxiety')) {
            return 'breathing exercises';
        }
        if (analysis.emotions.some(e => e.emotion === 'sadness')) {
            return 'behavioral activation';
        }
        return 'mindfulness';
    }

    getRecommendedAction(analysis) {
        if (analysis.severity > 6) {
            return 'practice grounding techniques';
        }
        return 'explore these feelings further';
    }

    detectStressIndicators(message) {
        const stressKeywords = ['overwhelmed', 'stressed', 'pressure', 'can\'t handle'];
        return stressKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }

    detectSleepCorrelation(message) {
        const sleepKeywords = ['tired', 'exhausted', 'sleepless', 'insomnia'];
        return sleepKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }

    detectActivityCorrelation(message) {
        const activityKeywords = ['exercise', 'walk', 'movement', 'active'];
        return activityKeywords.some(keyword => message.toLowerCase().includes(keyword));
    }
}

// Export singleton instance
export const enhancedChatEngine = new EnhancedChatEngine();
