// Lớp phủ Canvas tự chế để vẽ hạt gió/mưa
export class CanvasOverlay extends L.Layer {
    constructor(options = {}) {
        super();
        this._options = options;
        this._canvas = null;
        this._ctx = null;
    }

    onAdd(map) {
        this._map = map;
        this._canvas = L.DomUtil.create('canvas', 'leaflet-canvas-layer');
        this._canvas.style.position = 'absolute';
        this._canvas.style.pointerEvents = 'none'; // Cho phép click xuyên qua
        this._canvas.style.zIndex = 400; // Nằm trên bản đồ, dưới panel
        
        const pane = map.getPane(this._options.pane) || map.getPane('overlayPane');
        pane.appendChild(this._canvas);
        
        this._ctx = this._canvas.getContext('2d');
        this._resize();
        
        map.on('move resize zoomend', this._resize, this);
        return this;
    }

    onRemove(map) {
        map.off('move resize zoomend', this._resize, this);
        L.DomUtil.remove(this._canvas);
    }

    _resize() {
        const size = this._map.getSize();
        const dpr = window.devicePixelRatio || 1;
        this._canvas.width = size.x * dpr;
        this._canvas.height = size.y * dpr;
        this._canvas.style.width = size.x + 'px';
        this._canvas.style.height = size.y + 'px';
        this._ctx.scale(dpr, dpr);
        
        if (this._onResize) this._onResize(size);
    }

    getContext() { return this._ctx; }
    getCanvas() { return this._canvas; }
    getSize() { return this._map.getSize(); }
}
