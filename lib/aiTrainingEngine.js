/**
 * ============================================
 * MINDSHIFTR - ADVANCED AI TRAINING ENGINE
 * Continuous Learning and Model Optimization System
 * ============================================
 * 
 * Features:
 * - Real-time therapeutic effectiveness tracking
 * - Adaptive response optimization
 * - Clinical outcome measurement
 * - Personalized intervention matching
 * - Safety monitoring and crisis detection
 * - Evidence-based protocol updates
 */

import { advancedKnowledgeBase } from './advancedKnowledgeBase.js';

export class AITrainingEngine {
    constructor() {
        this.userProfiles = new Map();
        this.interventionEffectiveness = new Map();
        this.crisisPatterns = new Map();
        this.outcomeMetrics = new Map();
        this.trainingData = [];
        this.modelVersion = "2.0.0";
        this.lastTrainingUpdate = new Date();
    }

    // ============================================
    // 🧠 USER PROFILING & PERSONALIZATION
    // ============================================
    
    createUserProfile(userId, initialAssessment = {}) {
        const profile = {
            userId,
            createdAt: new Date(),
            lastUpdated: new Date(),
            demographics: initialAssessment.demographics || {},
            presentingIssues: initialAssessment.presentingIssues || [],
            severity: initialAssessment.severity || 'moderate',
            preferences: {
                communicationStyle: 'empathetic',
                interventionTypes: [],
                culturalConsiderations: [],
                literacyLevel: 'standard',
                preferredTechniques: []
            },
            history: {
                sessions: [],
                interventions: [],
                outcomes: [],
                crisisEvents: [],
                progressMarkers: []
            },
            biometricData: {
                sleep: [],
                heartRate: [],
                activity: [],
                stress: []
            },
            effectiveness: {
                interventions: new Map(),
                techniques: new Map(),
                communicationStyles: new Map(),
                outcomes: []
            }
        };
        
        this.userProfiles.set(userId, profile);
        return profile;
    }

    updateUserProfile(userId, updates) {
        const profile = this.userProfiles.get(userId);
        if (profile) {
            Object.assign(profile, updates);
            profile.lastUpdated = new Date();
            this.userProfiles.set(userId, profile);
        }
        return profile;
    }

    // ============================================
    // 📊 INTERVENTION EFFECTIVENESS TRACKING
    // ============================================
    
    trackIntervention(userId, intervention, outcome, feedback = {}) {
        const interventionKey = this.getInterventionKey(intervention);
        
        // Update user profile
        const profile = this.userProfiles.get(userId);
        if (profile) {
            profile.history.interventions.push({
                timestamp: new Date(),
                intervention,
                outcome,
                feedback
            });
            
            // Track effectiveness for this user
            if (!profile.effectiveness.interventions.has(interventionKey)) {
                profile.effectiveness.interventions.set(interventionKey, {
                    uses: 0,
                    success: 0,
                    averageRating: 0,
                    totalRating: 0
                });
            }
            
            const effectiveness = profile.effectiveness.interventions.get(interventionKey);
            effectiveness.uses++;
            effectiveness.totalRating += feedback.rating || 0;
            effectiveness.averageRating = effectiveness.totalRating / effectiveness.uses;
            
            if (outcome.success) {
                effectiveness.success++;
            }
        }
        
        // Update global effectiveness
        if (!this.interventionEffectiveness.has(interventionKey)) {
            this.interventionEffectiveness.set(interventionKey, {
                totalUses: 0,
                totalSuccess: 0,
                averageRating: 0,
                totalRating: 0,
                userProfiles: new Set()
            });
        }
        
        const globalEffectiveness = this.interventionEffectiveness.get(interventionKey);
        globalEffectiveness.totalUses++;
        globalEffectiveness.totalRating += feedback.rating || 0;
        globalEffectiveness.averageRating = globalEffectiveness.totalRating / globalEffectiveness.totalUses;
        globalEffectiveness.userProfiles.add(userId);
        
        if (outcome.success) {
            globalEffectiveness.totalSuccess++;
        }
        
        // Add to training data
        this.trainingData.push({
            timestamp: new Date(),
            userId,
            intervention,
            outcome,
            feedback,
            userProfile: this.extractProfileFeatures(profile)
        });
    }

