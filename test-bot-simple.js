const http = require('http');

async function testBotSimple() {
    console.log('🤖 Simple Bot Test');
    console.log('==================');
    
    try {
        // Test 1: Basic API call
        console.log('\n1️⃣ Testing Basic API...');
        const response1 = await makeRequest('Hello, how are you?', 'advice');
        console.log('✅ Basic API working');
        console.log(`   Response: "${response1.response.substring(0, 50)}..."`);
        console.log(`   Style: ${response1.therapeuticStyle}`);
        
        // Test 2: CBT Mode
        console.log('\n2️⃣ Testing CBT Mode...');
        const response2 = await makeRequest('Help me challenge negative thoughts', 'cbt');
        console.log('✅ CBT Mode working');
        console.log(`   Response: "${response2.response.substring(0, 50)}..."`);
        
        // Test 3: Vent Mode
        console.log('\n3️⃣ Testing Vent Mode...');
        const response3 = await makeRequest('I just need to talk', 'vent');
        console.log('✅ Vent Mode working');
        console.log(`   Response: "${response3.response.substring(0, 50)}..."`);
        
        console.log('\n🎉 All bot tests passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

async function makeRequest(message, mode = 'advice') {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ 
            message, 
            mode,
            weights: { empathetic: 1.0, direct: 1.0, socratic: 1.0, mindfulness: 1.0 },
            userId: 'test-user'
        });
        
        const req = http.request({
            hostname: 'localhost',
            port: 3000,
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
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.write(data);
        req.end();
    });
}

testBotSimple();
