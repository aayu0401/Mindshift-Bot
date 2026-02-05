const http = require('http');

/**
 * Minimal API test to isolate the exact error
 */

async function testMinimalAPI() {
    console.log('🧪 Testing Minimal API');
    
    try {
        const result = await makeRequest('Hello');
        console.log('✅ Status:', result.status);
        console.log('📄 Full response:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

function makeRequest(message) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({
            message: message,
            sessionId: 'minimal-test'
        });

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/chat',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
                    resolve({
                        status: res.statusCode,
                        rawResponse: responseData,
                        parseError: e.message
                    });
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

testMinimalAPI();
