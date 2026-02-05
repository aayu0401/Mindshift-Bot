const http = require('http');

async function testEnhancedFeatures() {
    console.log('🧪 Testing Enhanced Chat Features');
    console.log('====================================');
    
    const testCases = [
        {
            name: '🧠 Therapeutic Style Detection',
            message: 'I feel really anxious about my presentation tomorrow',
            expectedFeatures: ['therapeuticStyle', 'techniques', 'emotions']
        },
        {
            name: '🚨 Crisis Intervention',
            message: 'I want to kill myself',
            expectedFeatures: ['isCrisis', 'therapeuticStyle', 'techniques']
        },
        {
            name: '😊 Emotion Analysis',
            message: 'I\'m so happy and excited about my new job!',
            expectedFeatures: ['emotions', 'sentiment']
        },
        {
            name: '🎯 Technique Recommendation',
            message: 'Can you help me with breathing exercises for stress?',
            expectedFeatures: ['techniques', 'therapeuticStyle']
        },
        {
            name: '📊 Processing Metrics',
            message: 'Tell me about cognitive behavioral therapy',
            expectedFeatures: ['processingTime', 'confidence']
        }
    ];

    for (const testCase of testCases) {
        console.log(`\n${testCase.name}`);
        console.log('-'.repeat(40));
        
        try {
            const response = await makeRequest(testCase.message);
            const features = checkFeatures(response, testCase.expectedFeatures);
            
            console.log(`✅ Response: "${response.response.substring(0, 80)}..."`);
            
            // Check expected features
            let allFeaturesPresent = true;
            for (const feature of testCase.expectedFeatures) {
                if (features[feature]) {
                    console.log(`   ✅ ${feature}: ${features[feature]}`);
                } else {
                    console.log(`   ❌ ${feature}: Missing`);
                    allFeaturesPresent = false;
                }
            }
            
            // Additional validation
            if (response.isCrisis) {
                console.log(`   🚨 CRISIS DETECTED: Intervention active`);
            }
            
            if (response.confidence) {
                console.log(`   📈 Confidence: ${Math.round(response.confidence * 100)}%`);
            }
            
            if (response.processingTime) {
                console.log(`   ⚡ Processing Time: ${response.processingTime}ms`);
            }
            
            if (allFeaturesPresent) {
                console.log(`   🎉 All expected features present!`);
            } else {
                console.log(`   ⚠️  Some features missing`);
            }
            
        } catch (error) {
            console.error(`❌ Error in ${testCase.name}:`, error.message);
        }
    }
    
    console.log('\n🎊 Enhanced Features Testing Complete!');
    console.log('====================================');
}

async function makeRequest(message) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ 
            message, 
            sessionId: 'enhanced-test',
            context: {
                userId: 'test-user',
                userProfile: {
                    preferences: {
                        communicationStyle: 'adaptive'
                    }
                }
            }
        });
        
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/chat',
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer demo-token',
                'Content-Length': Buffer.byteLength(data) 
            }
        }, (res) => {
            let responseData = '';
            res.on('data', chunk => responseData += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve(parsed);
                } catch (e) {
                    reject(new Error(`Parse error: ${e.message}`));
                }
            });
        });
        
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

function checkFeatures(response, expectedFeatures) {
    const features = {};
    
    for (const feature of expectedFeatures) {
        switch (feature) {
            case 'therapeuticStyle':
                features[feature] = response.therapeuticStyle || null;
                break;
            case 'techniques':
                features[feature] = response.techniques?.length > 0 ? response.techniques.join(', ') : null;
                break;
            case 'emotions':
                features[feature] = response.emotions?.length > 0 ? response.emotions.map(e => e.emotion).join(', ') : null;
                break;
            case 'sentiment':
                features[feature] = response.sentiment ? `${response.sentiment.classification} (${response.sentiment.score})` : null;
                break;
            case 'isCrisis':
                features[feature] = response.isCrisis ? 'YES' : 'NO';
                break;
            case 'processingTime':
                features[feature] = response.processingTime ? `${response.processingTime}ms` : null;
                break;
            case 'confidence':
                features[feature] = response.confidence ? `${Math.round(response.confidence * 100)}%` : null;
                break;
        }
    }
    
    return features;
}

testEnhancedFeatures().catch(console.error);
