import { CONFIG } from '../config.js';

export class ForecastEngine {
    constructor() { this.current = null; }

    async loadForecast(lat, lng) {
        const params = new URLSearchParams({
            latitude: lat, longitude: lng,
            current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
            hourly: 'temperature_2m,precipitation_probability,weather_code',
            timezone: 'auto'
        });
        const res = await fetch(`${CONFIG.OPEN_METEO_BASE}?${params}`);
        const data = await res.json();
        this.current = data;
        return data;
    }

    async geocode(query) {
        const res = await fetch(`${CONFIG.GEOCODING_BASE}?name=${encodeURIComponent(query)}&count=1&language=vi`);
        const data = await res.json();
        if (data.results && data.results.length) {
            return { 
                lat: data.results[0].latitude, 
                lng: data.results[0].longitude, 
                name: data.results[0].name 
            };
        }
        return null;
    }

    getCurrentForecast() { return this.current; }

    // Chuyển mã thời tiết WMO sang Tiếng Việt + Icon
    static getWeatherInfo(code) {
        const map = {
            0: { text: 'Trời quang', icon: '☀️' },
            1: { text: 'Ít mây', icon: '🌤️' },
            2: { text: 'Có mây', icon: '⛅' },
            3: { text: 'Nhiều mây', icon: '☁️' },
            45: { text: 'Sương mù', icon: '🌫️' },
            48: { text: 'Sương mù đóng băng', icon: '🌫️' },
            51: { text: 'Mưa phùn nhẹ', icon: '🌦️' },
            61: { text: 'Mưa nhỏ', icon: '🌧️' },
            63: { text: 'Mưa vừa', icon: '🌧️' },
            65: { text: 'Mưa to', icon: '🌧️' },
            80: { text: 'Mưa rào nhẹ', icon: '🌦️' },
            81: { text: 'Mưa rào vừa', icon: '🌧️' },
            82: { text: 'Mưa rào rất to', icon: '⛈️' },
            95: { text: 'Dông bão', icon: '⛈️' },
            96: { text: 'Dông bão kèm mưa đá', icon: '⛈️' }
        };
        return map[code] || { text: 'Không xác định', icon: '❓' };
    }

    // Chuyển hướng gió (độ) sang hướng (Bắc, Đông, Nam, Tây)
    static getWindDirection(deg) {
        const dirs = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
        return dirs[Math.round(deg / 45) % 8];
    }
}
