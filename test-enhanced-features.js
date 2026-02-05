const http = require('http');

/**
 * ============================================
 * MINDSHIFTR - COMPREHENSIVE ENHANCED FEATURES TEST
 * Testing All New Advanced Capabilities
 * ============================================
 */

async function testAllEnhancedFeatures() {
    console.log('🚀 TESTING MINDSHIFTR ENHANCED FEATURES - COMPLETE SUITE\n');
    
    const testResults = {
        enhancedAI: false,
        realTimeFeatures: false,
        advancedTraining: false,
        dashboardAnalytics: false,
        overallStatus: 'pending'
    };

    // Test 1: Enhanced AI Chatbot
    console.log('🧠 Test 1: Enhanced AI Chatbot');
    try {
        const aiResponse = await testEnhancedAI();
        if (aiResponse.success) {
            testResults.enhancedAI = true;
            console.log('✅ Enhanced AI: PASS');
            console.log(`   Response: "${aiResponse.data.response.substring(0, 100)}..."`);
            console.log(`   Techniques: ${aiResponse.data.techniques?.join(', ') || 'None'}`);
            console.log(`   Crisis Detected: ${aiResponse.data.isCrisis ? 'YES' : 'No'}`);
            console.log(`   Educational Content: ${aiResponse.data.educationalContent ? 'YES' : 'No'}`);
        } else {
            console.log('❌ Enhanced AI: FAIL');
        }
    } catch (error) {
        console.log('❌ Enhanced AI: ERROR -', error.message);
    }

    console.log('\n' + '─'.repeat(80) + '\n');

    // Test 2: Real-Time Features
    console.log('📡 Test 2: Real-Time Communication Features');
    try {
        const realtimeResponse = await testRealTimeFeatures();
        if (realtimeResponse.success) {
            testResults.realTimeFeatures = true;
            console.log('✅ Real-Time Features: PASS');
            console.log(`   Available Features: ${realtimeResponse.data.features.length}`);
            console.log(`   WebSocket Support: ${realtimeResponse.data.status}`);
        } else {
            console.log('❌ Real-Time Features: FAIL');
        }
    } catch (error) {
        console.log('❌ Real-Time Features: ERROR -', error.message);
    }

    console.log('\n' + '─'.repeat(80) + '\n');

    // Test 3: Advanced AI Training
    console.log('🎓 Test 3: Advanced AI Training System');
    try {
        const trainingResponse = await testAdvancedTraining();
        if (trainingResponse.success) {
            testResults.advancedTraining = true;
            console.log('✅ Advanced Training: PASS');
            console.log(`   Capabilities: ${trainingResponse.data.capabilities.length}`);
            console.log(`   Model Version: ${trainingResponse.data.version}`);
            console.log(`   Total Users: ${trainingResponse.data.statistics.totalUsers}`);
        } else {
            console.log('❌ Advanced Training: FAIL');
        }
    } catch (error) {
        console.log('❌ Advanced Training: ERROR -', error.message);
    }

    console.log('\n' + '─'.repeat(80) + '\n');

    // Test 4: Dashboard Analytics
    console.log('📊 Test 4: Real-Time Dashboard Analytics');
    try {
        const dashboardResponse = await testDashboardAnalytics();
        if (dashboardResponse.success) {
            testResults.dashboardAnalytics = true;
            console.log('✅ Dashboard Analytics: PASS');
            console.log(`   Features: ${dashboardResponse.data.features.length}`);
            console.log(`   Status: ${dashboardResponse.data.status}`);
        } else {
            console.log('❌ Dashboard Analytics: FAIL');
        }
    } catch (error) {
        console.log('❌ Dashboard Analytics: ERROR -', error.message);
    }

    console.log('\n' + '─'.repeat(80) + '\n');

    // Calculate overall results
    const passedTests = Object.values(testResults).filter(result => result === true).length;
    const totalTests = 4; // Total number of feature sets tested
    
    testResults.overallStatus = passedTests === totalTests ? 'EXCELLENT' : 
                               passedTests >= 3 ? 'GOOD' : 
                               passedTests >= 2 ? 'FAIR' : 'POOR';

    // Final Results
    console.log('🎯 FINAL TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`Enhanced AI Chatbot: ${testResults.enhancedAI ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Real-Time Features: ${testResults.realTimeFeatures ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Advanced Training: ${testResults.advancedTraining ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Dashboard Analytics: ${testResults.dashboardAnalytics ? '✅ PASS' : '❌ FAIL'}`);
    console.log('─'.repeat(50));
    console.log(`Overall Status: ${testResults.overallStatus}`);
    console.log(`Tests Passed: ${passedTests}/${totalTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (testResults.overallStatus === 'EXCELLENT') {
        console.log('\n🎉 MINDSHIFTR IS NOW ONE OF THE BEST MENTAL HEALTH APPS!');
        console.log('✨ All enhanced features are working perfectly!');
        console.log('🚀 Ready for production deployment!');
    } else {
        console.log('\n⚠️ Some features need attention before production.');
    }

    return testResults;
}

async function testEnhancedAI() {
    return makeRequest('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
            message: 'I feel anxious about my future and I\'m having trouble sleeping',
            sessionId: `test_enhanced_${Date.now()}`,
            context: {
                testMode: true,
                vitals: {
                    stress: 'moderate',
                    sleep: 'poor'
                }
            }
        })
    });
}

async function testRealTimeFeatures() {
    return makeRequest('/api/realtime', {
        method: 'GET'
    });
}

async function testAdvancedTraining() {
    return makeRequest('/api/ai-training', {
        method: 'GET'
    });
}

async function testDashboardAnalytics() {
    return makeRequest('/api/dashboard', {
        method: 'GET'
    });
}

function makeRequest(path, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, 'http://localhost:3000');
        
        const requestOptions = {
            hostname: url.hostname,
            port: url.port || 3000,
            path: url.pathname + url.search,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        if (options.body) {
            requestOptions.headers['Content-Length'] = Buffer.byteLength(options.body);
        }

        const req = http.request(requestOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
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
        
        if (options.body) {
            req.write(options.body);
        }
        
        req.end();
    });
}

// Run the comprehensive test
testAllEnhancedFeatures().catch(console.error);