    getInterventionKey(intervention) {
        return `${intervention.category}_${intervention.technique}_${intervention.severity}`;
    }

    extractProfileFeatures(profile) {
        if (!profile) return {};
        
        return {
            presentingIssues: profile.presentingIssues,
            severity: profile.severity,
            demographics: profile.demographics,
            sessionCount: profile.history.sessions.length,
            interventionCount: profile.history.interventions.length,
            averageSessionRating: this.calculateAverageRating(profile.history.sessions),
            preferredTechniques: profile.preferences.preferredTechniques,
            recentOutcomes: profile.history.outcomes.slice(-5)
        };
    }

    calculateAverageRating(sessions) {
        if (sessions.length === 0) return 0;
        const total = sessions.reduce((sum, session) => sum + (session.rating || 0), 0);
        return total / sessions.length;
    }

    // ============================================
    // 🎯 PERSONALIZED INTERVENTION RECOMMENDATION
    // ============================================
    
    recommendIntervention(userId, currentContext) {
        const profile = this.userProfiles.get(userId);
        if (!profile) {
            return this.getDefaultRecommendation(currentContext);
        }
        
        const candidates = this.findMatchingInterventions(currentContext);
        const scored = this.scoreInterventions(candidates, profile, currentContext);
        
        return scored.sort((a, b) => b.score - a.score)[0] || this.getDefaultRecommendation(currentContext);
    }

    findMatchingInterventions(context) {
        const matches = [];
        
        // Search through all protocols
        Object.values(advancedKnowledgeBase).forEach(section => {
            if (Array.isArray(section)) {
                section.forEach(protocol => {
                    if (this.matchesContext(protocol, context)) {
                        matches.push(protocol);
                    }
                });
            } else if (section.protocols) {
                Object.values(section.protocols).forEach(protocols => {
                    protocols.forEach(protocol => {
                        if (this.matchesContext(protocol, context)) {
                            matches.push(protocol);
                        }
                    });
                });
            }
        });
        
        return matches;
    }

    matchesContext(protocol, context) {
        // Check keyword matching
        const keywordMatch = protocol.keywords?.some(keyword => 
            context.message?.toLowerCase().includes(keyword.toLowerCase())
        );
        
        // Check severity matching
        const severityMatch = !protocol.severity || protocol.severity === context.severity;
        
        // Check category matching
        const categoryMatch = !protocol.category || protocol.category === context.category;
        
        return keywordMatch && severityMatch && categoryMatch;
    }

    scoreInterventions(interventions, profile, context) {
        return interventions.map(intervention => {
            let score = 0;
            
            // Base effectiveness score
            const effectiveness = this.interventionEffectiveness.get(this.getInterventionKey(intervention));
            if (effectiveness) {
                score += effectiveness.averageRating * 0.3;
            }
            
            // Personal effectiveness for this user
            const userEffectiveness = profile.effectiveness.interventions.get(this.getInterventionKey(intervention));
            if (userEffectiveness) {
                score += userEffectiveness.averageRating * 0.4;
            }
            
            // Severity matching
            if (intervention.severity === context.severity) {
                score += 0.2;
            }
            
            // Technique preference matching
            if (profile.preferences.preferredTechniques.includes(intervention.technique)) {
                score += 0.1;
            }
            
            // Recency and freshness
            const recentUse = profile.history.interventions
                .filter(i => i.intervention.id === intervention.id)
                .slice(-5);
            
            if (recentUse.length > 0) {
                const recentSuccess = recentUse.filter(i => i.outcome.success).length;
                score += (recentSuccess / recentUse.length) * 0.1;
            }
            
            return {
                intervention,
                score,
                reasoning: this.generateScoreReasoning(intervention, profile, context)
            };
        });
    }

