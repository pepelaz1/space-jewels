// Node.js script to generate game assets
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Helper: draw stars
function drawStars(ctx, w, h, count) {
    for (let i = 0; i < count; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.8 + 0.2})`;
        ctx.beginPath();
        ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2 + 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Helper: draw gem
function drawGem(ctx, x, y, r, color) {
    // Glow
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 1.5);
    glow.addColorStop(0, color + '60');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
}

// Helper: space background
function drawSpaceBg(ctx, w, h) {
    const grad = ctx.createRadialGradient(w * 0.3, h * 0.3, 0, w / 2, h / 2, w * 0.8);
    grad.addColorStop(0, '#1a0a3e');
    grad.addColorStop(0.5, '#0d1b4a');
    grad.addColorStop(1, '#050520');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Nebula
    const neb1 = ctx.createRadialGradient(w * 0.2, h * 0.8, 0, w * 0.2, h * 0.8, w * 0.4);
    neb1.addColorStop(0, 'rgba(100,50,180,0.2)');
    neb1.addColorStop(1, 'transparent');
    ctx.fillStyle = neb1;
    ctx.fillRect(0, 0, w, h);

    const neb2 = ctx.createRadialGradient(w * 0.8, h * 0.2, 0, w * 0.8, h * 0.2, w * 0.35);
    neb2.addColorStop(0, 'rgba(30,80,160,0.15)');
    neb2.addColorStop(1, 'transparent');
    ctx.fillStyle = neb2;
    ctx.fillRect(0, 0, w, h);

    drawStars(ctx, w, h, Math.floor(w * h / 2000));
}

// 1. Icon 512x512
function generateIcon() {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    drawSpaceBg(ctx, 512, 512);

    const gems = [
        { x: 128, y: 150, r: 42, c: '#FF2D55' },
        { x: 256, y: 110, r: 48, c: '#FFD60A' },
        { x: 384, y: 150, r: 42, c: '#5AC8FA' },
        { x: 170, y: 270, r: 45, c: '#AF52DE' },
        { x: 342, y: 270, r: 45, c: '#34C759' },
        { x: 256, y: 340, r: 50, c: '#FF9500' },
    ];
    gems.forEach(g => drawGem(ctx, g.x, g.y, g.r, g.c));

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 38px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('КОСМИЧЕСКИЕ', 256, 435);
    ctx.font = 'bold 36px Arial';
    ctx.fillText('ДРАГОЦЕННОСТИ', 256, 478);

    fs.writeFileSync(path.join(dir, 'icon.png'), canvas.toBuffer('image/png'));
    console.log('✓ icon.png (512x512)');
}

// 2. Maskable icon 512x512
function generateMaskableIcon() {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    drawSpaceBg(ctx, 512, 512);

    const gems = [
        { x: 256, y: 160, r: 55, c: '#FFD60A' },
        { x: 170, y: 280, r: 50, c: '#FF2D55' },
        { x: 342, y: 280, r: 50, c: '#5AC8FA' },
        { x: 256, y: 330, r: 45, c: '#34C759' },
    ];
    gems.forEach(g => drawGem(ctx, g.x, g.y, g.r, g.c));

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('КОСМИЧЕСКИЕ', 256, 420);
    ctx.fillText('ДРАГОЦЕННОСТИ', 256, 455);

    // Safe zone circle indicator
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(256, 256, 200, 0, Math.PI * 2);
    ctx.stroke();

    fs.writeFileSync(path.join(dir, 'maskable-icon.png'), canvas.toBuffer('image/png'));
    console.log('✓ maskable-icon.png (512x512)');
}

// 3. Cover 800x470
function generateCover() {
    const canvas = createCanvas(800, 470);
    const ctx = canvas.getContext('2d');
    drawSpaceBg(ctx, 800, 470);

    // Game board preview
    const boardX = 480, boardY = 60, tileSize = 38, cols = 8, rows = 8;
    ctx.fillStyle = 'rgba(15,10,40,0.6)';
    ctx.strokeStyle = 'rgba(150,100,255,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(boardX - 5, boardY - 5, cols * tileSize + 10, rows * tileSize + 10, 8);
    ctx.fill();
    ctx.stroke();

    const colors = ['#FF2D55', '#AF52DE', '#5AC8FA', '#34C759', '#FFD60A', '#FF9500'];
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const x = boardX + c * tileSize + tileSize / 2;
            const y = boardY + r * tileSize + tileSize / 2;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, tileSize * 0.38, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 56px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('КОСМИЧЕСКИЕ', 40, 180);
    ctx.fillText('ДРАГОЦЕННОСТИ', 40, 250);

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '24px Arial';
    ctx.fillText('Три в ряд • Бесплатно • В браузере', 40, 310);

    // Gems decoration
    drawGem(ctx, 100, 380, 25, '#FF2D55');
    drawGem(ctx, 170, 400, 22, '#AF52DE');
    drawGem(ctx, 240, 375, 28, '#FFD60A');
    drawGem(ctx, 310, 395, 24, '#5AC8FA');
    drawGem(ctx, 380, 370, 26, '#34C759');

    fs.writeFileSync(path.join(dir, 'cover.png'), canvas.toBuffer('image/png'));
    console.log('✓ cover.png (800x470)');
}

// 4. Hero Image 1560x520
function generateHero() {
    const canvas = createCanvas(1560, 520);
    const ctx = canvas.getContext('2d');
    drawSpaceBg(ctx, 1560, 520);

    // Large game board
    const boardX = 900, boardY = 30, tileSize = 55, cols = 8, rows = 8;
    ctx.fillStyle = 'rgba(15,10,40,0.5)';
    ctx.strokeStyle = 'rgba(150,100,255,0.4)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(boardX - 8, boardY - 8, cols * tileSize + 16, rows * tileSize + 16, 12);
    ctx.fill();
    ctx.stroke();

    const colors = ['#FF2D55', '#AF52DE', '#5AC8FA', '#34C759', '#FFD60A', '#FF9500'];
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const x = boardX + c * tileSize + tileSize / 2;
            const y = boardY + r * tileSize + tileSize / 2;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, tileSize * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('КОСМИЧЕСКИЕ', 60, 200);
    ctx.fillText('ДРАГОЦЕННОСТИ', 60, 300);

    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '32px Arial';
    ctx.fillText('Три в ряд • Бесплатно • В браузере', 60, 370);

    // Gems
    const heroGems = [
        { x: 80, y: 450, r: 35, c: '#FF2D55' },
        { x: 170, y: 460, r: 30, c: '#AF52DE' },
        { x: 260, y: 445, r: 38, c: '#FFD60A' },
        { x: 350, y: 460, r: 32, c: '#5AC8FA' },
        { x: 440, y: 440, r: 34, c: '#34C759' },
        { x: 530, y: 455, r: 36, c: '#FF9500' },
    ];
    heroGems.forEach(g => drawGem(ctx, g.x, g.y, g.r, g.c));

    fs.writeFileSync(path.join(dir, 'hero.png'), canvas.toBuffer('image/png'));
    console.log('✓ hero.png (1560x520)');
}

// 5. Desktop screenshot 1920x1080 - Gameplay
function generateDesktopScreenshot1() {
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');
    drawSpaceBg(ctx, 1920, 1080);

    const tileSize = 80, cols = 8, rows = 8;
    const boardW = cols * tileSize, boardH = rows * tileSize;
    const boardX = (1920 - boardW) / 2, boardY = (1080 - boardH) / 2 - 20;

    ctx.fillStyle = 'rgba(15,10,40,0.5)';
    ctx.strokeStyle = 'rgba(150,100,255,0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(boardX - 8, boardY - 8, boardW + 16, boardH + 16, 10);
    ctx.fill();
    ctx.stroke();

    const colors = ['#FF2D55', '#AF52DE', '#5AC8FA', '#34C759', '#FFD60A', '#FF9500'];
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const color = colors[(c + r) % colors.length];
            const x = boardX + c * tileSize + tileSize / 2;
            const y = boardY + r * tileSize + tileSize / 2;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, tileSize * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            ctx.beginPath();
            ctx.arc(x - tileSize * 0.1, y - tileSize * 0.1, tileSize * 0.15, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('1247', 960, boardY - 30);
    ctx.font = '36px Arial';
    ctx.fillText('🏆 282', 1350, boardY - 30);

    ctx.fillStyle = 'rgba(30,15,60,0.5)';
    ctx.fillRect(boardX, boardY - 15, boardW, 8);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(boardX, boardY - 15, boardW * 0.7, 8);

    const stats = [
        { color: '#FF2D55', count: 12 }, { color: '#AF52DE', count: 8 },
        { color: '#5AC8FA', count: 11 }, { color: '#34C759', count: 17 },
        { color: '#FFD60A', count: 14 }, { color: '#FF9500', count: 5 },
    ];
    stats.forEach((s, i) => {
        const sx = boardX + i * (boardW / 6) + 10;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.roundRect(sx, boardY + boardH + 15, boardW / 6 - 20, 28, 6);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(s.count, sx + (boardW / 6 - 20) / 2, boardY + boardH + 35);
    });

    fs.writeFileSync(path.join(dir, 'desktop-1.png'), canvas.toBuffer('image/png'));
    console.log('✓ desktop-1.png (1920x1080)');
}

// 6. Desktop screenshot - Time's Up overlay
function generateDesktopScreenshot2() {
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');
    drawSpaceBg(ctx, 1920, 1080);

    const tileSize = 80, cols = 8, rows = 8;
    const boardW = cols * tileSize, boardH = rows * tileSize;
    const boardX = (1920 - boardW) / 2, boardY = (1080 - boardH) / 2 - 20;

    // Board background
    ctx.fillStyle = 'rgba(15,10,40,0.5)';
    ctx.strokeStyle = 'rgba(150,100,255,0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(boardX - 8, boardY - 8, boardW + 16, boardH + 16, 10);
    ctx.fill();
    ctx.stroke();

    // Gems (slightly dimmed)
    const colors = ['#FF2D55', '#AF52DE', '#5AC8FA', '#34C759', '#FFD60A', '#FF9500'];
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const color = colors[(c * 2 + r * 3) % colors.length];
            const x = boardX + c * tileSize + tileSize / 2;
            const y = boardY + r * tileSize + tileSize / 2;
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(x, y, tileSize * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.globalAlpha = 1;

    // Dark overlay
    ctx.fillStyle = 'rgba(10,0,30,0.7)';
    ctx.fillRect(boardX, boardY, boardW, boardH);

    // Time's up text
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 64px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ВРЕМЯ ИСТЕКЛО!', 960, 480);

    ctx.fillStyle = 'rgba(255,215,0,0.3)';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(760, 520, 400, 70, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('+30 сек за просмотр', 960, 565);

    ctx.fillStyle = 'rgba(255,215,0,0.2)';
    ctx.strokeStyle = 'rgba(150,100,255,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(760, 620, 400, 60, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = '24px Arial';
    ctx.fillText('▶ Новая игра', 960, 658);

    fs.writeFileSync(path.join(dir, 'desktop-2.png'), canvas.toBuffer('image/png'));
    console.log('✓ desktop-2.png (1920x1080)');
}

// 7. Desktop screenshot - Boosters view
function generateDesktopScreenshot3() {
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');
    drawSpaceBg(ctx, 1920, 1080);

    const tileSize = 80, cols = 8, rows = 8;
    const boardW = cols * tileSize, boardH = rows * tileSize;
    const boardX = (1920 - boardW) / 2, boardY = (1080 - boardH) / 2 - 60;

    ctx.fillStyle = 'rgba(15,10,40,0.5)';
    ctx.strokeStyle = 'rgba(150,100,255,0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(boardX - 8, boardY - 8, boardW + 16, boardH + 16, 10);
    ctx.fill();
    ctx.stroke();

    const colors = ['#FF2D55', '#AF52DE', '#5AC8FA', '#34C759', '#FFD60A', '#FF9500'];
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const x = boardX + c * tileSize + tileSize / 2;
            const y = boardY + r * tileSize + tileSize / 2;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, tileSize * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Score
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('2850', 960, boardY - 30);

    // Timer - low
    ctx.fillStyle = 'rgba(30,15,60,0.5)';
    ctx.fillRect(boardX, boardY - 15, boardW, 8);
    ctx.fillStyle = '#FF2D55';
    ctx.fillRect(boardX, boardY - 15, boardW * 0.2, 8);

    // Stats
    const stats = [
        { color: '#FF2D55', count: 18 }, { color: '#AF52DE', count: 15 },
        { color: '#5AC8FA', count: 22 }, { color: '#34C759', count: 12 },
        { color: '#FFD60A', count: 20 }, { color: '#FF9500', count: 8 },
    ];
    stats.forEach((s, i) => {
        const sx = boardX + i * (boardW / 6) + 10;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.roundRect(sx, boardY + boardH + 15, boardW / 6 - 20, 28, 6);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(s.count, sx + (boardW / 6 - 20) / 2, boardY + boardH + 35);
    });

    // Boosters row
    const boosterIcons = ['🔍', '💣', '🎯', '🌈'];
    const boosterLabels = ['Подсказка', 'Уд. цвета', 'Уд. область', 'Любой цвет'];
    const boosterCounts = ['3', '2', '1', '1'];
    for (let i = 0; i < 4; i++) {
        const bx = boardX + i * (boardW / 4) + 20;
        const by = boardY + boardH + 65;
        ctx.fillStyle = 'rgba(30,15,60,0.8)';
        ctx.strokeStyle = 'rgba(150,100,255,0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx, by, boardW / 4 - 40, 90, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = '32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(boosterIcons[i], bx + (boardW / 4 - 40) / 2, by + 40);
        ctx.font = '14px Arial';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(boosterLabels[i], bx + (boardW / 4 - 40) / 2, by + 65);
        // Badge
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('x' + boosterCounts[i], bx + boardW / 4 - 55, by + 18);
    }

    fs.writeFileSync(path.join(dir, 'desktop-3.png'), canvas.toBuffer('image/png'));
    console.log('✓ desktop-3.png (1920x1080)');
}

// 8. Mobile screenshot 1080x1920 - Gameplay
function generateMobileScreenshot1() {
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext('2d');
    drawSpaceBg(ctx, 1080, 1920);

    const tileSize = 100, cols = 6, rows = 8;
    const boardW = cols * tileSize, boardH = rows * tileSize;
    const boardX = (1080 - boardW) / 2, boardY = 350;

    ctx.fillStyle = 'rgba(15,10,40,0.5)';
    ctx.strokeStyle = 'rgba(150,100,255,0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(boardX - 8, boardY - 8, boardW + 16, boardH + 16, 10);
    ctx.fill();
    ctx.stroke();

    const colors = ['#FF2D55', '#AF52DE', '#5AC8FA', '#34C759', '#FFD60A', '#FF9500'];
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const color = colors[(c * 3 + r * 2) % colors.length];
            const x = boardX + c * tileSize + tileSize / 2;
            const y = boardY + r * tileSize + tileSize / 2;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, tileSize * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('КОСМИЧЕСКИЕ', 540, 120);
    ctx.font = 'bold 48px Arial';
    ctx.fillText('ДРАГОЦЕННОСТИ', 540, 180);

    ctx.font = 'bold 44px Arial';
    ctx.fillText('456', 540, boardY - 30);
    ctx.font = '28px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('🏆 Рекорд: 282', 540, boardY - 60);

    ctx.fillStyle = 'rgba(30,15,60,0.5)';
    ctx.fillRect(boardX, boardY - 15, boardW, 8);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(boardX, boardY - 15, boardW * 0.85, 8);

    const stats = [
        { color: '#FF2D55', count: 12 }, { color: '#AF52DE', count: 8 },
        { color: '#5AC8FA', count: 11 }, { color: '#34C759', count: 17 },
        { color: '#FFD60A', count: 14 }, { color: '#FF9500', count: 5 },
    ];
    stats.forEach((s, i) => {
        const sx = boardX + i * (boardW / 6) + 5;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.roundRect(sx, boardY + boardH + 20, boardW / 6 - 10, 32, 6);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(s.count, sx + (boardW / 6 - 10) / 2, boardY + boardH + 42);
    });

    fs.writeFileSync(path.join(dir, 'mobile-1.png'), canvas.toBuffer('image/png'));
    console.log('✓ mobile-1.png (1080x1920)');
}

// 9. Mobile screenshot - Time's Up
function generateMobileScreenshot2() {
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext('2d');
    drawSpaceBg(ctx, 1080, 1920);

    const tileSize = 100, cols = 6, rows = 8;
    const boardW = cols * tileSize, boardH = rows * tileSize;
    const boardX = (1080 - boardW) / 2, boardY = 350;

    ctx.fillStyle = 'rgba(15,10,40,0.5)';
    ctx.strokeStyle = 'rgba(150,100,255,0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(boardX - 8, boardY - 8, boardW + 16, boardH + 16, 10);
    ctx.fill();
    ctx.stroke();

    const colors = ['#FF2D55', '#AF52DE', '#5AC8FA', '#34C759', '#FFD60A', '#FF9500'];
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const color = colors[(c * 2 + r) % colors.length];
            const x = boardX + c * tileSize + tileSize / 2;
            const y = boardY + r * tileSize + tileSize / 2;
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.4;
            ctx.beginPath();
            ctx.arc(x, y, tileSize * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'rgba(10,0,30,0.7)';
    ctx.fillRect(boardX, boardY, boardW, boardH);

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ВРЕМЯ', 540, 600);
    ctx.fillText('ИСТЕКЛО!', 540, 670);

    ctx.fillStyle = 'rgba(255,215,0,0.3)';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(240, 720, 600, 80, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('+30 сек за просмотр', 540, 770);

    ctx.fillStyle = 'rgba(150,100,255,0.3)';
    ctx.strokeStyle = 'rgba(150,100,255,0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(240, 830, 600, 70, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('▶ Новая игра', 540, 875);

    fs.writeFileSync(path.join(dir, 'mobile-2.png'), canvas.toBuffer('image/png'));
    console.log('✓ mobile-2.png (1080x1920)');
}

// 10. Mobile screenshot - Boosters
function generateMobileScreenshot3() {
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext('2d');
    drawSpaceBg(ctx, 1080, 1920);

    const tileSize = 100, cols = 6, rows = 8;
    const boardW = cols * tileSize, boardH = rows * tileSize;
    const boardX = (1080 - boardW) / 2, boardY = 300;

    ctx.fillStyle = 'rgba(15,10,40,0.5)';
    ctx.strokeStyle = 'rgba(150,100,255,0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(boardX - 8, boardY - 8, boardW + 16, boardH + 16, 10);
    ctx.fill();
    ctx.stroke();

    const colors = ['#FF2D55', '#AF52DE', '#5AC8FA', '#34C759', '#FFD60A', '#FF9500'];
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const x = boardX + c * tileSize + tileSize / 2;
            const y = boardY + r * tileSize + tileSize / 2;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, tileSize * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('2850', 540, boardY - 30);

    ctx.fillStyle = 'rgba(30,15,60,0.5)';
    ctx.fillRect(boardX, boardY - 15, boardW, 8);
    ctx.fillStyle = '#FF2D55';
    ctx.fillRect(boardX, boardY - 15, boardW * 0.15, 8);

    const stats = [
        { color: '#FF2D55', count: 18 }, { color: '#AF52DE', count: 15 },
        { color: '#5AC8FA', count: 22 }, { color: '#34C759', count: 12 },
        { color: '#FFD60A', count: 20 }, { color: '#FF9500', count: 8 },
    ];
    stats.forEach((s, i) => {
        const sx = boardX + i * (boardW / 6) + 3;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.roundRect(sx, boardY + boardH + 15, boardW / 6 - 6, 30, 6);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(s.count, sx + (boardW / 6 - 6) / 2, boardY + boardH + 36);
    });

    // Boosters
    const boosterIcons = ['🔍', '💣', '🎯', '🌈'];
    for (let i = 0; i < 4; i++) {
        const bx = boardX + i * 150 + 10;
        const by = boardY + boardH + 70;
        ctx.fillStyle = 'rgba(30,15,60,0.8)';
        ctx.strokeStyle = 'rgba(150,100,255,0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx, by, 120, 120, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = 'white';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(boosterIcons[i], bx + 60, by + 60);
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 18px Arial';
        ctx.fillText('x' + (4 - i), bx + 100, by + 25);
    }

    fs.writeFileSync(path.join(dir, 'mobile-3.png'), canvas.toBuffer('image/png'));
    console.log('✓ mobile-3.png (1080x1920)');
}

// Run all
try {
    generateIcon();
    generateMaskableIcon();
    generateCover();
    generateHero();
    generateDesktopScreenshot1();
    generateDesktopScreenshot2();
    generateDesktopScreenshot3();
    generateMobileScreenshot1();
    generateMobileScreenshot2();
    generateMobileScreenshot3();
    console.log('\nAll assets generated in publish/assets/');
} catch (e) {
    console.log('canvas module not available, generating with alternative method...');
    console.log(e.message);
}
