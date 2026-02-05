import { NextResponse } from 'next/server';

/**
 * ============================================
 * MINDSHIFTR - HEALTH VITALS ANALYSIS API
 * Mental Health Detection from Biometric Data
 * ============================================
 * 
 * This algorithm analyzes wearable data to identify
 * potential mental health patterns and provide
 * early intervention recommendations.
 * 
 * Data Sources:
 * - Heart Rate Variability (HRV)
 * - Resting Heart Rate (RHR)
 * - Sleep Quality & Duration
 * - Activity Levels & Steps
 * - Respiratory Rate
 * - Stress Indicators
 */

// ============================================
// BASELINE THRESHOLDS (Population Averages)
// ============================================
const THRESHOLDS = {
    hrv: {
        low: 20,      // ms - Indicates high stress/poor recovery
        normal: 50,   // ms - Healthy baseline
        high: 80      // ms - Excellent recovery state
    },
    restingHR: {
        low: 50,      // bpm - Athletic/well-rested
        normal: 70,   // bpm - Healthy average
        elevated: 85, // bpm - Potential stress/anxiety
        high: 100     // bpm - Concerning, may indicate panic/illness
    },
    sleep: {
        poor: 5,      // hours
        minimum: 6,
        optimal: 7.5,
        oversleep: 10 // Can indicate depression
    },
    deepSleep: {
        low: 10,      // % - Indicates poor recovery
        optimal: 20   // % - Healthy deep sleep ratio
    },
    activity: {
        sedentary: 2000,   // steps
        low: 5000,
        moderate: 7500,
        active: 10000
    },
    respiratoryRate: {
        low: 12,      // breaths/min
        normal: 16,
        elevated: 20,
        high: 24
    }
};

// ============================================
// MENTAL HEALTH PATTERN SIGNATURES
// ============================================
const PATTERN_SIGNATURES = {
    anxiety: {
        description: "Anxiety Pattern Detected",
        indicators: [
            "Elevated resting heart rate",
            "Low HRV during rest",
            "Disrupted sleep onset",
            "Elevated respiratory rate"
        ],
        recommendations: [
            { type: "breathing", priority: "high", task: "4-7-8 Breathing Exercise", path: "/tasks/breathing" },
            { type: "grounding", priority: "high", task: "5-4-3-2-1 Grounding", path: "/tasks/grounding" },
            { type: "screening", priority: "medium", task: "Take GAD-7 Assessment", path: "/screening?type=gad7" }
        ]
    },
    depression: {
        description: "Depression Risk Indicators",
        indicators: [
            "Reduced activity levels",
            "Oversleeping or disrupted sleep",
            "Irregular circadian rhythm",
            "Decreased HRV variability over time"
        ],
        recommendations: [
            { type: "activity", priority: "high", task: "10-Minute Walk", path: "/tasks/activity" },
            { type: "screening", priority: "high", task: "Take PHQ-9 Assessment", path: "/screening?type=phq9" },
            { type: "social", priority: "medium", task: "Reach Out to Someone", path: "/community" }
        ]
    },
    burnout: {
        description: "Burnout Pattern Detected",
        indicators: [
            "Chronically low HRV",
            "Poor sleep quality despite adequate duration",
            "Elevated baseline heart rate",
            "Reduced recovery during rest"
        ],
        recommendations: [
            { type: "rest", priority: "high", task: "Digital Detox Session", path: "/tasks/journal" },
            { type: "screening", priority: "high", task: "Burnout Assessment", path: "/screening?type=burnout" },
            { type: "boundary", priority: "medium", task: "Set a Work Boundary", path: "/library" }
        ]
    },
    stress: {
        description: "Acute Stress Response",
        indicators: [
            "Sudden HRV drop",
            "Elevated heart rate spikes",
            "Increased respiratory rate",
            "Restless sleep periods"
        ],
        recommendations: [
            { type: "breathing", priority: "high", task: "Box Breathing", path: "/tasks/breathing" },
            { type: "chat", priority: "medium", task: "Talk to AI Companion", path: "/bot" },
            { type: "screening", priority: "low", task: "Stress Assessment", path: "/screening?type=pss10" }
        ]
    },
    recovery: {
        description: "Good Recovery State",
        indicators: [
            "Healthy HRV levels",
            "Optimal sleep duration",
            "Consistent activity",
            "Stable heart rate"
        ],
        recommendations: [
            { type: "maintenance", priority: "low", task: "Continue Current Habits", path: "/dashboard" },
            { type: "growth", priority: "low", task: "Journal Your Wins", path: "/tasks/journal" }
        ]
    }
};

