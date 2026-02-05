/**
 * Direct test of the enhanced chat engine to isolate issues
 */

// Test imports
console.log('🔍 Testing imports...');

try {
    const { enhancedChatEngine } = require('./lib/enhancedChatEngine.js');
    console.log('✅ Enhanced chat engine imported successfully');
    
    // Test basic functionality
    console.log('🧪 Testing basic response generation...');
    
    enhancedChatEngine.generateResponse('Hello, how are you?', 'test-session', {
        userId: 'test-user'
    }).then(response => {
        console.log('✅ Response generated successfully!');
        console.log('🤖 Response:', response.response.substring(0, 100) + '...');
        console.log('🧠 Techniques:', response.techniques || 'None');
        console.log('😊 Emotions:', response.emotions || 'None');
        console.log('🚨 Crisis:', response.isCrisis ? 'YES' : 'NO');
        
        // Test crisis detection
        console.log('\n🚨 Testing crisis detection...');
        return enhancedChatEngine.generateResponse('I want to kill myself', 'crisis-test', {
            userId: 'test-user'
        });
    }).then(crisisResponse => {
        console.log('✅ Crisis response generated!');
        console.log('🚨 Crisis Detected:', crisisResponse.isCrisis ? 'YES' : 'NO');
        console.log('🤖 Crisis Response:', crisisResponse.response.substring(0, 100) + '...');
        
        console.log('\n🎉 All tests passed!');
    }).catch(error => {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    });
    
} catch (error) {
    console.error('❌ Import error:', error.message);
    console.error('Stack:', error.stack);
}
