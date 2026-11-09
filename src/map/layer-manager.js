export class LayerManager {
    constructor(map) {
        this.map = map;
        this.layers = {};
    }

    // Lấy dữ liệu gió dạng lưới (Grid) để vẽ hạt chuyển động
    async addWindLayer(lat, lng) {
        if (this.layers.wind) this.map.removeLayer(this.layers.wind);

        // Giả lập lưới dữ liệu gió (Open-Meteo không có API lưới 1 lần gọi, nên dùng dữ liệu mẫu hoặc gọi nhiều điểm)
        // Để demo mượt mà, chúng ta sẽ dùng dữ liệu giả lập xoay quanh tâm
        const gridData = this.generateMockWindGrid(lat, lng);
        
        this.layers.wind = L.velocityLayer({
            displayValues: true,
            displayOptions: {
                velocityType: "Gió",
                displayPosition: "bottomleft",
                displayEmptyString: "Không có dữ liệu gió"
            },
            data: gridData,
            maxVelocity: 25,
            colorScale: ["#3288bd", "#66c2a5", "#abdda4", "#e6f598", "#fee08b", "#fdae61", "#f46d43", "#d53e4f"]
        }).addTo(this.map);
    }

    generateMockWindGrid(centerLat, centerLng) {
        const u = [], v = [];
        const nx = 20, ny = 20; // Lưới 20x20
        const dx = 1, dy = 1; // Độ phân giải
        const la1 = centerLat + (ny * dy) / 2;
        const lo1 = centerLng - (nx * dx) / 2;

        // Tạo dữ liệu gió ngẫu nhiên nhưng có hướng (gió mùa Đông Bắc)
        for (let j = 0; j < ny; j++) {
            for (let i = 0; i < nx; i++) {
                // Giả lập hướng Đông Bắc
                u.push(-5 + Math.random() * 2); // Gió thổi từ Đông sang Tây
                v.push(-8 + Math.random() * 2); // Gió thổi từ Bắc xuống Nam
            }
        }

        return [{
            header: { parameterCategory: 2, parameterNumber: 2, refTime: new Date().toISOString() },
            data: u.concat(v), // Gộp mảng U và V
            la1: la1, lo1: lo1, la2: la1 - ny * dy, lo2: lo1 + nx * dx,
            nx: nx, ny: ny, dx: dx, dy: dy
        }];
    }

    toggleLayer(name, visible) {
        if (name === 'wind' && visible) return; // Wind được xử lý riêng
        if (this.layers[name]) {
            visible ? this.map.addLayer(this.layers[name]) : this.map.removeLayer(this.layers[name]);
        }
    }
}
