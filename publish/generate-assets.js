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

// 5. Desktop screenshot 1920x1080
function generateDesktopScreenshot() {
    const canvas = createCanvas(1920, 1080);
    const ctx = canvas.getContext('2d');
    drawSpaceBg(ctx, 1920, 1080);

    // Game board centered
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

    // Score
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('1247', 960, boardY - 30);

    // Trophy
    ctx.font = '36px Arial';
    ctx.fillText('🏆 282', 1350, boardY - 30);

    // Timer
    ctx.fillStyle = 'rgba(30,15,60,0.5)';
    ctx.fillRect(boardX, boardY - 15, boardW, 8);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(boardX, boardY - 15, boardW * 0.7, 8);

    // Bottom stats
    const stats = [
        { color: '#FF2D55', count: 12 },
        { color: '#AF52DE', count: 8 },
        { color: '#5AC8FA', count: 11 },
        { color: '#34C759', count: 17 },
        { color: '#FFD60A', count: 14 },
        { color: '#FF9500', count: 5 },
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

    fs.writeFileSync(path.join(dir, 'desktop-screenshot.png'), canvas.toBuffer('image/png'));
    console.log('✓ desktop-screenshot.png (1920x1080)');
}

// 6. Mobile screenshot 1080x1920
function generateMobileScreenshot() {
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

    // Title
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('КОСМИЧЕСКИЕ', 540, 120);
    ctx.font = 'bold 48px Arial';
    ctx.fillText('ДРАГОЦЕННОСТИ', 540, 180);

    // Score
    ctx.font = 'bold 44px Arial';
    ctx.fillText('456', 540, boardY - 30);
    ctx.font = '28px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText('🏆 Рекорд: 282', 540, boardY - 60);

    // Timer
    ctx.fillStyle = 'rgba(30,15,60,0.5)';
    ctx.fillRect(boardX, boardY - 15, boardW, 8);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(boardX, boardY - 15, boardW * 0.85, 8);

    // Bottom stats
    const stats = [
        { color: '#FF2D55', count: 12 },
        { color: '#AF52DE', count: 8 },
        { color: '#5AC8FA', count: 11 },
        { color: '#34C759', count: 17 },
        { color: '#FFD60A', count: 14 },
        { color: '#FF9500', count: 5 },
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

    // Boosters
    for (let i = 0; i < 4; i++) {
        const bx = boardX + i * 130 + 30;
        const by = boardY + boardH + 80;
        ctx.fillStyle = 'rgba(30,15,60,0.8)';
        ctx.strokeStyle = 'rgba(150,100,255,0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(bx, by, 100, 100, 10);
        ctx.fill();
        ctx.stroke();
    }

    // "Новая игра" button
    ctx.fillStyle = 'rgba(150,100,255,0.3)';
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(340, 1750, 400, 70, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Новая игра', 540, 1795);

    fs.writeFileSync(path.join(dir, 'mobile-screenshot.png'), canvas.toBuffer('image/png'));
    console.log('✓ mobile-screenshot.png (1080x1920)');
}

// Run all
try {
    generateIcon();
    generateMaskableIcon();
    generateCover();
    generateHero();
    generateDesktopScreenshot();
    generateMobileScreenshot();
    console.log('\nAll assets generated in publish/assets/');
} catch (e) {
    console.log('canvas module not available, generating with alternative method...');
    console.log(e.message);
}
