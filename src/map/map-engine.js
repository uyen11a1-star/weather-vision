export class MapEngine {
    constructor(containerId, center, zoom) {
        this.map = L.map(containerId, { zoomControl: false }).setView([center.lat, center.lng], zoom);
        
        // Sử dụng OpenStreetMap gốc - 100% Miễn phí, KHÔNG CẦN API KEY
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        // Thêm nút zoom ở góc dưới trái
        L.control.zoom({ position: 'bottomleft' }).addTo(this.map);
    }
    setView(lat, lng, zoom) { this.map.flyTo([lat, lng], zoom, { duration: 1.5 }); }
}
