import { NextResponse } from 'next/server';

/**
 * ============================================
 * MINDSHIFTR - SCREENING & ASSESSMENT API
 * Clinical-grade mental health screenings
 * ============================================
 * 
 * Implements validated screening instruments:
 * - PHQ-9 (Depression)
 * - GAD-7 (Anxiety)
 * - PSS-10 (Stress)
 * - PSQI (Sleep Quality)
 */

// ============================================
// SCREENING INSTRUMENTS
// ============================================
const instruments = {
    phq9: {
        name: "PHQ-9 (Patient Health Questionnaire)",
        description: "Depression screening",
        questions: [
            "Little interest or pleasure in doing things",
            "Feeling down, depressed, or hopeless",
            "Trouble falling or staying asleep, or sleeping too much",
            "Feeling tired or having little energy",
            "Poor appetite or overeating",
            "Feeling bad about yourself or that you are a failure",
            "Trouble concentrating on things",
            "Moving or speaking slowly, or being fidgety/restless",
            "Thoughts of self-harm or being better off dead"
        ],
        options: [
            { value: 0, label: "Not at all" },
            { value: 1, label: "Several days" },
            { value: 2, label: "More than half the days" },
            { value: 3, label: "Nearly every day" }
        ],
        scoring: {
            ranges: [
                { min: 0, max: 4, severity: "minimal", recommendation: "Continue self-care practices" },
                { min: 5, max: 9, severity: "mild", recommendation: "Consider wellness activities and monitoring" },
                { min: 10, max: 14, severity: "moderate", recommendation: "Consider professional consultation" },
                { min: 15, max: 19, severity: "moderately severe", recommendation: "Seek professional support" },
                { min: 20, max: 27, severity: "severe", recommendation: "Urgent professional intervention recommended" }
            ],
            maxScore: 27
        }
    },
    gad7: {
        name: "GAD-7 (Generalized Anxiety Disorder)",
        description: "Anxiety screening",
        questions: [
            "Feeling nervous, anxious, or on edge",
            "Not being able to stop or control worrying",
            "Worrying too much about different things",
            "Trouble relaxing",
            "Being so restless that it's hard to sit still",
            "Becoming easily annoyed or irritable",
            "Feeling afraid as if something awful might happen"
        ],
        options: [
            { value: 0, label: "Not at all" },
            { value: 1, label: "Several days" },
            { value: 2, label: "More than half the days" },
            { value: 3, label: "Nearly every day" }
        ],
        scoring: {
            ranges: [
                { min: 0, max: 4, severity: "minimal", recommendation: "Continue monitoring" },
                { min: 5, max: 9, severity: "mild", recommendation: "Practice relaxation techniques" },
                { min: 10, max: 14, severity: "moderate", recommendation: "Consider professional guidance" },
                { min: 15, max: 21, severity: "severe", recommendation: "Seek professional support soon" }
            ],
            maxScore: 21
        }
    },
    pss10: {
        name: "PSS-10 (Perceived Stress Scale)",
        description: "Stress assessment",
        questions: [
            "Been upset because of something that happened unexpectedly",
            "Felt unable to control important things in your life",
            "Felt nervous and stressed",
            "Felt confident about handling personal problems",
            "Felt that things were going your way",
            "Found that you could not cope with all the things you had to do",
            "Been able to control irritations in your life",
            "Felt that you were on top of things",
            "Been angered because of things outside of your control",
            "Felt difficulties were piling up so high you could not overcome them"
        ],
        options: [
            { value: 0, label: "Never" },
            { value: 1, label: "Almost never" },
            { value: 2, label: "Sometimes" },
            { value: 3, label: "Fairly often" },
            { value: 4, label: "Very often" }
        ],
        reverseScored: [3, 4, 6, 7], // 0-indexed: questions 4, 5, 7, 8
        scoring: {
            ranges: [
                { min: 0, max: 13, severity: "low stress", recommendation: "Maintain current coping strategies" },
                { min: 14, max: 26, severity: "moderate stress", recommendation: "Consider stress management techniques" },
                { min: 27, max: 40, severity: "high stress", recommendation: "Prioritize stress reduction immediately" }
            ],
            maxScore: 40
        }
    },
    burnout: {
        name: "Burnout Assessment",
        description: "Work-related exhaustion screening",
        questions: [
            "I feel emotionally drained from my work",
            "I feel used up at the end of the workday",
            "I feel fatigued when I get up to face another day",
            "Working with people all day is really a strain for me",
            "I feel burned out from my work",
            "I feel I'm working too hard on my job",
            "I feel frustrated by my job",
            "I feel like I'm at the end of my rope"
        ],
        options: [
            { value: 0, label: "Never" },
            { value: 1, label: "Rarely" },
            { value: 2, label: "Sometimes" },
            { value: 3, label: "Often" },
            { value: 4, label: "Always" }
        ],
        scoring: {
            ranges: [
                { min: 0, max: 8, severity: "low burnout", recommendation: "You're managing well, keep it up!" },
                { min: 9, max: 16, severity: "moderate burnout", recommendation: "Consider setting better boundaries" },
                { min: 17, max: 24, severity: "high burnout", recommendation: "Time to seriously evaluate work-life balance" },
                { min: 25, max: 32, severity: "severe burnout", recommendation: "Urgent need for rest and possibly professional support" }
            ],
            maxScore: 32
        }
    }
};

