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
                <title>🚀 ColabVibe Live Preview Demo</title>
                <link rel='stylesheet' href='/styles.css'>
                <style>
                    body { 
                        font-family: -apple-system, BlinkMacSystemFont, sans-serif; 
                        max-width: 800px; 
                        margin: 0 auto; 
                        padding: 20px; 
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        min-height: 100vh;
                    }
                    .container { 
                        background: rgba(255,255,255,0.1); 
                        padding: 40px; 
                        border-radius: 20px; 
                        backdrop-filter: blur(10px);
                        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                    }
                    h1 { color: #fff; text-align: center; font-size: 3em; margin-bottom: 0.5em; }
                    .stats { 
                        display: grid; 
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
                        gap: 20px; 
                        margin: 30px 0; 
                    }
                    .stat-card { 
                        background: rgba(255,255,255,0.2); 
                        padding: 20px; 
                        border-radius: 15px; 
                        text-align: center;
                        transition: transform 0.3s ease;
                    }
                    .stat-card:hover { transform: translateY(-5px); }
                    .stat-value { font-size: 2em; font-weight: bold; color: #ffd700; }
                    button { 
                        background: #ff6b6b; 
                        color: white; 
                        border: none; 
                        padding: 15px 30px; 
                        border-radius: 50px; 
                        font-size: 1.1em; 
                        cursor: pointer; 
                        transition: all 0.3s ease;
                        display: block;
                        margin: 20px auto;
                    }
                    button:hover { background: #ff5252; transform: scale(1.05); }
                    .api-demo { 
                        margin-top: 30px; 
                        padding: 20px; 
                        background: rgba(255,255,255,0.1); 
                        border-radius: 15px; 
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <h1>🚀 ColabVibe Live Preview</h1>
                    <p style='text-align: center; font-size: 1.2em; opacity: 0.9;'>
                        This is a live preview of your collaborative development environment\!
                    </p>
                    
                    <div class='stats'>
                        <div class='stat-card'>
                            <div class='stat-value'>${utils.getCurrentTime()}</div>
                            <div>Current Time</div>
                        </div>
                        <div class='stat-card'>
                            <div class='stat-value'>${utils.getRandomNumber()}</div>
                            <div>Lucky Number</div>
                        </div>
                        <div class='stat-card'>
                            <div class='stat-value'>${Math.floor(Math.random() * 1000)}</div>
                            <div>Visitors Today</div>
                        </div>
                    </div>
                    
                    <button onclick='location.reload()'>🔄 Refresh for New Data</button>
                    
                    <div class='api-demo'>
                        <h3>🔗 API Endpoints</h3>
                        <p><strong>Status:</strong> <a href='/api/status' style='color: #ffd700;'>/api/status</a></p>
                        <p><strong>Health:</strong> <a href='/api/health' style='color: #ffd700;'>/api/health</a></p>
                    </div>
                    
                    <div style='text-align: center; margin-top: 40px; opacity: 0.7;'>
                        <p>✨ Changes you make will appear here instantly\!</p>
                        <p>🔄 Last updated: ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            </body>
        </html>
    `);
});

app.get('/api/status', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'colabvibe-test-app',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.2.0'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        checks: {
            database: 'UP',
            cache: 'UP', 
            external_api: 'UP'
        },
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ColabVibe Test Server running on http://localhost:${PORT}`);
    console.log(`📊 API Status: http://localhost:${PORT}/api/status`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
});
