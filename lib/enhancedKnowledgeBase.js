/**
 * ============================================
 * MINDSHIFTR - ENHANCED KNOWLEDGE BASE
 * Clinical Protocols and Therapeutic Guidelines
 * ============================================
 */

export const enhancedKnowledgeBase = {
    // Crisis protocols for immediate intervention
    crisisProtocols: [
        {
            id: 'suicide_prevention',
            keywords: ['suicide', 'kill myself', 'end my life', 'want to die'],
            severity: 10,
            response: {
                immediate: "I'm deeply concerned about you, and I want you to know that your life matters. Please reach out to the 988 Suicide & Crisis Lifeline - they're available 24/7 at 988.",
                resources: [
                    { name: '988 Suicide & Crisis Lifeline', contact: '988', type: 'hotline' },
                    { name: 'Crisis Text Line', contact: 'Text HOME to 741741', type: 'text' }
                ]
            }
        },
        {
            id: 'self_harm',
            keywords: ['hurt myself', 'self harm', 'cut myself'],
            severity: 8,
            response: {
                immediate: "I'm concerned about your safety. Please reach out to the Crisis Text Line by texting HOME to 741741, or call 988.",
                resources: [
                    { name: 'Crisis Text Line', contact: 'Text HOME to 741741', type: 'text' },
                    { name: '988 Suicide & Crisis Lifeline', contact: '988', type: 'hotline' }
                ]
            }
        }
    ],

    // Therapeutic techniques and interventions
    therapeuticTechniques: {
        anxiety_management: {
            name: 'Anxiety Management',
            description: 'Techniques to manage anxiety symptoms',
            interventions: [
                {
                    type: 'breathing_exercise',
                    name: '4-7-8 Breathing',
                    instructions: 'Breathe in for 4 counts, hold for 7, exhale for 8',
                    duration: '5 minutes'
                },
                {
                    type: 'grounding',
                    name: '5-4-3-2-1 Grounding',
                    instructions: 'Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste',
                    duration: '3 minutes'
                }
            ]
        },
        cognitive_restructuring: {
            name: 'Cognitive Restructuring',
            description: 'Identify and challenge negative thought patterns',
            interventions: [
                {
                    type: 'thought_record',
                    name: 'Thought Recording',
                    instructions: 'Record the situation, thoughts, emotions, and alternative perspectives',
                    duration: '10 minutes'
                }
            ]
        },
        mindfulness: {
            name: 'Mindfulness Practices',
            description: 'Present-moment awareness techniques',
            interventions: [
                {
                    type: 'body_scan',
                    name: 'Body Scan Meditation',
                    instructions: 'Systematically focus on different parts of your body',
                    duration: '15 minutes'
                }
            ]
        }
    },

    // Emotional support protocols
    emotionalSupport: {
        sadness: {
            validation: "It's completely understandable to feel sad. These feelings are valid and important.",
            techniques: ['self_compassion', 'behavioral_activation', 'emotional_processing'],
            followUp: "Would you like to explore what might be contributing to these feelings?"
        },
        anger: {
            validation: "Anger is a natural emotion that often signals something important to us.",
            techniques: ['anger_management', 'cognitive_reframing', 'relaxation_techniques'],
            followUp: "What do you think triggered this anger?"
        },
        fear: {
            validation: "Fear is our body's way of protecting us. It's okay to feel scared.",
            techniques: ['exposure_techniques', 'relaxation', 'cognitive_challenging'],
            followUp: "What specifically are you afraid might happen?"
        }
    },

    // Educational content
    educationalContent: {
        cognitive_distortions: {
            title: 'Understanding Cognitive Distortions',
            content: 'Cognitive distortions are biased ways of thinking that can reinforce negative emotions. Common patterns include all-or-nothing thinking, overgeneralization, and mental filtering.',
            examples: [
                'All-or-nothing: "If I\'m not perfect, I\'m a failure"',
                'Overgeneralization: "I always mess things up"',
                'Mental filter: "Only focusing on the negative"'
            ]
        },
        anxiety_education: {
            title: 'Understanding Anxiety',
            content: 'Anxiety is a normal stress response, but chronic anxiety can interfere with daily life. Learning to manage anxiety involves both understanding its causes and developing coping strategies.',
            symptoms: ['Racing thoughts', 'Physical tension', 'Avoidance behaviors', 'Sleep disturbances']
        }
    },

    // Cultural adaptations
    culturalAdaptations: {
        western: {
            communication_style: 'direct and expressive',
            values: ['individualism', 'personal achievement', 'emotional openness'],
            adaptations: ['Use direct therapeutic language', 'Encourage emotional expression', 'Focus on personal goals']
        },
        eastern: {
            communication_style: 'indirect and harmonious',
            values: ['collectivism', 'family harmony', 'respect for authority'],
            adaptations: ['Use indirect language', 'Consider family context', 'Emphasize balance and harmony']
        },
        latino: {
            communication_style: 'warm and relational',
            values: ['familismo', 'personalismo', 'respeto'],
            adaptations: ['Include family context', 'Use warm personal approach', 'Show respect for cultural values']
        }
    },

    // Accessibility features
    accessibilityFeatures: {
        visual_impairments: {
            adaptations: ['Screen reader compatibility', 'High contrast mode', 'Large text options', 'Audio descriptions'],
            techniques: ['Verbal descriptions of visual content', 'Audio-first approach', 'Simplified navigation']
        },
        hearing_impairments: {
            adaptations: ['Caption support', 'Visual indicators', 'Text-based alternatives', 'Vibration feedback'],
            techniques: ['Visual emotion indicators', 'Text-based exercises', 'Sign language considerations']
        },
        cognitive_disabilities: {
            adaptations: ['Simplified language', 'Step-by-step instructions', 'Consistent layout', 'Longer time limits'],
            techniques: ['Break down complex concepts', 'Use concrete examples', 'Provide repetition and review']
        }
    },

    // Multi-modal response templates
    multiModalTemplates: {
        text: {
            empathetic: {
                tone: 'warm and supportive',
                patterns: ['I hear that...', 'That sounds...', 'It makes sense that...'],
                techniques: ['reflection', 'validation', 'empathy']
            },
            direct: {
                tone: 'clear and focused',
                patterns: ['Let\'s focus on...', 'Here\'s what we can do...', 'The key is...'],
                techniques: ['psychoeducation', 'skill_building', 'action_planning']
            }
        },
        voice: {
            enabled: true,
            options: {
                gender: ['female', 'male', 'neutral'],
                pace: ['slow', 'normal', 'fast'],
                emotion: ['calm', 'encouraging', 'empathetic']
            }
        },
        visual: {
            enabled: true,
            elements: ['emotion_indicators', 'progress_bars', 'breathing_guides', 'technique_demonstrations'],
            animations: ['subtle_transitions', 'breathing_animation', 'progress_visualization']
        },
        interactive: {
            enabled: true,
            elements: ['breathing_exercises', 'grounding_tools', 'thought_records', 'mood_tracking'],
            feedback: ['immediate_response', 'progress_tracking', 'achievement_system']
        }
    },

    // Response patterns for different contexts
    responsePatterns: {
        greeting: [
            "Hello! I'm here to support you. How are you feeling today?",
            "Welcome! I'm glad you're here. What's on your mind?",
            "Hi! I'm ready to listen whenever you're ready to share."
        ],
        encouragement: [
            "You're taking important steps by sharing this. That takes courage.",
            "I'm here to support you through this. You don't have to face it alone.",
            "Your willingness to work on this shows real strength."
        ],
        reflection: [
            "It sounds like you're feeling {emotion} about {situation}.",
            "What I'm hearing is that {summary}. Is that accurate?",
            "That seems really {difficulty}. Tell me more about that."
        ]
    },

    // Assessment tools
    assessmentTools: {
        phq9: {
            name: 'PHQ-9 Depression Assessment',
            questions: [
                'Little interest or pleasure in doing things',
                'Feeling down, depressed, or hopeless',
                'Trouble falling or staying asleep',
                'Feeling tired or having little energy',
                'Poor appetite or overeating',
                'Feeling bad about yourself',
                'Trouble concentrating',
                'Moving or speaking slowly',
                'Thoughts that you would be better off dead'
            ]
        },
        gad7: {
            name: 'GAD-7 Anxiety Assessment',
            questions: [
                'Feeling nervous, anxious, or on edge',
                'Not being able to stop or control worrying',
                'Worrying too much about different things',
                'Trouble relaxing',
                'Being so restless that it is hard to sit still',
                'Becoming easily annoyed or irritable',
                'Feeling afraid as if something awful might happen'
            ]
        }
    },

    // Progressive muscle relaxation instructions
    progressiveMuscleRelaxation: {
        name: 'Progressive Muscle Relaxation',
        description: 'Systematically tense and relax different muscle groups',
        duration: '15 minutes',
        steps: [
            'Find a comfortable position and close your eyes',
            'Take a few deep breaths to relax',
            'Tense your feet and toes for 5 seconds, then relax',
            'Tense your lower legs for 5 seconds, then relax',
            'Tense your thighs for 5 seconds, then relax',
            'Tense your stomach and chest for 5 seconds, then relax',
            'Tense your hands and arms for 5 seconds, then relax',
            'Tense your shoulders and neck for 5 seconds, then relax',
            'Tense your face for 5 seconds, then relax',
            'Enjoy the feeling of full-body relaxation'
        ]
    },

    // Breathing exercises
    breathingExercises: {
        '4-7-8': {
            name: '4-7-8 Breathing',
            description: 'Calming breathing technique to reduce anxiety',
            instructions: [
                'Breathe in quietly through your nose for 4 seconds',
                'Hold your breath for 7 seconds',
                'Exhale completely through your mouth for 8 seconds',
                'Repeat 3-4 times'
            ]
        },
        box_breathing: {
            name: 'Box Breathing',
            description: 'Simple technique used by Navy SEALs',
            instructions: [
                'Breathe in for 4 seconds',
                'Hold for 4 seconds',
                'Breathe out for 4 seconds',
                'Hold for 4 seconds',
                'Repeat as needed'
            ]
        }
    },

    // Grounding techniques
    groundingTechniques: {
        '5-4-3-2-1': {
            name: '5-4-3-2-1 Grounding',
            description: 'Use your senses to ground yourself in the present moment',
            instructions: [
                'Name 5 things you can see',
                'Name 4 things you can feel',
                'Name 3 things you can hear',
                'Name 2 things you can smell',
                'Name 1 thing you can taste'
            ]
        }
    },

    // Safety planning
    safetyPlanning: {
        name: 'Safety Plan',
        description: 'Create a plan for staying safe during difficult times',
        components: [
            'Warning signs that a crisis may be developing',
            'Internal coping strategies to manage distress',
            'People and places that can provide distraction',
            'People you can ask for help',
            'Professionals you can call',
            'Making your environment safe'
        ]
    }
};