// ============================================
// WELLNESS SCORE ALGORITHM
// ============================================
function calculateWellnessScore(vitals, userBaseline = null) {
    const scores = {
        cardiovascular: 0,
        sleep: 0,
        activity: 0,
        stress: 0,
        recovery: 0
    };

    const baseline = userBaseline || {
        avgHRV: 50,
        avgRHR: 70,
        avgSleep: 7,
        avgSteps: 7000
    };

    // 1. Cardiovascular Score (0-100)
    if (vitals.hrv) {
        const hrvScore = Math.min(100, (vitals.hrv / baseline.avgHRV) * 80);
        const rhrScore = vitals.restingHR
            ? Math.max(0, 100 - ((vitals.restingHR - 50) * 2))
            : 70;
        scores.cardiovascular = (hrvScore * 0.6) + (rhrScore * 0.4);
    }

    // 2. Sleep Score (0-100)
    if (vitals.sleepHours !== undefined) {
        const durationScore = vitals.sleepHours >= 7 && vitals.sleepHours <= 9
            ? 100
            : Math.max(0, 100 - Math.abs(vitals.sleepHours - 7.5) * 15);

        const qualityScore = vitals.sleepQuality !== undefined
            ? vitals.sleepQuality
            : 70;

        const deepSleepScore = vitals.deepSleepPercent
            ? Math.min(100, (vitals.deepSleepPercent / 20) * 100)
            : 60;

        scores.sleep = (durationScore * 0.4) + (qualityScore * 0.35) + (deepSleepScore * 0.25);
    }

    // 3. Activity Score (0-100)
    if (vitals.steps !== undefined) {
        scores.activity = Math.min(100, (vitals.steps / 10000) * 100);

        // Bonus for hitting activity minutes
        if (vitals.activeMinutes && vitals.activeMinutes >= 30) {
            scores.activity = Math.min(100, scores.activity + 10);
        }
    }

    // 4. Stress Score (inverse - lower is better for mental health)
    const stressIndicators = [];

    if (vitals.hrv && vitals.hrv < THRESHOLDS.hrv.low) {
        stressIndicators.push(30);
    }
    if (vitals.restingHR && vitals.restingHR > THRESHOLDS.restingHR.elevated) {
        stressIndicators.push(25);
    }
    if (vitals.respiratoryRate && vitals.respiratoryRate > THRESHOLDS.respiratoryRate.elevated) {
        stressIndicators.push(20);
    }
    if (vitals.sleepHours && vitals.sleepHours < THRESHOLDS.sleep.poor) {
        stressIndicators.push(25);
    }

    const totalStress = stressIndicators.reduce((a, b) => a + b, 0);
    scores.stress = Math.max(0, 100 - totalStress);

    // 5. Recovery Score (based on trends)
    const recoveryFactors = [];

    if (vitals.hrv && vitals.hrv > baseline.avgHRV) {
        recoveryFactors.push(25);
    }
    if (vitals.sleepHours && vitals.sleepHours >= 7) {
        recoveryFactors.push(25);
    }
    if (vitals.restingHR && vitals.restingHR <= baseline.avgRHR) {
        recoveryFactors.push(25);
    }
    if (vitals.steps && vitals.steps >= 5000) {
        recoveryFactors.push(25);
    }

    scores.recovery = recoveryFactors.reduce((a, b) => a + b, 0);

    // Calculate composite wellness score
    const weights = {
        cardiovascular: 0.25,
        sleep: 0.30,
        activity: 0.15,
        stress: 0.15,
        recovery: 0.15
    };

    const compositeScore = Object.keys(scores).reduce((total, key) => {
        return total + (scores[key] * weights[key]);
    }, 0);

    return {
        composite: Math.round(compositeScore),
        breakdown: {
            cardiovascular: Math.round(scores.cardiovascular),
            sleep: Math.round(scores.sleep),
            activity: Math.round(scores.activity),
            stress: Math.round(scores.stress),
            recovery: Math.round(scores.recovery)
        }
    };
}

