const utils = require('../src/utils');

console.log('🧪 Running ColabVibe Test Suite...\n');

// Test utils functions
function testUtils() {
    console.log('📦 Testing Utils Module');
    
    // Test getCurrentTime
    const time = utils.getCurrentTime();
    console.log(`  ✅ getCurrentTime(): ${time}`);
    
    // Test getRandomNumber
    const randomNum = utils.getRandomNumber();
    console.log(`  ✅ getRandomNumber(): ${randomNum}`);
    
    // Test calculateSum
    const sum = utils.calculateSum(5, 3);
    console.log(`  ✅ calculateSum(5, 3): ${sum} ${sum === 8 ? '✅' : '❌'}`);
    
    // Test isEven
    const evenTest = utils.isEven(4);
    const oddTest = utils.isEven(5);
    console.log(`  ✅ isEven(4): ${evenTest} ${evenTest ? '✅' : '❌'}`);
    console.log(`  ✅ isEven(5): ${oddTest} ${!oddTest ? '✅' : '❌'}`);
    
    // Test formatMessage
    const formatted = utils.formatMessage('Test message');
    console.log(`  ✅ formatMessage(): ${formatted}`);
    
    console.log('');
}

// Run tests
testUtils();

console.log('🎉 All tests completed!\n');
console.log('💡 Try running: npm start to start the server');
console.log('💡 Or: npm run dev for development with auto-reload');