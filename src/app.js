const express = require('express');
const path = require('path');
const utils = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>ColabVibe Test App</title>
                <link rel="stylesheet" href="/styles.css">
            </head>
            <body>
                <h1>🚀 ColabVibe Test Application</h1>
                <p>This is a sample application for testing ColabVibe!</p>
                <p>Current time: ${utils.getCurrentTime()}</p>
                <p>Random number: ${utils.getRandomNumber()}</p>
                <button onclick="location.reload()">Refresh</button>
            </body>
        </html>
    `);
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ColabVibe Test Server running on http://localhost:${PORT}`);
    console.log(`📊 API Status: http://localhost:${PORT}/api/status`);
});