// Store for screening results (in production, use a database)
let screeningResults = [];

// ============================================
// GET - Retrieve Screening Instrument
// ============================================
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const resultId = searchParams.get('resultId');

        // If resultId provided, return specific result
        if (resultId) {
            const result = screeningResults.find(r => r.id === resultId);
            if (!result) {
                return NextResponse.json({ error: 'Result not found' }, { status: 404 });
            }
            return NextResponse.json(result);
        }

        // If type provided, return specific instrument
        if (type && instruments[type]) {
            return NextResponse.json({
                instrument: {
                    type,
                    ...instruments[type],
                    questionCount: instruments[type].questions.length
                }
            });
        }

        // Return list of available instruments
        return NextResponse.json({
            availableScreenings: Object.entries(instruments).map(([key, value]) => ({
                type: key,
                name: value.name,
                description: value.description,
                questionCount: value.questions.length,
                estimatedTime: `${Math.ceil(value.questions.length * 0.5)} minutes`
            }))
        });

    } catch (error) {
        console.error('[Screening API Error]:', error);
        return NextResponse.json({ error: 'Failed to retrieve screening data' }, { status: 500 });
    }
}

// ============================================
// POST - Submit Screening Responses
// ============================================
export async function POST(req) {
    try {
        const body = await req.json();
        const { type, responses, userId = 'anonymous' } = body;

        if (!type || !instruments[type]) {
            return NextResponse.json({ error: 'Invalid screening type' }, { status: 400 });
        }

        if (!responses || !Array.isArray(responses)) {
            return NextResponse.json({ error: 'Invalid responses format' }, { status: 400 });
        }

        const instrument = instruments[type];

        // Validate response count
        if (responses.length !== instrument.questions.length) {
            return NextResponse.json({
                error: `Expected ${instrument.questions.length} responses, got ${responses.length}`
            }, { status: 400 });
        }

        // Calculate score
        let totalScore = 0;
        const responseDetails = responses.map((value, index) => {
            let adjustedValue = value;

            // Handle reverse-scored items (for PSS-10)
            if (instrument.reverseScored && instrument.reverseScored.includes(index)) {
                const maxOptionValue = Math.max(...instrument.options.map(o => o.value));
                adjustedValue = maxOptionValue - value;
            }

            totalScore += adjustedValue;

            return {
                question: instrument.questions[index],
                response: value,
                adjustedScore: adjustedValue
            };
        });

        // Determine severity
        const scoringResult = instrument.scoring.ranges.find(
            range => totalScore >= range.min && totalScore <= range.max
        );

        // Generate personalized recommendations
        const recommendations = generateRecommendations(type, totalScore, scoringResult.severity);

        // Create result object
        const result = {
            id: `scr_${Date.now()}`,
            userId,
            type,
            instrumentName: instrument.name,
            timestamp: new Date().toISOString(),
            score: totalScore,
            maxScore: instrument.scoring.maxScore,
            percentage: Math.round((totalScore / instrument.scoring.maxScore) * 100),
            severity: scoringResult.severity,
            clinicalRecommendation: scoringResult.recommendation,
            personalizedRecommendations: recommendations,
            responseDetails,
            disclaimer: "This screening is for informational purposes only and is not a clinical diagnosis. Please consult a mental health professional for proper evaluation."
        };

        // Store result
        screeningResults.push(result);

        // Keep only last 100 results (memory management)
        if (screeningResults.length > 100) {
            screeningResults = screeningResults.slice(-100);
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('[Screening API Error]:', error);
        return NextResponse.json({ error: 'Failed to process screening' }, { status: 500 });
    }
}

// ============================================
// RECOMMENDATION GENERATOR
// ============================================
function generateRecommendations(type, score, severity) {
    const recommendations = [];

    // Universal recommendations
    recommendations.push({
        category: 'self-care',
        title: 'Daily Check-ins',
        description: 'Track your mood daily to identify patterns',
        tool: '/dashboard',
        priority: 'medium'
    });

    // Type-specific recommendations
    switch (type) {
        case 'phq9':
            if (severity === 'severe' || severity === 'moderately severe') {
                recommendations.unshift({
                    category: 'professional',
                    title: 'Seek Professional Support',
                    description: 'Your responses suggest you may benefit from speaking with a mental health professional',
                    tool: '/therapists',
                    priority: 'high'
                });
            }
            recommendations.push({
                category: 'activity',
                title: 'Behavioral Activation',
                description: 'Small activities can help lift mood, even when motivation is low',
                tool: '/library',
                priority: 'medium'
            });
            recommendations.push({
                category: 'social',
                title: 'Social Connection',
                description: 'Reaching out to others, even briefly, can help with depressive feelings',
                tool: '/community',
                priority: 'low'
            });
            break;

        case 'gad7':
            recommendations.push({
                category: 'relaxation',
                title: 'Breathing Exercises',
                description: 'Controlled breathing can help calm your nervous system',
                tool: '/tasks/breathing',
                priority: 'high'
            });
            recommendations.push({
                category: 'grounding',
                title: 'Grounding Techniques',
                description: 'Learn to anchor yourself when anxiety spikes',
                tool: '/tasks/grounding',
                priority: 'high'
            });
            recommendations.push({
                category: 'cognitive',
                title: 'Thought Challenging',
                description: 'Learn to identify and reframe anxious thoughts',
                tool: '/cbt',
                priority: 'medium'
            });
            break;

        case 'pss10':
            recommendations.push({
                category: 'stress',
                title: 'Stress Journal',
                description: 'Identify your stress triggers by writing about them',
                tool: '/tasks/journal',
                priority: 'high'
            });
            recommendations.push({
                category: 'boundaries',
                title: 'Boundary Setting',
                description: 'Learn to say no and protect your energy',
                tool: '/library',
                priority: 'medium'
            });
            break;

        case 'burnout':
            recommendations.push({
                category: 'rest',
                title: 'Rest Protocol',
                description: 'Prioritize genuine rest without screens',
                tool: '/library',
                priority: 'high'
            });
            recommendations.push({
                category: 'boundaries',
                title: 'Work-Life Boundaries',
                description: 'Create clear separation between work and personal time',
                tool: '/tasks/journal',
                priority: 'high'
            });
            if (severity === 'severe burnout') {
                recommendations.unshift({
                    category: 'professional',
                    title: 'Consider Time Off',
                    description: 'Severe burnout may require extended rest and professional guidance',
                    tool: '/therapists',
                    priority: 'high'
                });
            }
            break;
    }

    // AI Companion always available
    recommendations.push({
        category: 'support',
        title: 'Talk to MindshiftR AI',
        description: 'Our AI companion is available 24/7 for support',
        tool: '/bot',
        priority: 'low'
    });

    return recommendations;
}
