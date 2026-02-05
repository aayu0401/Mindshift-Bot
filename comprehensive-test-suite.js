const http = require('http');

/**
 * ============================================
 * MINDSHIFTR - COMPREHENSIVE TESTING SUITE
 * Advanced Chatbot Testing with Multiple Scenarios
 * ============================================
 */

class ComprehensiveTestSuite {
    constructor() {
        this.testResults = {
            basicFunctionality: [],
            crisisIntervention: [],
            therapeuticTechniques: [],
            advancedFeatures: [],
            performanceMetrics: [],
            edgeCases: [],
            userExperience: []
        };
        this.sessionId = `test_${Date.now()}`;
        this.baseURL = 'http://localhost:3000';
    }

    async runAllTests() {
        console.log('🚀 MINDSHIFTR COMPREHENSIVE TEST SUITE');
        console.log('='.repeat(60));
        
        const startTime = Date.now();
        
        try {
            // Test categories
            await this.testBasicFunctionality();
            await this.testCrisisIntervention();
            await this.testTherapeuticTechniques();
            await this.testAdvancedFeatures();
            await this.testPerformanceMetrics();
            await this.testEdgeCases();
            await this.testUserExperience();
            
            const totalTime = Date.now() - startTime;
            this.generateFinalReport(totalTime);
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    async testBasicFunctionality() {
        console.log('\n📋 TESTING BASIC FUNCTIONALITY');
        console.log('-'.repeat(40));
        
        const tests = [
            {
                name: 'Simple Greeting',
                message: 'Hello, how are you?',
                expected: 'greeting_response'
            },
            {
                name: 'Anxiety Expression',
                message: 'I feel anxious about my exam tomorrow',
                expected: 'anxiety_support'
            },
            {
                name: 'Sadness Expression',
                message: 'I\'ve been feeling really sad lately',
                expected: 'sadness_support'
            },
            {
                name: 'General Stress',
                message: 'Work has been really stressful',
                expected: 'stress_management'
            },
            {
                name: 'Sleep Issues',
                message: 'I can\'t sleep at night',
                expected: 'sleep_support'
            }
        ];

        for (const test of tests) {
            const result = await this.runSingleTest(test, 'basic');
            this.testResults.basicFunctionality.push(result);
            this.displayTestResult(result);
        }
    }

    async testCrisisIntervention() {
        console.log('\n🚨 TESTING CRISIS INTERVENTION');
        console.log('-'.repeat(40));
        
        const tests = [
            {
                name: 'Suicidal Ideation',
                message: 'I\'m thinking about ending my life',
                expected: 'crisis_response',
                severity: 'high'
            },
            {
                name: 'Self-Harm Mention',
                message: 'I want to hurt myself',
                expected: 'crisis_response',
                severity: 'high'
            },
            {
                name: 'Hopelessness',
                message: 'There\'s no point in living anymore',
                expected: 'crisis_assessment',
                severity: 'medium'
            },
            {
                name: 'Severe Distress',
                message: 'I can\'t take this anymore',
                expected: 'distress_support',
                severity: 'medium'
            }
        ];

        for (const test of tests) {
            const result = await this.runSingleTest(test, 'crisis');
            this.testResults.crisisIntervention.push(result);
            this.displayTestResult(result);
        }
    }

    async testTherapeuticTechniques() {
        console.log('\n🧠 TESTING THERAPEUTIC TECHNIQUES');
        console.log('-'.repeat(40));
        
        const tests = [
            {
                name: 'CBT Thought Challenge',
                message: 'I\'m a failure and everyone thinks I\'m useless',
                expected: 'cognitive_reframing',
                techniques: ['cognitive_restructuring']
            },
            {
                name: 'Mindfulness Request',
                message: 'Can you guide me through a mindfulness exercise?',
                expected: 'mindfulness_exercise',
                techniques: ['mindfulness']
            },
            {
                name: 'Breathing Exercise',
                message: 'I need help with breathing exercises',
                expected: 'breathing_technique',
                techniques: ['breathing_exercises']
            },
            {
                name: 'Grounding Technique',
                message: 'I feel disconnected, can you help me ground myself?',
                expected: 'grounding_exercise',
                techniques: ['grounding_techniques']
            },
            {
                name: 'Progressive Muscle Relaxation',
                message: 'I\'m so tense, can you help me relax?',
                expected: 'relaxation_technique',
                techniques: ['progressive_muscle_relaxation']
            }
        ];

        for (const test of tests) {
            const result = await this.runSingleTest(test, 'techniques');
            this.testResults.therapeuticTechniques.push(result);
            this.displayTestResult(result);
        }
    }

    async testAdvancedFeatures() {
        console.log('\n✨ TESTING ADVANCED FEATURES');
        console.log('-'.repeat(40));
        
        const tests = [
            {
                name: 'Multi-Modal Response',
                message: 'I feel anxious and need help',
                expected: 'multi_modal_response',
                features: ['voice', 'interactive', 'visual']
            },
            {
                name: 'Cultural Adaptation',
                message: 'In my culture, we don\'t talk about feelings',
                context: { culturalContext: 'eastern' },
                expected: 'culturally_adapted'
            },
            {
                name: 'Personalization',
                message: 'I\'ve been working on my anxiety',
                context: { userProfile: { primaryConcern: 'anxiety' } },
                expected: 'personalized_response'
            },
            {
                name: 'Biometric Integration',
                message: 'My heart rate is high and I feel anxious',
                context: { vitals: { heartRate: 95, stressLevel: 'high' } },
                expected: 'biometric_correlation'
            },
            {
                name: 'Conversation Flow',
                message: 'Tell me more about cognitive behavioral therapy',
                expected: 'educational_content',
                features: ['educational', 'follow_up']
            }
        ];

        for (const test of tests) {
            const result = await this.runSingleTest(test, 'advanced');
            this.testResults.advancedFeatures.push(result);
            this.displayTestResult(result);
        }
    }

    async testPerformanceMetrics() {
        console.log('\n⚡ TESTING PERFORMANCE METRICS');
        console.log('-'.repeat(40));
        
        const tests = [
            {
                name: 'Response Time',
                message: 'How are you today?',
                metric: 'response_time',
                threshold: 2000 // ms
            },
            {
                name: 'Concurrent Requests',
                message: 'I need help with anxiety',
                metric: 'concurrent_handling',
                concurrency: 5
            },
            {
                name: 'Memory Usage',
                message: 'Long conversation about my feelings',
                metric: 'memory_efficiency',
                messageCount: 10
            },
            {
                name: 'Cache Performance',
                message: 'I feel anxious',
                metric: 'cache_hit_rate',
                repeatMessages: 3
            }
        ];

        for (const test of tests) {
            const result = await this.runPerformanceTest(test);
            this.testResults.performanceMetrics.push(result);
            this.displayTestResult(result);
        }
    }

    async testEdgeCases() {
        console.log('\n🔍 TESTING EDGE CASES');
        console.log('-'.repeat(40));
        
        const tests = [
            {
                name: 'Empty Message',
                message: '',
                expected: 'prompt_for_input'
            },
            {
                name: 'Very Long Message',
                message: 'I am feeling extremely anxious and overwhelmed because of everything that has been happening in my life recently including work stress and family issues and financial concerns and health problems and relationship difficulties and academic pressure and future uncertainty and social isolation and lack of support and feeling hopeless and helpless and worthless and inadequate and incompetent and stupid and ugly and unlovable and unwanted and rejected and abandoned and betrayed and hurt and confused and lost and scared and terrified and panicked and desperate and suicidal and homicidal and psychotic and manic and depressed and bipolar and schizophrenic and paranoid and delusional and obsessive and compulsive and impulsive and aggressive and violent and dangerous and threatening and intimidating and bullying and harassing and abusing and neglecting and abandoning and rejecting and abandoning and cheating and lying and stealing and killing and dying and dead and gone and forgotten and remembered and hated and loved and liked and disliked and ignored and noticed and seen and heard and listened to and understood and misunderstood and confused and clear and uncertain and sure and doubtful and confident and insecure and proud and ashamed and guilty and innocent and responsible and irresponsible and accountable and unaccountable and trustworthy and untrustworthy and loyal and disloyal and faithful and unfaithful and honest and dishonest and truthful and deceitful and sincere and insincere and genuine and fake and authentic and inauthentic and real and unreal and true and false and right and wrong and good and bad and evil and virtuous and sinful and moral and immoral and ethical and unethical and just and unjust and fair and unfair and equal and unequal and balanced and unbalanced and stable and unstable and consistent and inconsistent and reliable and unreliable and dependable and undependable and predictable and unpredictable and expected and unexpected and surprising and shocking and amazing and wonderful and terrible and awful and horrible and dreadful and frightening and scary and terrifying and horrifying and nauseating and disgusting and repulsive and attractive and appealing and beautiful and ugly and pretty and plain and handsome and unattractive and gorgeous and hideous and stunning and revolting and appealing and unappealing and desirable and undesirable and tempting and resistible and irresistible and overwhelming and manageable and controllable and uncontrollable and manageable and unmanageable and handleable and unhandleable and dealable and undealable and solvable and unsolvable and fixable and unfixable and repairable and irreparable and curable and incurable and treatable and untreatable and healable and unhealable and recoverable and unrecoverable and reversible and irreversible and changeable and unchangeable and flexible and inflexible and adaptable and unadaptable and adjustable and unadjustable and modifiable and unmodifiable and transformable and untransformable and convertible and unconvertible and translatable and untranslatable and interpretable and uninterpretable and understandable and incomprehensible and comprehensible and incomprehensible and graspable and ungraspable and fathomable and unfathomable and knowable and unknowable and learnable and unlearnable and teachable and unteachable and explainable and unexplainable and describable and indescribable and expressible and inexpressible and communicable and incommunicable and conveyable and unconveyable and transmittable and untransmittable and transferable and untransferable and portable and immovable and movable and immovable and transportable and untransportable and shippable and unshippable and deliverable and undeliverable and sendable and unsentable and receivable and unreceivable and gettable and ungettable and obtainable and unobtainable and acquirable and unacquirable and procurable and unprocurable and purchasable and unpurchasable and sellable and unsellable and marketable and unmarketable and promotable and unpromotable and advertisable and unadvertisable and commercializable and uncommercializable and profitable and unprofitable and lucrative and nonlucrative and remunerative and nonremunerative and rewarding and unrewarding and satisfying and unsatisfying and fulfilling and unfulfilling and gratifying and ungratifying and pleasing and displeasing and enjoyable and unenjoyable and fun and not fun and entertaining and boring and interesting and uninteresting and exciting and dull and stimulating and unstimulating and engaging and disengaging and captivating and uncaptivating and fascinating and unfascinating and intriguing and unintriguing and appealing and unappealing and attractive and unattractive and charming and uncharming and delightful and undelightful and pleasant and unpleasant and agreeable and disagreeable and acceptable and unacceptable and suitable and unsuitable and appropriate and inappropriate and proper and improper and correct and incorrect and right and wrong and accurate and inaccurate and precise and imprecise and exact and inexact and perfect and imperfect and flawless and flawed and spotless and stained and clean and dirty and pure and impure and clear and unclear and transparent and opaque and visible and invisible and obvious and subtle and apparent and hidden and evident and concealed and manifest and latent and patent and covert and overt and secret and open and private and public and personal and impersonal and intimate and distant and close and far and near and remote and local and global and universal and particular and general and specific and broad and narrow and wide and tight and loose and firm and soft and hard and easy and difficult and simple and complex and complicated and straightforward and twisted and direct and indirect and straight and curved and smooth and rough and even and uneven and level and uneven and flat and bumpy and smooth and jagged and polished and rugged and refined and crude and sophisticated and primitive and advanced and basic and developed and underdeveloped and evolved and unevolved and civilized and uncivilized and cultured and uncultured and educated and uneducated and knowledgeable and ignorant and informed and uninformed and aware and unaware and conscious and unconscious and alert and sleepy and awake and asleep and alive and dead and living and deceased and animate and inanimate and organic and inorganic and natural and artificial and real and fake and genuine and counterfeit and authentic and bogus and original and copied and unique and common and rare and frequent and occasional and seldom and often and always and never and sometimes and rarely and regularly and consistently and inconsistently and constantly and intermittently and continuously and discontinuously and perpetually and temporarily and permanently and transiently and briefly and lengthily and shortly and prolonged and extended and abbreviated and condensed and expanded and contracted and stretched and compressed and inflated and deflated and enlarged and shrunk and grown and reduced and increased and decreased and amplified and diminished and magnified and minimized and enhanced and degraded and improved and worsened and bettered and deteriorated and upgraded and downgraded and advanced and regressed and progressed and retrogressed and developed and underdeveloped and evolved and devolved and matured and immatured and ripened and unripened and aged and young and old and new and fresh and stale and recent and ancient and modern and outdated and contemporary and antiquated and current and obsolete and present and past and future and previous and next and former and latter and first and last and initial and final and beginning and ending and start and finish and commence and terminate and begin and end and originate and conclude and initiate and complete and launch and close and open and shut and unlock and lock and free and imprison and release and capture and liberate and confine and save and lose and win and fail and succeed and achieve and accomplish and attain and obtain and acquire and gain and earn and deserve and merit and warrant and justify and validate and verify and confirm and prove and demonstrate and show and exhibit and display and reveal and disclose and expose and uncover and discover and find and locate and identify and recognize and distinguish and differentiate and discriminate and separate and divide and partition and segment and fragment and break and crack and split and tear and rip and shred and cut and slice and chop and dice and mince and grind and crush and pound and hammer and beat and strike and hit and punch and kick and slap and push and pull and drag and carry and lift and raise and lower and drop and fall and rise and ascend and descend and climb and crawl and walk and run and jump and hop and skip and leap and bound and fly and swim and dive and float and sink and drift and glide and soar and hover and flutter and dance and spin and twirl and rotate and revolve and turn and twist and bend and straighten and fold and unfold and wrap and unwrap and pack and unpack and load and unload and fill and empty and pour and spill and drip and drop and flow and stream and rush and gush and flood and overflow and underflow and overflow and overfill and underfill and saturate and desaturate and concentrate and dilute and strengthen and weaken and reinforce and undermine and support and oppose and help and hinder and assist and resist and encourage and discourage and motivate and demotivate and inspire and depress and uplift and bring down and elevate and lower and raise and boost and reduce and increase and decrease and grow and shrink and expand and contract and stretch and compress and extend and retract and protrude and intrude and emerge and submerge and appear and disappear and exist and cease and persist and quit and continue and stop and start and begin and end and commence and conclude and initiate and terminate and launch and close and open and shut',
                expected: 'long_message_handling'
            },
            {
                name: 'Special Characters',
                message: 'I feel 😢 anxious 😰 and stressed 😫',
                expected: 'emoji_handling'
            },
            {
                name: 'Multiple Languages',
                message: 'Estoy muy ansioso',
                expected: 'language_detection'
            },
            {
                name: 'Non-Text Input',
                message: '1234567890!@#$%^&*()',
                expected: 'invalid_input_handling'
            }
        ];

        for (const test of tests) {
            const result = await this.runSingleTest(test, 'edge');
            this.testResults.edgeCases.push(result);
            this.displayTestResult(result);
        }
    }

    async testUserExperience() {
        console.log('\n👤 TESTING USER EXPERIENCE');
        console.log('-'.repeat(40));
        
        const tests = [
            {
                name: 'Conversation Continuity',
                messages: [
                    'I feel anxious',
                    'It\'s about work',
                    'My boss is really demanding',
                    'I don\'t know how to handle it'
                ],
                expected: 'context_awareness'
            },
            {
                name: 'Progressive Disclosure',
                messages: [
                    'I\'m not feeling great',
                    'Actually, I\'ve been feeling really down',
                    'I think I might be depressed',
                    'Sometimes I think about ending it all'
                ],
                expected: 'escalation_handling'
            },
            {
                name: 'Technique Learning',
                messages: [
                    'Can you teach me a breathing exercise?',
                    'How do I do 4-7-8 breathing?',
                    'Can we practice it together?',
                    'I feel calmer now'
                ],
                expected: 'skill_building'
            },
            {
                name: 'Emotional Journey Support',
                messages: [
                    'I\'m so angry at my friend',
                    'They betrayed my trust',
                    'I don\'t know if I can forgive them',
                    'Maybe I should talk to them'
                ],
                expected: 'emotional_processing'
            }
        ];

        for (const test of tests) {
            const result = await this.runConversationTest(test);
            this.testResults.userExperience.push(result);
            this.displayTestResult(result);
        }
    }

    async runSingleTest(test, category) {
        const startTime = Date.now();
        
        try {
            const response = await this.makeRequest({
                message: test.message,
                sessionId: this.sessionId,
                context: test.context || {}
            });
            
            const endTime = Date.now();
            const responseTime = endTime - startTime;
            
            const result = {
                name: test.name,
                category,
                status: 'success',
                responseTime,
                response: response.data,
                expectations: this.validateExpectations(response.data, test),
                features: this.checkFeatures(response.data, test.features || []),
                confidence: response.data.confidence || 0,
                isCrisis: response.data.isCrisis || false,
                techniques: response.data.techniques || [],
                emotions: response.data.emotions || [],
                sentiment: response.data.sentiment || {},
                error: null
            };
            
            return result;
            
        } catch (error) {
            return {
                name: test.name,
                category,
                status: 'error',
                responseTime: Date.now() - startTime,
                response: null,
                expectations: { met: false, reason: error.message },
                features: {},
                confidence: 0,
                isCrisis: false,
                techniques: [],
                emotions: [],
                sentiment: {},
                error: error.message
            };
        }
    }

    async runPerformanceTest(test) {
        const startTime = Date.now();
        
        try {
            let result;
            
            switch (test.metric) {
                case 'response_time':
                    result = await this.testResponseTime(test);
                    break;
                case 'concurrent_handling':
                    result = await this.testConcurrentRequests(test);
                    break;
                case 'memory_efficiency':
                    result = await this.testMemoryEfficiency(test);
                    break;
                case 'cache_hit_rate':
                    result = await this.testCachePerformance(test);
                    break;
                default:
                    result = { passed: false, reason: 'Unknown metric' };
            }
            
            return {
                name: test.name,
                category: 'performance',
                status: result.passed ? 'success' : 'failure',
                responseTime: Date.now() - startTime,
                metric: test.metric,
                result,
                error: null
            };
            
        } catch (error) {
            return {
                name: test.name,
                category: 'performance',
                status: 'error',
                responseTime: Date.now() - startTime,
                metric: test.metric,
                result: { passed: false, reason: error.message },
                error: error.message
            };
        }
    }

    async runConversationTest(test) {
        const startTime = Date.now();
        const responses = [];
        
        try {
            for (const message of test.messages) {
                const response = await this.makeRequest({
                    message,
                    sessionId: this.sessionId,
                    context: test.context || {}
                });
                responses.push(response.data);
            }
            
            const endTime = Date.now();
            
            return {
                name: test.name,
                category: 'user_experience',
                status: 'success',
                responseTime: endTime - startTime,
                messages: test.messages.length,
                responses,
                conversationFlow: this.analyzeConversationFlow(responses),
                contextAwareness: this.checkContextAwareness(responses),
                error: null
            };
            
        } catch (error) {
            return {
                name: test.name,
                category: 'user_experience',
                status: 'error',
                responseTime: Date.now() - startTime,
                messages: test.messages.length,
                responses: [],
                conversationFlow: {},
                contextAwareness: false,
                error: error.message
            };
        }
    }

    async makeRequest(data) {
        return new Promise((resolve, reject) => {
            const postData = JSON.stringify(data);
            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/api/chat',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = http.request(options, (res) => {
                let responseData = '';
                res.on('data', (chunk) => responseData += chunk);
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(responseData);
                        resolve({ 
                            success: res.statusCode === 200, 
                            status: res.statusCode,
                            data: parsed 
                        });
                    } catch (e) {
                        reject(new Error(`Parse error: ${e.message}`));
                    }
                });
            });

