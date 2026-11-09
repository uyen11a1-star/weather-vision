export class MapEngine {
    constructor(containerId, center, zoom) {
        this.map = L.map(containerId, { zoomControl: false }).setView([center.lat, center.lng], zoom);
        
        // Sử dụng CartoDB Dark Matter cho giao diện chuyên nghiệp (giống Windy)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(this.map);

        // Thêm nút zoom ở góc dưới trái
        L.control.zoom({ position: 'bottomleft' }).addTo(this.map);
    }
    setView(lat, lng, zoom) { this.map.flyTo([lat, lng], zoom, { duration: 1.5 }); }
}
