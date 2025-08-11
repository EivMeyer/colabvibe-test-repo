/**
 * Utility functions for the ColabVibe test application
 */

function getCurrentTime() {
    return new Date().toLocaleString();
}

function getRandomNumber() {
    return Math.floor(Math.random() * 1000);
}

function formatMessage(message) {
    return `[${getCurrentTime()}] ${message}`;
}

function calculateSum(a, b) {
    return a + b;
}

function isEven(number) {
    return number % 2 === 0;
}

module.exports = {
    getCurrentTime,
    getRandomNumber,
    formatMessage,
    calculateSum,
    isEven
};