// ============================================
// PATTERN DETECTION ALGORITHM
// ============================================
function detectMentalHealthPatterns(vitals, history = []) {
    const patterns = [];
    const alerts = [];

    // Anxiety Detection
    const anxietyScore = calculateAnxietyRisk(vitals);
    if (anxietyScore > 60) {
        patterns.push({
            pattern: 'anxiety',
            confidence: anxietyScore,
            ...PATTERN_SIGNATURES.anxiety
        });
    }

    // Depression Risk Detection
    const depressionScore = calculateDepressionRisk(vitals, history);
    if (depressionScore > 50) {
        patterns.push({
            pattern: 'depression',
            confidence: depressionScore,
            ...PATTERN_SIGNATURES.depression
        });
    }

    // Burnout Detection
    const burnoutScore = calculateBurnoutRisk(vitals, history);
    if (burnoutScore > 55) {
        patterns.push({
            pattern: 'burnout',
            confidence: burnoutScore,
            ...PATTERN_SIGNATURES.burnout
        });
    }

    // Acute Stress Detection
    const stressScore = calculateStressLevel(vitals);
    if (stressScore > 70) {
        patterns.push({
            pattern: 'stress',
            confidence: stressScore,
            ...PATTERN_SIGNATURES.stress
        });

        if (stressScore > 85) {
            alerts.push({
                type: 'high_stress',
                message: 'Your vitals indicate high stress. Consider taking a break.',
                urgency: 'medium'
            });
        }
    }

    // Good Recovery Detection
    if (patterns.length === 0) {
        const recoveryScore = calculateRecoveryState(vitals);
        if (recoveryScore > 70) {
            patterns.push({
                pattern: 'recovery',
                confidence: recoveryScore,
                ...PATTERN_SIGNATURES.recovery
            });
        }
    }

    // Critical Alerts
    if (vitals.restingHR && vitals.restingHR > 100) {
        alerts.push({
            type: 'elevated_hr',
            message: 'Your heart rate is elevated. If this persists, consider consulting a doctor.',
            urgency: 'high'
        });
    }

    if (vitals.sleepHours && vitals.sleepHours < 4) {
        alerts.push({
            type: 'severe_sleep_deficit',
            message: 'Severe sleep deficit detected. This can significantly impact mental health.',
            urgency: 'high'
        });
    }

    return { patterns, alerts };
}

// ============================================
// RISK CALCULATION FUNCTIONS
// ============================================
function calculateAnxietyRisk(vitals) {
    let score = 0;
    let factors = 0;

    if (vitals.hrv !== undefined) {
        factors++;
        if (vitals.hrv < THRESHOLDS.hrv.low) score += 35;
        else if (vitals.hrv < THRESHOLDS.hrv.normal) score += 15;
    }

    if (vitals.restingHR !== undefined) {
        factors++;
        if (vitals.restingHR > THRESHOLDS.restingHR.high) score += 30;
        else if (vitals.restingHR > THRESHOLDS.restingHR.elevated) score += 20;
    }

    if (vitals.respiratoryRate !== undefined) {
        factors++;
        if (vitals.respiratoryRate > THRESHOLDS.respiratoryRate.high) score += 25;
        else if (vitals.respiratoryRate > THRESHOLDS.respiratoryRate.elevated) score += 15;
    }

    if (vitals.sleepOnsetLatency !== undefined) {
        factors++;
        if (vitals.sleepOnsetLatency > 30) score += 20; // More than 30 min to fall asleep
    }

    return factors > 0 ? Math.min(100, (score / factors) * 2.5) : 0;
}

