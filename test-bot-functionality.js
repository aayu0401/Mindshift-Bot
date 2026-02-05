const http = require('http');

async function testBotFunctionality() {
    console.log('🤖 Testing AI Companion Bot Functionality');
    console.log('==========================================');
    
    const testCases = [
        {
            name: '🧠 Advice Mode',
            message: 'I\'m feeling anxious about my exam tomorrow',
            mode: 'advice',
            expectedFeatures: ['response', 'therapeuticStyle', 'techniques']
        },
        {
            name: '💭 CBT Mode',
            message: 'Help me challenge the thought that I\'m going to fail',
            mode: 'cbt',
            expectedFeatures: ['response', 'techniques']
        },
        {
            name: '🧘 Mindfulness Mode',
            message: 'Guide me through breathing exercises',
            mode: 'mindfulness',
            expectedFeatures: ['response']
        },
        {
            name: '👂 Vent Mode',
            message: 'I just need to talk about my stressful day',
            mode: 'vent',
            expectedFeatures: ['response']
        },
        {
            name: '🚨 Crisis Detection',
            message: 'I\'m having really dark thoughts',
            mode: 'advice',
            expectedFeatures: ['response', 'crisisHandling']
        }
    ];

    for (const testCase of testCases) {
        console.log(`\n${testCase.name}`);
        console.log('-'.repeat(40));
        
        try {
            const response = await makeBotRequest(testCase.message, testCase.mode);
            
            console.log(`✅ Response: "${response.response.substring(0, 80)}..."`);
            
            // Check expected features
            let allFeaturesPresent = true;
            for (const feature of testCase.expectedFeatures) {
                switch (feature) {
                    case 'response':
                        if (response.response) {
                            console.log(`   ✅ Response: Present (${response.response.length} chars)`);
                        } else {
                            console.log(`   ❌ Response: Missing`);
                            allFeaturesPresent = false;
                        }
                        break;
                    case 'therapeuticStyle':
                        if (response.therapeuticStyle) {
                            console.log(`   ✅ Therapeutic Style: ${response.therapeuticStyle}`);
                        } else {
                            console.log(`   ❌ Therapeutic Style: Missing`);
                            allFeaturesPresent = false;
                        }
                        break;
                    case 'techniques':
                        if (response.techniques && response.techniques.length > 0) {
                            console.log(`   ✅ Techniques: ${response.techniques.join(', ')}`);
                        } else {
                            console.log(`   ❌ Techniques: Missing or empty`);
                            allFeaturesPresent = false;
                        }
                        break;
                    case 'crisisHandling':
                        if (response.isCrisis || response.response.toLowerCase().includes('crisis')) {
                            console.log(`   ✅ Crisis Handling: Active`);
                        } else {
                            console.log(`   ⚠️ Crisis Handling: Not triggered`);
                        }
                        break;
                }
            }
            
            // Additional validation
            if (response.confidence) {
                console.log(`   📊 Confidence: ${Math.round(response.confidence * 100)}%`);
            }
            
            if (response.processingTime) {
                console.log(`   ⚡ Processing Time: ${response.processingTime}ms`);
            }
            
            if (response.sessionInfo) {
                console.log(`   💬 Session Info: Turn ${response.sessionInfo.turnCount}`);
            }
            
            if (allFeaturesPresent) {
                console.log(`   🎉 All expected features present!`);
            } else {
                console.log(`   ⚠️ Some features missing`);
            }
            
        } catch (error) {
            console.error(`❌ Error in ${testCase.name}:`, error.message);
        }
    }
    
    console.log('\n🎊 Bot Functionality Testing Complete!');
    console.log('==========================================');
}

async function makeBotRequest(message, mode = 'advice') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ 
            message, 
            mode,
            weights: { empathetic: 1.0, direct: 1.0, socratic: 1.0, mindfulness: 1.0 },
            userId: 'bot-test-user',
            vitals: null
        });
        
        const req = http.request({
            hostname: 'localhost',
            port: 3001,
            path: '/api/chat',
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
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

testBotFunctionality().catch(console.error);
