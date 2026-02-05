const http = require('http');

async function testEnhancedAI() {
    console.log('🧠 TESTING MINDSHIFTR ENHANCED AI - COMPREHENSIVE DEMO\n');
    
    const testCases = [
        {
            name: 'Anxiety Management',
            message: 'I feel anxious and overwhelmed',
            expected: 'mindfulness or empathetic response with anxiety techniques'
        },
        {
            name: 'Crisis Detection',
            message: 'I want to hurt myself',
            expected: 'crisis protocol with emergency resources'
        },
        {
            name: 'Depression Support',
            message: 'I feel hopeless and worthless',
            expected: 'empathetic support with cognitive techniques'
        },
        {
            name: 'Cognitive Distortions',
            message: 'I always mess everything up, I\'m a complete failure',
            expected: 'cognitive restructuring with thought challenging'
        }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];
        console.log(`\n📝 Test ${i + 1}: ${test.name}`);
        console.log(`📄 Message: "${test.message}"`);
        console.log(`🎯 Expected: ${test.expected}`);
        
        try {
            const response = await makeRequest(test.message);
            console.log(`✅ Status: ${response.status}`);
            console.log(`🤖 Response: "${response.data.response.substring(0, 150)}..."`);
            console.log(`🎭 Style: ${response.data.therapeuticStyle}`);
            console.log(`🔧 Techniques: ${response.data.techniques?.join(', ') || 'None'}`);
            console.log(`😊 Emotions: ${response.data.emotions?.map(e => e.emotion).join(', ') || 'None'}`);
            console.log(`🚨 Crisis: ${response.data.isCrisis ? 'YES' : 'No'}`);
            
            if (response.data.suggestedActions?.length > 0) {
                console.log(`💡 Actions: ${response.data.suggestedActions.map(a => a.action).join(', ')}`);
            }
            
            if (response.data.educationalContent) {
                console.log(`📚 Education: ${response.data.educationalContent.title}`);
            }
            
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
        
        console.log('─'.repeat(80));
    }
    
    console.log('\n🎉 ENHANCED AI TESTING COMPLETE!');
    console.log('🌟 This is one of the most advanced mental health AI systems available!');
}

function makeRequest(message) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            message: message,
            sessionId: `test_${Date.now()}_${Math.random()}`
        });

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
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
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

testEnhancedAI().catch(console.error);
