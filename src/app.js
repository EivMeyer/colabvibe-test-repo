const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const utils = require('./utils');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

// Store active drawing data
let canvasData = [];
let activeUsers = new Set();
let emojiReactions = [];

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>🏢 ColabVibe Live Preview Demo</title>
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
                    <h1>🏢 ColabVibe Live Preview</h1>
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
                    
                    <!-- Crazy Interactive Drawing Canvas -->
                    <div class='drawing-section'>
                        <h2>🎨 Collaborative Drawing Canvas</h2>
                        <div class='canvas-controls'>
                            <button id='colorPicker' style='background: #ff6b6b; width: 50px; height: 40px; border-radius: 10px; margin-right: 10px;'>🎨</button>
                            <input type='range' id='brushSize' min='1' max='50' value='5' style='margin-right: 15px;'>
                            <button id='clearCanvas'>🗑️ Clear</button>
                            <button id='saveCanvas'>💾 Save</button>
                        </div>
                        <canvas id='drawingCanvas' width='700' height='400' style='border: 3px solid #ffd700; border-radius: 15px; background: white; cursor: crosshair; display: block; margin: 20px auto;'></canvas>
                        
                        <!-- Emoji Reaction Bar -->
                        <div class='emoji-bar'>
                            <span class='emoji-btn' data-emoji='❤️'>❤️</span>
                            <span class='emoji-btn' data-emoji='😍'>😍</span>
                            <span class='emoji-btn' data-emoji='🔥'>🔥</span>
                            <span class='emoji-btn' data-emoji='⭐'>⭐</span>
                            <span class='emoji-btn' data-emoji='🎉'>🎉</span>
                            <span class='emoji-btn' data-emoji='😂'>😂</span>
                            <span class='emoji-btn' data-emoji='🏢'>🏢</span>
                            <span class='emoji-btn' data-emoji='💯'>💯</span>
                        </div>
                        
                        <!-- Active Users Display -->
                        <div id='activeUsers' style='text-align: center; margin-top: 20px; font-size: 1.1em;'>
                            👥 Active Artists: <span id='userCount'>1</span>
                        </div>
                    </div>
                    
                    <!-- Jumping Ball Section -->
                    <div class='ball-section'>
                        <h2>🏀 Interactive Jumping Ball</h2>
                        <div class='ball-container'>
                            <div id='jumpingBall' class='jumping-ball'></div>
                        </div>
                        <div class='ball-controls'>
                            <button id='jumpBtn'>🏢 Make it Jump!</button>
                            <button id='changeColorBtn'>🎨 Change Color</button>
                            <button id='changeSizeBtn'>📏 Change Size</button>
                        </div>
                    </div>
                    
                    <div style='text-align: center; margin-top: 40px; opacity: 0.7;'>
                        <p>✨ Changes you make will appear here instantly\!</p>
                        <p>🔄 Last updated: ${new Date().toLocaleString()}</p>
                    </div>
                </div>
                
                <script src='/socket.io/socket.io.js'></script>
                <script>
                    const socket = io();
                    const canvas = document.getElementById('drawingCanvas');
                    const ctx = canvas.getContext('2d');
                    const colorPicker = document.getElementById('colorPicker');
                    const brushSize = document.getElementById('brushSize');
                    const clearBtn = document.getElementById('clearCanvas');
                    const saveBtn = document.getElementById('saveCanvas');
                    
                    let isDrawing = false;
                    let currentColor = '#ff6b6b';
                    let currentSize = 5;
                    let lastX = 0;
                    let lastY = 0;
                    
                    // Drawing functionality
                    function startDrawing(e) {
                        isDrawing = true;
                        const rect = canvas.getBoundingClientRect();
                        lastX = e.clientX - rect.left;
                        lastY = e.clientY - rect.top;
                    }
                    
                    function draw(e) {
                        if (!isDrawing) return;
                        const rect = canvas.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        const drawData = {
                            x, y, lastX, lastY,
                            color: currentColor,
                            size: currentSize
                        };
                        
                        drawLine(drawData);
                        socket.emit('drawing', drawData);
                        
                        lastX = x;
                        lastY = y;
                    }
                    
                    function drawLine(data) {
                        ctx.globalCompositeOperation = 'source-over';
                        ctx.strokeStyle = data.color;
                        ctx.lineWidth = data.size;
                        ctx.lineCap = 'round';
                        ctx.lineJoin = 'round';
                        
                        ctx.beginPath();
                        ctx.moveTo(data.lastX, data.lastY);
                        ctx.lineTo(data.x, data.y);
                        ctx.stroke();
                        
                        // Add sparkle effect
                        if (Math.random() > 0.7) {
                            createSparkle(data.x, data.y);
                        }
                    }
                    
                    function createSparkle(x, y) {
                        const sparkle = document.createElement('div');
                        sparkle.innerHTML = '✨';
                        sparkle.style.position = 'absolute';
                        sparkle.style.left = (canvas.offsetLeft + x) + 'px';
                        sparkle.style.top = (canvas.offsetTop + y) + 'px';
                        sparkle.style.pointerEvents = 'none';
                        sparkle.style.animation = 'sparkleAnim 1s ease-out forwards';
                        sparkle.style.fontSize = '12px';
                        document.body.appendChild(sparkle);
                        
                        setTimeout(() => sparkle.remove(), 1000);
                    }
                    
                    // Color palette
                    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
                    let colorIndex = 0;
                    
                    colorPicker.addEventListener('click', () => {
                        colorIndex = (colorIndex + 1) % colors.length;
                        currentColor = colors[colorIndex];
                        colorPicker.style.background = currentColor;
                    });
                    
                    brushSize.addEventListener('input', (e) => {
                        currentSize = e.target.value;
                    });
                    
                    clearBtn.addEventListener('click', () => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        socket.emit('clearCanvas');
                    });
                    
                    saveBtn.addEventListener('click', () => {
                        const link = document.createElement('a');
                        link.download = 'colabvibe-masterpiece.png';
                        link.href = canvas.toDataURL();
                        link.click();
                    });
                    
                    // Canvas events
                    canvas.addEventListener('mousedown', startDrawing);
                    canvas.addEventListener('mousemove', draw);
                    canvas.addEventListener('mouseup', () => isDrawing = false);
                    canvas.addEventListener('mouseout', () => isDrawing = false);
                    
                    // Socket events
                    socket.on('drawing', drawLine);
                    socket.on('clearCanvas', () => {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    });
                    
                    socket.on('userCount', (count) => {
                        document.getElementById('userCount').textContent = count;
                    });
                    
                    // Load existing canvas data when joining
                    socket.on('canvasData', (data) => {
                        data.forEach(drawLine);
                    });
                    
                    // Emoji reactions
                    document.querySelectorAll('.emoji-btn').forEach(btn => {
                        btn.addEventListener('click', () => {
                            const emoji = btn.dataset.emoji;
                            socket.emit('emojiReaction', emoji);
                        });
                    });
                    
                    socket.on('emojiReaction', (emoji) => {
                        createFloatingEmoji(emoji);
                    });
                    
                    function createFloatingEmoji(emoji) {
                        const floatingEmoji = document.createElement('div');
                        floatingEmoji.innerHTML = emoji;
                        floatingEmoji.style.position = 'absolute';
                        floatingEmoji.style.left = Math.random() * window.innerWidth + 'px';
                        floatingEmoji.style.top = window.innerHeight + 'px';
                        floatingEmoji.style.fontSize = '30px';
                        floatingEmoji.style.pointerEvents = 'none';
                        floatingEmoji.style.animation = 'floatUp 3s ease-out forwards';
                        floatingEmoji.style.zIndex = '9999';
                        document.body.appendChild(floatingEmoji);
                        
                        setTimeout(() => floatingEmoji.remove(), 3000);
                    }
                </script>
                
                <style>
                    .drawing-section {
                        margin: 40px 0;
                        text-align: center;
                    }
                    
                    .canvas-controls {
                        margin: 20px 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-wrap: wrap;
                    }
                    
                    .emoji-bar {
                        margin: 20px 0;
                        text-align: center;
                    }
                    
                    .emoji-btn {
                        font-size: 30px;
                        margin: 0 10px;
                        cursor: pointer;
                        transition: transform 0.2s;
                        display: inline-block;
                    }
                    
                    .emoji-btn:hover {
                        transform: scale(1.3);
                    }
                    
                    @keyframes sparkleAnim {
                        0% { opacity: 1; transform: scale(1) rotate(0deg); }
                        100% { opacity: 0; transform: scale(2) rotate(180deg) translateY(-20px); }
                    }
                    
                    @keyframes floatUp {
                        0% { 
                            opacity: 1; 
                            transform: translateY(0) rotate(0deg) scale(1); 
                        }
                        100% { 
                            opacity: 0; 
                            transform: translateY(-200px) rotate(360deg) scale(1.5); 
                        }
                    }
                </style>
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