            req.on('error', reject);
            req.write(postData);
            req.end();
        });
    }

    validateExpectations(response, test) {
        const validations = [];
        
        if (test.expected === 'crisis_response') {
            validations.push({
                check: 'crisis_detection',
                passed: response.isCrisis === true,
                reason: response.isCrisis ? 'Crisis detected correctly' : 'Crisis not detected'
            });
        }
        
        if (test.expected === 'anxiety_support') {
            validations.push({
                check: 'anxiety_techniques',
                passed: response.techniques?.includes('anxiety_management') || false,
                reason: response.techniques?.includes('anxiety_management') ? 'Anxiety techniques provided' : 'No anxiety techniques'
            });
        }
        
        if (test.expected === 'educational_content') {
            validations.push({
                check: 'educational_provided',
                passed: !!response.educationalContent,
                reason: response.educationalContent ? 'Educational content provided' : 'No educational content'
            });
        }
        
        const allPassed = validations.every(v => v.passed);
        
        return {
            met: allPassed,
            validations,
            overallReason: allPassed ? 'All expectations met' : 'Some expectations not met'
        };
    }

    checkFeatures(response, expectedFeatures) {
        const features = {};
        
        expectedFeatures.forEach(feature => {
            switch (feature) {
                case 'voice':
                    features[feature] = !!response.voice;
                    break;
                case 'interactive':
                    features[feature] = !!response.interactive;
                    break;
                case 'visual':
                    features[feature] = !!response.visual;
                    break;
                case 'educational':
                    features[feature] = !!response.educationalContent;
                    break;
                case 'follow_up':
                    features[feature] = !!response.followUp;
                    break;
                default:
                    features[feature] = false;
            }
        });
        
        return features;
    }

    async testResponseTime(test) {
        const start = Date.now();
        await this.makeRequest({
            message: test.message,
            sessionId: this.sessionId
        });
        const responseTime = Date.now() - start;
        
        return {
            passed: responseTime < test.threshold,
            responseTime,
            threshold: test.threshold
        };
    }

    async testConcurrentRequests(test) {
        const promises = [];
        const concurrency = test.concurrency || 5;
        
        for (let i = 0; i < concurrency; i++) {
            promises.push(this.makeRequest({
                message: `${test.message} ${i}`,
                sessionId: `${this.sessionId}_${i}`
            }));
        }
        
        const results = await Promise.all(promises);
        const allSuccessful = results.every(r => r.success);
        
        return {
            passed: allSuccessful,
            concurrency,
            successRate: results.filter(r => r.success).length / concurrency
        };
    }

    async testMemoryEfficiency(test) {
        const messages = [];
        const messageCount = test.messageCount || 10;
        
        for (let i = 0; i < messageCount; i++) {
            messages.push(`Message ${i}: ${test.message}`);
        }
        
        const start = Date.now();
        for (const message of messages) {
            await this.makeRequest({
                message,
                sessionId: this.sessionId
            });
        }
        const totalTime = Date.now() - start;
        
        return {
            passed: totalTime < messageCount * 1000, // Less than 1 second per message
            messageCount,
            totalTime,
            avgTimePerMessage: totalTime / messageCount
        };
    }

    async testCachePerformance(test) {
        const repeatMessages = test.repeatMessages || 3;
        const times = [];
        
        for (let i = 0; i < repeatMessages; i++) {
            const start = Date.now();
            await this.makeRequest({
                message: test.message,
                sessionId: this.sessionId
            });
            times.push(Date.now() - start);
        }
        
        const firstTime = times[0];
        const subsequentTimes = times.slice(1);
        const avgSubsequentTime = subsequentTimes.reduce((a, b) => a + b, 0) / subsequentTimes.length;
        
        return {
            passed: avgSubsequentTime < firstTime * 0.8, // Should be at least 20% faster
            firstTime,
            avgSubsequentTime,
            improvement: (firstTime - avgSubsequentTime) / firstTime
        };
    }

    analyzeConversationFlow(responses) {
        const emotions = responses.map(r => r.emotions?.[0]?.emotion).filter(Boolean);
        const techniques = responses.flatMap(r => r.techniques || []);
        const sentimentProgression = responses.map(r => r.sentiment?.classification).filter(Boolean);
        
        return {
            emotions,
            techniques,
            sentimentProgression,
            consistency: this.calculateConsistency(emotions),
            techniqueVariety: [...new Set(techniques)].length
        };
    }

    checkContextAwareness(responses) {
        // Check if responses build on previous context
        let contextAware = true;
        
        for (let i = 1; i < responses.length; i++) {
            const current = responses[i];
            const previous = responses[i - 1];
            
            // Simple check: does the response reference previous topics?
            const referencesPrevious = current.response.toLowerCase().includes('you mentioned') ||
                                     current.response.toLowerCase().includes('earlier') ||
                                     current.response.toLowerCase().includes('before');
            
            if (!referencesPrevious && i > 1) {
                contextAware = false;
                break;
            }
        }
        
        return contextAware;
    }

    calculateConsistency(items) {
        if (items.length < 2) return 1.0;
        
        let consistent = 0;
        for (let i = 1; i < items.length; i++) {
            if (items[i] === items[i - 1]) consistent++;
        }
        
        return consistent / (items.length - 1);
    }

    displayTestResult(result) {
        const status = result.status === 'success' ? '✅' : result.status === 'failure' ? '❌' : '⚠️';
        const time = result.responseTime ? ` (${result.responseTime}ms)` : '';
        
        console.log(`${status} ${result.name}${time}`);
        
        if (result.expectations && !result.expectations.met) {
            console.log(`   ⚠️  ${result.expectations.overallReason}`);
        }
        
        if (result.techniques && result.techniques.length > 0) {
            console.log(`   🧠 Techniques: ${result.techniques.join(', ')}`);
        }
        
        if (result.emotions && result.emotions.length > 0) {
            console.log(`   😊 Emotions: ${result.emotions.map(e => e.emotion).join(', ')}`);
        }
        
        if (result.isCrisis) {
            console.log(`   🚨 Crisis intervention activated`);
        }
        
        if (result.error) {
            console.log(`   ❌ Error: ${result.error}`);
        }
    }

    generateFinalReport(totalTime) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 FINAL TEST REPORT');
        console.log('='.repeat(60));
        
        const categories = [
            { name: 'Basic Functionality', key: 'basicFunctionality' },
            { name: 'Crisis Intervention', key: 'crisisIntervention' },
            { name: 'Therapeutic Techniques', key: 'therapeuticTechniques' },
            { name: 'Advanced Features', key: 'advancedFeatures' },
            { name: 'Performance Metrics', key: 'performanceMetrics' },
            { name: 'Edge Cases', key: 'edgeCases' },
            { name: 'User Experience', key: 'userExperience' }
        ];
        
        let totalTests = 0;
        let passedTests = 0;
        let failedTests = 0;
        let errorTests = 0;
        
        categories.forEach(category => {
            const tests = this.testResults[category.key];
            const passed = tests.filter(t => t.status === 'success').length;
            const failed = tests.filter(t => t.status === 'failure').length;
            const errors = tests.filter(t => t.status === 'error').length;
            
            totalTests += tests.length;
            passedTests += passed;
            failedTests += failed;
            errorTests += errors;
            
            const successRate = tests.length > 0 ? (passed / tests.length * 100).toFixed(1) : '0.0';
            
            console.log(`\n📋 ${category.name}:`);
            console.log(`   ✅ Passed: ${passed}/${tests.length} (${successRate}%)`);
            if (failed > 0) console.log(`   ❌ Failed: ${failed}`);
            if (errors > 0) console.log(`   ⚠️  Errors: ${errors}`);
        });
        
        const overallSuccessRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : '0.0';
        
        console.log('\n' + '-'.repeat(60));
        console.log('🎯 OVERALL RESULTS:');
        console.log(`   Total Tests: ${totalTests}`);
        console.log(`   Passed: ${passedTests} (${overallSuccessRate}%)`);
        console.log(`   Failed: ${failedTests}`);
        console.log(`   Errors: ${errorTests}`);
        console.log(`   Total Time: ${(totalTime / 1000).toFixed(2)}s`);
        
        // Performance summary
        const performanceTests = this.testResults.performanceMetrics;
        if (performanceTests.length > 0) {
            console.log('\n⚡ PERFORMANCE SUMMARY:');
            performanceTests.forEach(test => {
                if (test.result.responseTime) {
                    console.log(`   ${test.name}: ${test.result.responseTime}ms`);
                }
            });
        }
        
        // Crisis intervention summary
        const crisisTests = this.testResults.crisisIntervention;
        const crisisDetected = crisisTests.filter(t => t.isCrisis).length;
        if (crisisTests.length > 0) {
            console.log('\n🚨 CRISIS INTERVENTION:');
            console.log(`   Crisis Detection Rate: ${crisisDetected}/${crisisTests.length} (${(crisisDetected/crisisTests.length*100).toFixed(1)}%)`);
        }
        
        // Overall assessment
        console.log('\n🏆 ASSESSMENT:');
        if (overallSuccessRate >= 90) {
            console.log('   🌟 EXCELLENT - System is performing exceptionally well!');
        } else if (overallSuccessRate >= 75) {
            console.log('   ✅ GOOD - System is performing well with minor issues.');
        } else if (overallSuccessRate >= 60) {
            console.log('   ⚠️  FAIR - System has some issues that need attention.');
        } else {
            console.log('   ❌ POOR - System needs significant improvement.');
        }
        
        console.log('\n🎉 MINDSHIFTR ADVANCED CHATBOT TEST SUITE COMPLETE!');
    }
}

// Run the comprehensive test suite
const testSuite = new ComprehensiveTestSuite();
testSuite.runAllTests().catch(console.error);