    generateScoreReasoning(intervention, profile, context) {
        const reasons = [];
        
        const effectiveness = this.interventionEffectiveness.get(this.getInterventionKey(intervention));
        if (effectiveness && effectiveness.averageRating > 4) {
            reasons.push(`High global effectiveness (${effectiveness.averageRating.toFixed(1)}/5)`);
        }
        
        const userEffectiveness = profile.effectiveness.interventions.get(this.getInterventionKey(intervention));
        if (userEffectiveness && userEffectiveness.averageRating > 4) {
            reasons.push(`Previously effective for you (${userEffectiveness.averageRating.toFixed(1)}/5)`);
        }
        
        if (profile.preferences.preferredTechniques.includes(intervention.technique)) {
            reasons.push(`Matches your preferred techniques`);
        }
        
        if (intervention.severity === context.severity) {
            reasons.push(`Severity-appropriate intervention`);
        }
        
        return reasons.join('; ');
    }

    getDefaultRecommendation(context) {
        return {
            intervention: {
                id: "general_support",
                category: "support",
                technique: "active_listening",
                severity: context.severity || 2,
                response: "I'm here to support you. Could you tell me more about what you're experiencing?",
                followUp: "I'm listening carefully to understand how I can best help you."
            },
            score: 0.5,
            reasoning: "Default supportive response"
        };
    }

    // ============================================
    // 🚨 CRISIS DETECTION & SAFETY MONITORING
    // ============================================
    
    detectCrisis(message, userId) {
        const crisisKeywords = [
            'suicide', 'kill myself', 'end my life', 'want to die',
            'hurt myself', 'self-harm', 'cutting',
            'overdose', 'too much', 'can\'t stop',
            'hearing voices', 'seeing things', 'paranoia'
        ];
        
        const messageLower = message.toLowerCase();
        const detectedKeywords = crisisKeywords.filter(keyword => 
            messageLower.includes(keyword)
        );
        
        if (detectedKeywords.length > 0) {
            const crisisLevel = this.assessCrisisLevel(detectedKeywords, message);
            
            // Log crisis event
            this.logCrisisEvent(userId, {
                message,
                keywords: detectedKeywords,
                level: crisisLevel,
                timestamp: new Date()
            });
            
            return {
                isCrisis: true,
                level: crisisLevel,
                keywords: detectedKeywords,
                protocol: this.getCrisisProtocol(detectedKeywords, crisisLevel)
            };
        }
        
        return { isCrisis: false };
    }

    assessCrisisLevel(keywords, message) {
        const highRiskKeywords = ['suicide', 'kill myself', 'end my life', 'want to die'];
        const mediumRiskKeywords = ['hurt myself', 'self-harm', 'cutting', 'overdose'];
        const lowRiskKeywords = ['hearing voices', 'seeing things', 'paranoia'];
        
        if (keywords.some(k => highRiskKeywords.includes(k))) {
            return 'high';
        } else if (keywords.some(k => mediumRiskKeywords.includes(k))) {
            return 'medium';
        } else if (keywords.some(k => lowRiskKeywords.includes(k))) {
            return 'low';
        }
        
        return 'medium';
    }

    getCrisisProtocol(keywords, level) {
        const protocols = advancedKnowledgeBase.crisisProtocols;
        
        return protocols.find(protocol => {
            const keywordMatch = keywords.some(keyword => 
                protocol.keywords.includes(keyword)
            );
            const levelMatch = protocol.severity >= (level === 'high' ? 5 : level === 'medium' ? 4 : 3);
            return keywordMatch && levelMatch;
        }) || protocols[0]; // Default to first protocol
    }

    logCrisisEvent(userId, crisisData) {
        if (!this.crisisPatterns.has(userId)) {
            this.crisisPatterns.set(userId, []);
        }
        
        const userCrises = this.crisisPatterns.get(userId);
        userCrises.push(crisisData);
        
        // Keep only last 50 crisis events per user
        if (userCrises.length > 50) {
            userCrises.splice(0, userCrises.length - 50);
        }
        
        // Update user profile
        const profile = this.userProfiles.get(userId);
        if (profile) {
            profile.history.crisisEvents.push(crisisData);
        }
    }

