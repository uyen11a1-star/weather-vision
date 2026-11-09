import { CanvasOverlay } from '../map/canvas-overlay.js';

export class WindRenderer {
    constructor(map) {
        this.map = map;
        this.canvasLayer = new CanvasOverlay({ pane: 'overlayPane' }).addTo(map);
        this.ctx = this.canvasLayer.getContext();
        this.particles = [];
        this.particleCount = 1500; // Số lượng hạt (tăng giảm tùy máy)
        this.isRunning = false;
        this.animationId = null;

        // Khởi tạo hạt
        this.canvasLayer._onResize = () => this.initParticles();
        this.initParticles();
    }

    initParticles() {
        const size = this.canvasLayer.getSize();
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * size.x,
                y: Math.random() * size.y,
                age: Math.random() * 100,
                maxAge: 100
            });
        }
    }

    // Hàm tạo hướng gió (Giả lập trường vector gió bằng toán học)
    // Bạn có thể thay đổi hàm này để đọc dữ liệu thật từ API sau này
    getWindVector(x, y) {
        const time = Date.now() / 5000;
        // Tạo luồng gió xoáy nhẹ nhàng bằng hàm Sin/Cos
        const angle = Math.sin(x * 0.005 + time) * Math.cos(y * 0.005 - time) * Math.PI * 2;
        const speed = 1.5; // Tốc độ gió
        return {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed
        };
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.ctx.clearRect(0, 0, this.canvasLayer.getSize().x, this.canvasLayer.getSize().y);
    }

    animate() {
        if (!this.isRunning) return;
        
        const size = this.canvasLayer.getSize();
        const ctx = this.ctx;

        // Xóa mờ dần để tạo vệt (trail)
        ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'; // Màu nền tối
        ctx.fillRect(0, 0, size.x, size.y);

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)'; // Màu xanh cyan
        ctx.beginPath();

        for (let p of this.particles) {
            const vector = this.getWindVector(p.x, p.y);
            
            const nextX = p.x + vector.vx;
            const nextY = p.y + vector.vy;

            ctx.moveTo(p.x, p.y);
            ctx.lineTo(nextX, nextY);

            p.x = nextX;
            p.y = nextY;
            p.age++;

            // Reset hạt nếu ra khỏi màn hình hoặc hết tuổi thọ
            if (p.x < 0 || p.x > size.x || p.y < 0 || p.y > size.y || p.age > p.maxAge) {
                p.x = Math.random() * size.x;
                p.y = Math.random() * size.y;
                p.age = 0;
            }
        }
        ctx.stroke();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}
