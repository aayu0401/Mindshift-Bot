const http = require('http');

/**
 * Simple API test to debug the enhanced chat engine
 */

async function testAPI() {
    console.log('🧪 Testing Enhanced Chat API');
    
    const testCases = [
        {
            name: 'Simple Greeting',
            message: 'Hello, how are you?'
        },
        {
            name: 'Anxiety Test',
            message: 'I feel anxious about my exam'
        },
        {
            name: 'Sadness Test',
            message: 'I\'ve been feeling really sad lately'
        },
        {
            name: 'Crisis Test',
            message: 'I need help, I\'m thinking about ending my life'
        }
    ];

    for (const test of testCases) {
        console.log(`\n📝 Testing: ${test.name}`);
        console.log(`Message: "${test.message}"`);
        
        try {
            const result = await makeRequest(test.message);
            console.log(`✅ Status: ${result.status}`);
            console.log(`🤖 Response: "${result.response.substring(0, 100)}..."`);
            console.log(`🧠 Techniques: ${result.techniques ? result.techniques.join(', ') : 'None'}`);
            console.log(`😊 Emotions: ${result.emotions ? result.emotions.map(e => e.emotion).join(', ') : 'None'}`);
            console.log(`🚨 Crisis: ${result.isCrisis ? 'YES' : 'NO'}`);
            console.log(`⏱️  Processing Time: ${result.processingTime || 'N/A'}ms`);
            
            if (result.isCrisis) {
                console.log('🚨 CRISIS DETECTION WORKING! 🚨');
            }
            
        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
    }
}

function makeRequest(message) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            message,
            sessionId: `test-${Date.now()}`,
            context: {
                userId: 'test-user',
                userProfile: {
                    preferences: {
                        communicationStyle: 'empathetic',
                        culturalContext: 'western',
                        language: 'en'
                    }
                }
            }
        });

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/chat',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => responseData += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve({
                        status: res.statusCode,
                        ...parsed
                    });
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

testAPI().catch(console.error);