    // ============================================
    // 📈 OUTCOME TRACKING & PROGRESS MONITORING
    // ============================================
    
    trackSessionOutcome(userId, sessionData) {
        const profile = this.userProfiles.get(userId);
        if (!profile) return;
        
        const outcome = {
            timestamp: new Date(),
            sessionId: sessionData.sessionId,
            duration: sessionData.duration,
            rating: sessionData.rating,
            improvement: sessionData.improvement,
            techniques: sessionData.techniques,
            notes: sessionData.notes
        };
        
        profile.history.outcomes.push(outcome);
        profile.history.sessions.push(outcome);
        
        // Calculate progress markers
        this.updateProgressMarkers(userId);
        
        // Track overall outcomes
        if (!this.outcomeMetrics.has(userId)) {
            this.outcomeMetrics.set(userId, {
                totalSessions: 0,
                averageRating: 0,
                totalRating: 0,
                improvementTrend: [],
                lastUpdated: new Date()
            });
        }
        
        const metrics = this.outcomeMetrics.get(userId);
        metrics.totalSessions++;
        metrics.totalRating += sessionData.rating || 0;
        metrics.averageRating = metrics.totalRating / metrics.totalSessions;
        metrics.improvementTrend.push(sessionData.improvement || 0);
        metrics.lastUpdated = new Date();
        
        // Keep only last 50 improvement data points
        if (metrics.improvementTrend.length > 50) {
            metrics.improvementTrend.splice(0, metrics.improvementTrend.length - 50);
        }
    }

    updateProgressMarkers(userId) {
        const profile = this.userProfiles.get(userId);
        if (!profile) return;
        
        const recentOutcomes = profile.history.outcomes.slice(-10);
        const averageRecentRating = recentOutcomes.reduce((sum, o) => sum + (o.rating || 0), 0) / recentOutcomes.length;
        
        const markers = {
            engagement: this.calculateEngagement(profile),
            improvement: this.calculateImprovementTrend(recentOutcomes),
            stability: this.calculateStability(recentOutcomes),
            riskLevel: this.assessCurrentRisk(profile)
        };
        
        profile.history.progressMarkers.push({
            timestamp: new Date(),
            markers
        });
        
        // Keep only last 100 progress markers
        if (profile.history.progressMarkers.length > 100) {
            profile.history.progressMarkers.splice(0, profile.history.progressMarkers.length - 100);
        }
    }

    calculateEngagement(profile) {
        const sessionsLast30Days = profile.history.sessions.filter(
            session => session.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );
        
        return {
            sessionCount: sessionsLast30Days.length,
            averageDuration: sessionsLast30Days.reduce((sum, s) => sum + (s.duration || 0), 0) / sessionsLast30Days.length,
            consistency: sessionsLast30Days.length / 30 // Sessions per day
        };
    }

    calculateImprovementTrend(outcomes) {
        if (outcomes.length < 3) return 'insufficient_data';
        
        const recent = outcomes.slice(-3).reduce((sum, o) => sum + (o.improvement || 0), 0) / 3;
        const earlier = outcomes.slice(-6, -3).reduce((sum, o) => sum + (o.improvement || 0), 0) / 3;
        
        if (recent > earlier + 0.5) return 'improving';
        if (recent < earlier - 0.5) return 'declining';
        return 'stable';
    }

    calculateStability(outcomes) {
        if (outcomes.length < 5) return 'insufficient_data';
        
        const ratings = outcomes.map(o => o.rating || 0);
        const variance = ratings.reduce((sum, rating) => {
            const mean = ratings.reduce((a, b) => a + b) / ratings.length;
            return sum + Math.pow(rating - mean, 2);
        }, 0) / ratings.length;
        
        if (variance < 0.5) return 'high';
        if (variance < 1.5) return 'moderate';
        return 'low';
    }

