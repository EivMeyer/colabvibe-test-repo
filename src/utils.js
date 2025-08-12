// Utility functions for ColabVibe Test App

function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function getRandomNumber() {
    return Math.floor(Math.random() * 10000) + 1;
}

function getRandomEmoji() {
    const emojis = ['⚽', '⭐', '🌟', '💫', '✨', '🎯', '🎉', '🔥', '💡', '🌈'];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

function getRandomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

module.exports = {
    getCurrentTime,
    getRandomNumber,
    getRandomEmoji,
    getRandomColor
};
