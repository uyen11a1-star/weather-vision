export class MapEngine {
    constructor(containerId, center, zoom) {
        this.map = L.map(containerId).setView([center.lat, center.lng], zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(this.map);
    }
    setView(lat, lng, zoom) { this.map.setView([lat, lng], zoom); }
}
