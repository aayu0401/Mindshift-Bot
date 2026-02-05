const http = require('http');

async function testScenario(message, name) {
    const data = JSON.stringify({ message, sessionId: 'test-session' });
    
    const response = await new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
            path: '/api/chat',
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.write(data);
        req.end();
    });
    
    console.log(`✅ ${name}: ${response.response.substring(0, 60)}...`);
    console.log(`   🧠 Techniques: ${response.techniques.length > 0 ? response.techniques.join(', ') : 'None'}`);
    console.log(`   😊 Emotions: ${response.emotions.map(e => e.emotion).join(', ')}`);
    console.log(`   🚨 Crisis: ${response.isCrisis ? 'YES' : 'NO'}`);
    console.log('');
}

async function runTests() {
    console.log('🧪 Final API Tests');
    console.log('==================');
    
    await testScenario('I feel really anxious about my exam', 'Anxiety Test');
    await testScenario('I want to kill myself', 'Crisis Test');
    await testScenario('Can you teach me mindfulness?', 'Mindfulness Test');
    await testScenario('I feel sad and lonely', 'Sadness Test');
    
    console.log('🎉 All tests completed successfully!');
}

runTests().catch(console.error);
