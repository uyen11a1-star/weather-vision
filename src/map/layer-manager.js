export class LayerManager {
    constructor(map) {
        this.map = map;
        this.layers = {};
    }
    async addWindLayer(lat, lng) {
        // Tải dữ liệu gió từ Open-Meteo (dạng grid đơn giản)
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=wind_speed_10m,wind_direction_10m&forecast_days=1`;
        const res = await fetch(url);
        const data = await res.json();
        const windData = this.formatWindData(data, lat, lng);
        this.layers.wind = L.velocityLayer({
            displayValues: true,
            data: windData,
            maxVelocity: 25
        }).addTo(this.map);
    }
    formatWindData(apiData, lat, lng) {
        // Chuyển đổi dữ liệu điểm thành mảng grid đơn giản ( demo )
        const u = apiData.hourly.wind_speed_10m[0] * Math.sin(apiData.hourly.wind_direction_10m[0] * Math.PI/180);
        const v = apiData.hourly.wind_speed_10m[0] * Math.cos(apiData.hourly.wind_direction_10m[0] * Math.PI/180);
        return [{
            header: { parameterCategory: 2, parameterNumber: 2, refTime: new Date().toISOString() },
            data: [u, v],
            la1: lat, lo1: lng, la2: lat, lo2: lng, nx: 1, ny: 1, dx: 1, dy: 1
        }];
    }
    addStormLayer(storms) {
        storms.forEach(s => {
            if (s.latitude && s.longitude) {
                L.circleMarker([s.latitude, s.longitude], { color: 'red', radius: 8 })
                    .bindPopup(`${s.name} - ${s.intensity}`).addTo(this.map);
            }
        });
    }
    toggleLayer(name, visible) {
        if (this.layers[name]) {
            visible ? this.map.addLayer(this.layers[name]) : this.map.removeLayer(this.layers[name]);
        }
    }
}