function calculateDepressionRisk(vitals, history = []) {
    let score = 0;
    let factors = 0;

    // Activity decrease
    if (vitals.steps !== undefined) {
        factors++;
        if (vitals.steps < THRESHOLDS.activity.sedentary) score += 30;
        else if (vitals.steps < THRESHOLDS.activity.low) score += 15;
    }

    // Sleep disturbance (too much or too little)
    if (vitals.sleepHours !== undefined) {
        factors++;
        if (vitals.sleepHours > THRESHOLDS.sleep.oversleep) score += 25;
        else if (vitals.sleepHours < THRESHOLDS.sleep.poor) score += 20;
    }

    // HRV variability decline over time
    if (history.length >= 7) {
        factors++;
        const recentHRV = history.slice(-3).map(h => h.hrv).filter(Boolean);
        const olderHRV = history.slice(-7, -3).map(h => h.hrv).filter(Boolean);

        if (recentHRV.length && olderHRV.length) {
            const recentAvg = recentHRV.reduce((a, b) => a + b, 0) / recentHRV.length;
            const olderAvg = olderHRV.reduce((a, b) => a + b, 0) / olderHRV.length;

            if (recentAvg < olderAvg * 0.8) score += 25; // 20% decline
        }
    }

    // Circadian rhythm disruption
    if (vitals.sleepMidpoint !== undefined) {
        factors++;
        // Ideal sleep midpoint around 3-4 AM
        if (vitals.sleepMidpoint > 6 || vitals.sleepMidpoint < 1) score += 20;
    }

    return factors > 0 ? Math.min(100, (score / factors) * 2.5) : 0;
}

function calculateBurnoutRisk(vitals, history = []) {
    let score = 0;
    let factors = 0;

    // Chronically low HRV
    if (history.length >= 5) {
        factors++;
        const avgHRV = history.slice(-5).map(h => h.hrv).filter(Boolean);
        if (avgHRV.length) {
            const avg = avgHRV.reduce((a, b) => a + b, 0) / avgHRV.length;
            if (avg < THRESHOLDS.hrv.low) score += 35;
            else if (avg < THRESHOLDS.hrv.normal * 0.7) score += 20;
        }
    }

    // Poor sleep quality despite adequate duration
    if (vitals.sleepHours >= 7 && vitals.sleepQuality !== undefined) {
        factors++;
        if (vitals.sleepQuality < 50) score += 30;
    }

    // Elevated baseline heart rate
    if (vitals.restingHR !== undefined) {
        factors++;
        if (vitals.restingHR > THRESHOLDS.restingHR.elevated) score += 25;
    }

    // Reduced recovery during rest (HRV doesn't improve after sleep)
    if (vitals.morningHRV !== undefined && vitals.eveningHRV !== undefined) {
        factors++;
        if (vitals.morningHRV < vitals.eveningHRV) score += 20;
    }

    return factors > 0 ? Math.min(100, (score / factors) * 2.5) : 0;
}

function calculateStressLevel(vitals) {
    let score = 0;

    if (vitals.hrv && vitals.hrv < THRESHOLDS.hrv.normal) {
        score += (THRESHOLDS.hrv.normal - vitals.hrv) * 1.5;
    }

    if (vitals.restingHR && vitals.restingHR > THRESHOLDS.restingHR.normal) {
        score += (vitals.restingHR - THRESHOLDS.restingHR.normal) * 1.2;
    }

    if (vitals.respiratoryRate && vitals.respiratoryRate > THRESHOLDS.respiratoryRate.normal) {
        score += (vitals.respiratoryRate - THRESHOLDS.respiratoryRate.normal) * 3;
    }

    return Math.min(100, score);
}

function calculateRecoveryState(vitals) {
    let score = 50; // Baseline

    if (vitals.hrv && vitals.hrv > THRESHOLDS.hrv.normal) {
        score += 15;
    }
    if (vitals.sleepHours >= 7 && vitals.sleepHours <= 9) {
        score += 15;
    }
    if (vitals.sleepQuality && vitals.sleepQuality > 70) {
        score += 10;
    }
    if (vitals.steps && vitals.steps > THRESHOLDS.activity.moderate) {
        score += 10;
    }

    return Math.min(100, score);
}