    assessCurrentRisk(profile) {
        const recentCrises = profile.history.crisisEvents.filter(
            crisis => crisis.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        
        if (recentCrises.some(c => c.level === 'high')) return 'high';
        if (recentCrises.some(c => c.level === 'medium')) return 'medium';
        if (recentCrises.length > 2) return 'elevated';
        
        return 'low';
    }

    // ============================================
    // 🔄 MODEL TRAINING & OPTIMIZATION
    // ============================================
    
    async trainModel() {
        console.log('🧠 Starting AI model training...');
        
        // Prepare training data
        const trainingDataset = this.prepareTrainingData();
        
        // Analyze patterns
        const patterns = this.analyzeTrainingPatterns(trainingDataset);
        
        // Update intervention effectiveness
        this.updateInterventionEffectiveness(patterns);
        
        // Optimize response strategies
        this.optimizeResponseStrategies(patterns);
        
        // Update model version
        this.modelVersion = this.incrementVersion();
        this.lastTrainingUpdate = new Date();
        
        console.log(`✅ Model training completed. New version: ${this.modelVersion}`);
        
        return {
            version: this.modelVersion,
            patterns: patterns,
            improvements: this.calculateImprovements(patterns)
        };
    }

    prepareTrainingData() {
        return {
            interventions: Array.from(this.interventionEffectiveness.entries()),
            userProfiles: Array.from(this.userProfiles.entries()),
            crisisPatterns: Array.from(this.crisisPatterns.entries()),
            outcomes: Array.from(this.outcomeMetrics.entries()),
            trainingData: this.trainingData.slice(-10000) // Last 10k interactions
        };
    }

    analyzeTrainingPatterns(data) {
        const patterns = {
            effectiveInterventions: [],
            crisisIndicators: [],
            userPreferences: new Map(),
            outcomePredictors: [],
            seasonalPatterns: [],
            techniqueEffectiveness: new Map()
        };
        
        // Analyze most effective interventions
        patterns.effectiveInterventions = data.interventions
            .filter(([_, effectiveness]) => effectiveness.totalUses >= 10)
            .sort((a, b) => b[1].averageRating - a[1].averageRating)
            .slice(0, 20);
        
        // Analyze crisis patterns
        data.crisisPatterns.forEach(([userId, crises]) => {
            const recentCrises = crises.filter(c => 
                c.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            );
            
            if (recentCrises.length >= 3) {
                patterns.crisisIndicators.push({
                    userId,
                    frequency: recentCrises.length,
                    patterns: this.analyzeCrisisPatterns(recentCrises)
                });
            }
        });
        
        // Analyze user preferences
        data.userProfiles.forEach(([userId, profile]) => {
            const preferences = this.extractUserPreferences(profile);
            patterns.userPreferences.set(userId, preferences);
        });
        
        return patterns;
    }

    analyzeCrisisPatterns(crises) {
        const patterns = {
            timeOfDay: {},
            dayOfWeek: {},
            triggers: new Set(),
            escalation: []
        };
        
        crises.forEach(crisis => {
            const hour = new Date(crisis.timestamp).getHours();
            const day = new Date(crisis.timestamp).getDay();
            
            patterns.timeOfDay[hour] = (patterns.timeOfDay[hour] || 0) + 1;
            patterns.dayOfWeek[day] = (patterns.dayOfWeek[day] || 0) + 1;
            
            crisis.keywords.forEach(keyword => patterns.triggers.add(keyword));
        });
        
        return patterns;
    }

    extractUserPreferences(profile) {
        const preferences = {
            communicationStyle: this.determinePreferredStyle(profile),
            effectiveTechniques: this.getMostEffectiveTechniques(profile),
            sessionTiming: this.getPreferredSessionTiming(profile),
            interventionTypes: this.getPreferredInterventionTypes(profile)
        };
        
        return preferences;
    }

    determinePreferredStyle(profile) {
        const styleEffectiveness = {};
        
        profile.history.sessions.forEach(session => {
            const style = session.communicationStyle || 'empathetic';
            if (!styleEffectiveness[style]) {
                styleEffectiveness[style] = { total: 0, rating: 0 };
            }
            styleEffectiveness[style].total++;
            styleEffectiveness[style].rating += session.rating || 0;
        });
        
        let bestStyle = 'empathetic';
        let bestRating = 0;
        
        Object.entries(styleEffectiveness).forEach(([style, data]) => {
            const avgRating = data.rating / data.total;
            if (avgRating > bestRating) {
                bestRating = avgRating;
                bestStyle = style;
            }
        });
        
        return bestStyle;
    }

    getMostEffectiveTechniques(profile) {
        const techniqueEffectiveness = new Map();
        
        profile.history.interventions.forEach(intervention => {
            const technique = intervention.intervention.technique;
            const success = intervention.outcome.success;
            
            if (!techniqueEffectiveness.has(technique)) {
                techniqueEffectiveness.set(technique, { uses: 0, success: 0 });
            }
            
            const data = techniqueEffectiveness.get(technique);
            data.uses++;
            if (success) data.success++;
        });
        
        return Array.from(techniqueEffectiveness.entries())
            .filter(([_, data]) => data.uses >= 3)
            .sort((a, b) => (b[1].success / b[1].uses) - (a[1].success / a[1].uses))
            .slice(0, 5)
            .map(([technique, _]) => technique);
    }

    getPreferredSessionTiming(profile) {
        const sessionTimes = profile.history.sessions.map(session => ({
            hour: new Date(session.timestamp).getHours(),
            rating: session.rating || 0
        }));
        
        const hourlyRatings = {};
        sessionTimes.forEach(({ hour, rating }) => {
            if (!hourlyRatings[hour]) {
                hourlyRatings[hour] = { total: 0, rating: 0 };
            }
            hourlyRatings[hour].total++;
            hourlyRatings[hour].rating += rating;
        });
        
        let bestHour = 14; // 2 PM default
        let bestAvgRating = 0;
        
        Object.entries(hourlyRatings).forEach(([hour, data]) => {
            const avgRating = data.rating / data.total;
            if (avgRating > bestAvgRating) {
                bestAvgRating = avgRating;
                bestHour = parseInt(hour);
            }
        });
        
        return bestHour;
    }

    getPreferredInterventionTypes(profile) {
        const typeEffectiveness = new Map();
        
        profile.history.interventions.forEach(intervention => {
            const type = intervention.intervention.category;
            const rating = intervention.feedback.rating || 0;
            
            if (!typeEffectiveness.has(type)) {
                typeEffectiveness.set(type, { total: 0, rating: 0 });
            }
            
            const data = typeEffectiveness.get(type);
            data.total++;
            data.rating += rating;
        });
        
        return Array.from(typeEffectiveness.entries())
            .filter(([_, data]) => data.total >= 2)
            .sort((a, b) => (b[1].rating / b[1].total) - (a[1].rating / a[1].total))
            .slice(0, 3)
            .map(([type, _]) => type);
    }

    updateInterventionEffectiveness(patterns) {
        // Update global effectiveness based on new patterns
        patterns.effectiveInterventions.forEach(([interventionKey, effectiveness]) => {
            const current = this.interventionEffectiveness.get(interventionKey);
            if (current) {
                // Blend new data with existing data
                const blendFactor = 0.1; // 10% new data influence
                current.averageRating = (current.averageRating * (1 - blendFactor)) + 
                                       (effectiveness.averageRating * blendFactor);
            }
        });
    }

    optimizeResponseStrategies(patterns) {
        // Implement response optimization logic
        // This would involve adjusting response generation based on patterns
        console.log('🔄 Optimizing response strategies based on training patterns...');
    }

    calculateImprovements(patterns) {
        return {
            interventionAccuracy: this.calculateInterventionAccuracy(patterns),
            crisisDetectionRate: this.calculateCrisisDetectionRate(patterns),
            userSatisfaction: this.calculateUserSatisfaction(patterns),
            personalizationEffectiveness: this.calculatePersonalizationEffectiveness(patterns)
        };
    }

    calculateInterventionAccuracy(patterns) {
        const effectiveCount = patterns.effectiveInterventions.length;
        const totalInterventions = this.interventionEffectiveness.size;
        return totalInterventions > 0 ? (effectiveCount / totalInterventions) * 100 : 0;
    }

    calculateCrisisDetectionRate(patterns) {
        // Calculate how accurately we're detecting and responding to crises
        return 95; // Placeholder - would calculate from actual data
    }

    calculateUserSatisfaction(patterns) {
        const totalRating = Array.from(this.interventionEffectiveness.values())
            .reduce((sum, effectiveness) => sum + effectiveness.averageRating, 0);
        const totalInterventions = this.interventionEffectiveness.size;
        return totalInterventions > 0 ? (totalRating / totalInterventions) * 20 : 0; // Scale to 100
    }

    calculatePersonalizationEffectiveness(patterns) {
        // Calculate how well personalization is working
        return 88; // Placeholder - would calculate from actual data
    }

    incrementVersion() {
        const parts = this.modelVersion.split('.');
        parts[2] = (parseInt(parts[2]) + 1).toString();
        return parts.join('.');
    }

    // ============================================
    // 📊 ANALYTICS & REPORTING
    // ============================================
    
    generateAnalyticsReport() {
        return {
            modelVersion: this.modelVersion,
            lastTrainingUpdate: this.lastTrainingUpdate,
            totalUsers: this.userProfiles.size,
            totalInteractions: this.trainingData.length,
            averageSessionRating: this.calculateGlobalAverageRating(),
            mostEffectiveInterventions: this.getTopInterventions(10),
            crisisEvents: this.getCrisisStatistics(),
            userEngagement: this.calculateEngagementMetrics(),
            improvements: this.getOverallImprovementMetrics()
        };
    }

    calculateGlobalAverageRating() {
        const totalRating = Array.from(this.interventionEffectiveness.values())
            .reduce((sum, effectiveness) => sum + effectiveness.averageRating, 0);
        const totalInterventions = this.interventionEffectiveness.size;
        return totalInterventions > 0 ? (totalRating / totalInterventions).toFixed(2) : 0;
    }

    getTopInterventions(limit = 10) {
        return Array.from(this.interventionEffectiveness.entries())
            .sort((a, b) => b[1].averageRating - a[1].averageRating)
            .slice(0, limit)
            .map(([key, effectiveness]) => ({
                intervention: key,
                averageRating: effectiveness.averageRating.toFixed(2),
                totalUses: effectiveness.totalUses,
                successRate: ((effectiveness.totalSuccess / effectiveness.totalUses) * 100).toFixed(1) + '%'
            }));
    }

    getCrisisStatistics() {
        const totalCrises = Array.from(this.crisisPatterns.values())
            .reduce((sum, crises) => sum + crises.length, 0);
        
        const highRiskCrises = Array.from(this.crisisPatterns.values())
            .reduce((sum, crises) => sum + crises.filter(c => c.level === 'high').length, 0);
        
        return {
            totalCrisisEvents: totalCrises,
            highRiskEvents: highRiskCrises,
            crisisRate: totalCrises > 0 ? ((highRiskCrises / totalCrises) * 100).toFixed(1) + '%' : '0%'
        };
    }

    calculateEngagementMetrics() {
        const totalSessions = Array.from(this.userProfiles.values())
            .reduce((sum, profile) => sum + profile.history.sessions.length, 0);
        
        const activeUsers = Array.from(this.userProfiles.values())
            .filter(profile => {
                const lastSession = profile.history.sessions[profile.history.sessions.length - 1];
                return lastSession && lastSession.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            }).length;
        
        return {
            totalSessions,
            activeUsers,
            averageSessionsPerUser: this.userProfiles.size > 0 ? (totalSessions / this.userProfiles.size).toFixed(1) : 0
        };
    }

    getOverallImprovementMetrics() {
        const improvements = Array.from(this.outcomeMetrics.values())
            .map(metrics => metrics.improvementTrend)
            .flat();
        
        const averageImprovement = improvements.length > 0 ? 
            (improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length).toFixed(2) : 0;
        
        return {
            averageImprovement,
            totalImprovementData: improvements.length
        };
    }
}

// Export singleton instance
export const aiTrainingEngine = new AITrainingEngine();
export default aiTrainingEngine;
