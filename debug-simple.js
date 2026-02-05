// Simple debug test to isolate the error
const { EnhancedChatEngine } = require('./lib/enhancedChatEngine.js');

async function debugTest() {
    try {
        console.log('Creating Enhanced Chat Engine...');
        const engine = new EnhancedChatEngine();
        
        console.log('Testing simple response generation...');
        const response = await engine.generateResponse('test_user', 'Hello', 'test_session');
        
        console.log('Success! Response:', response);
    } catch (error) {
        console.error('Error caught:', error.message);
        console.error('Stack trace:', error.stack);
    }
}

debugTest();