// ============================================
// GENERATE PERSONALIZED RECOMMENDATIONS
// ============================================
function generateRecommendations(patterns, wellnessScore, vitals) {
    const recommendations = [];
    const seenTypes = new Set();

    // Add pattern-based recommendations
    patterns.forEach(pattern => {
        pattern.recommendations.forEach(rec => {
            if (!seenTypes.has(rec.type)) {
                seenTypes.add(rec.type);
                recommendations.push({
                    ...rec,
                    reason: pattern.description
                });
            }
        });
    });

    // Add score-based recommendations
    if (wellnessScore.breakdown.sleep < 50 && !seenTypes.has('sleep')) {
        recommendations.push({
            type: 'sleep',
            priority: 'high',
            task: 'Sleep Hygiene Review',
            path: '/library',
            reason: 'Your sleep score is below optimal'
        });
    }

    if (wellnessScore.breakdown.activity < 40 && !seenTypes.has('activity')) {
        recommendations.push({
            type: 'activity',
            priority: 'medium',
            task: '10-Minute Movement Break',
            path: '/tasks/activity',
            reason: 'Low activity detected'
        });
    }

    if (wellnessScore.breakdown.stress < 50 && !seenTypes.has('breathing')) {
        recommendations.push({
            type: 'breathing',
            priority: 'high',
            task: 'Quick Breathing Exercise',
            path: '/tasks/breathing',
            reason: 'Elevated stress indicators'
        });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return recommendations.slice(0, 5); // Top 5 recommendations
}

// ============================================
// API HANDLERS
// ============================================
export async function POST(req) {
    try {
        const body = await req.json();
        const { vitals, userId = 'anonymous', history = [] } = body;

        if (!vitals) {
            return NextResponse.json({ error: 'Vitals data required' }, { status: 400 });
        }

        // Calculate wellness score
        const wellnessScore = calculateWellnessScore(vitals);

        // Detect mental health patterns
        const { patterns, alerts } = detectMentalHealthPatterns(vitals, history);

        // Generate personalized recommendations
        const recommendations = generateRecommendations(patterns, wellnessScore, vitals);

        // Prepare response
        const response = {
            timestamp: new Date().toISOString(),
            userId,
            wellnessScore: wellnessScore.composite,
            scoreBreakdown: wellnessScore.breakdown,
            detectedPatterns: patterns.map(p => ({
                pattern: p.pattern,
                confidence: Math.round(p.confidence),
                description: p.description,
                indicators: p.indicators
            })),
            alerts,
            recommendations,
            insights: generateInsights(wellnessScore, patterns, vitals),
            rawVitals: vitals
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('[Health Vitals API Error]:', error);
        return NextResponse.json({ error: 'Failed to analyze vitals' }, { status: 500 });
    }
}

// Generate human-readable insights
function generateInsights(wellnessScore, patterns, vitals) {
    const insights = [];

    // Overall wellness insight
    if (wellnessScore.composite >= 80) {
        insights.push({
            type: 'positive',
            message: "Your vitals look excellent today! You're in a great state for tackling challenges."
        });
    } else if (wellnessScore.composite >= 60) {
        insights.push({
            type: 'neutral',
            message: "Your wellness is moderate. Some areas could use attention, but you're doing okay."
        });
    } else {
        insights.push({
            type: 'concern',
            message: "Your vitals suggest you might be under stress or not well-rested. Be gentle with yourself today."
        });
    }

    // Specific insights
    if (vitals.hrv && vitals.hrv < 30) {
        insights.push({
            type: 'alert',
            message: "Your HRV is quite low, which often indicates stress or fatigue. Consider taking a break."
        });
    }

    if (vitals.sleepHours && vitals.sleepHours < 6) {
        insights.push({
            type: 'alert',
            message: `You only got ${vitals.sleepHours} hours of sleep. Sleep debt can accumulate and affect mood.`
        });
    }

    if (patterns.some(p => p.pattern === 'anxiety')) {
        insights.push({
            type: 'suggestion',
            message: "Your nervous system might be activated. A few minutes of slow breathing can help."
        });
    }

    return insights;
}

export async function GET(req) {
    return NextResponse.json({
        service: 'MindshiftR Health Vitals Analysis',
        version: '1.0.0',
        supportedMetrics: [
            'hrv', 'restingHR', 'sleepHours', 'sleepQuality', 'deepSleepPercent',
            'steps', 'activeMinutes', 'respiratoryRate', 'sleepOnsetLatency',
            'morningHRV', 'eveningHRV', 'sleepMidpoint'
        ],
        patterns: Object.keys(PATTERN_SIGNATURES),
        thresholds: THRESHOLDS
    });
}