// Socket.IO real-time communication
io.on('connection', (socket) => {
    console.log('🎨 New artist connected:', socket.id);
    activeUsers.add(socket.id);
    
    // Send current canvas data to new user
    socket.emit('canvasData', canvasData);
    
    // Broadcast updated user count
    io.emit('userCount', activeUsers.size);
    
    // Handle drawing events
    socket.on('drawing', (data) => {
        // Store drawing data
        canvasData.push(data);
        
        // Keep only last 1000 drawing operations for performance
        if (canvasData.length > 1000) {
            canvasData = canvasData.slice(-1000);
        }
        
        // Broadcast to all other users
        socket.broadcast.emit('drawing', data);
    });
    
    // Handle canvas clear
    socket.on('clearCanvas', () => {
        canvasData = [];
        socket.broadcast.emit('clearCanvas');
    });
    
    // Handle emoji reactions
    socket.on('emojiReaction', (emoji) => {
        const reaction = {
            emoji,
            timestamp: Date.now(),
            user: socket.id
        };
        
        emojiReactions.push(reaction);
        
        // Keep only last 50 reactions
        if (emojiReactions.length > 50) {
            emojiReactions = emojiReactions.slice(-50);
        }
        
        // Broadcast to all users
        io.emit('emojiReaction', emoji);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('🎨 Artist disconnected:', socket.id);
        activeUsers.delete(socket.id);
        io.emit('userCount', activeUsers.size);
    });
});

// Add API endpoint for canvas data
app.get('/api/canvas', (req, res) => {
    res.json({
        drawingCount: canvasData.length,
        activeUsers: activeUsers.size,
        recentReactions: emojiReactions.slice(-10)
    });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🏢 ColabVibe Test Server running on http://localhost:${PORT}`);
    console.log(`🎨 Real-time Drawing Canvas enabled!`);
    console.log(`📊 API Status: http://localhost:${PORT}/api/status`);
    console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🎯 Canvas API: http://localhost:${PORT}/api/canvas`);
});
