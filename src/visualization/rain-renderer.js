import { CanvasOverlay } from '../map/canvas-overlay.js';

export class RainRenderer {
    constructor(map) {
        this.map = map;
        this.canvasLayer = new CanvasOverlay({ pane: 'overlayPane' }).addTo(map);
        this.ctx = this.canvasLayer.getContext();
        this.drops = [];
        this.isRunning = false;
        this.animationId = null;

        this.canvasLayer._onResize = () => this.initDrops();
        this.initDrops();
    }

    initDrops() {
        const size = this.canvasLayer.getSize();
        this.drops = [];
        for (let i = 0; i < 300; i++) {
            this.drops.push({
                x: Math.random() * size.x,
                y: Math.random() * size.y,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 10 + 10
            });
        }
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

        ctx.clearRect(0, 0, size.x, size.y);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'; // Màu xám xanh
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';

        ctx.beginPath();
        for (let d of this.drops) {
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x - 2, d.y + d.length); // Mưa rơi chéo nhẹ
            
            d.y += d.speed;
            d.x -= (d.speed * 0.2);

            if (d.y > size.y) {
                d.y = -d.length;
                d.x = Math.random() * size.x;
            }
        }
        ctx.stroke();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}
