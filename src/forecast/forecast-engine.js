import { CONFIG } from '../config.js';
export class ForecastEngine {
    constructor() { this.current = null; }
    async loadForecast(lat, lng) {
        const params = new URLSearchParams({
            latitude: lat, longitude: lng,
            current_weather: 'true',
            hourly: 'temperature_2m,precipitation_probability,weather_code,wind_speed_10m,wind_direction_10m',
            timezone: 'auto'
        });
        const res = await fetch(`${CONFIG.OPEN_METEO_BASE}?${params}`);
        const data = await res.json();
        this.current = data;
        return data;
    }
    async geocode(query) {
        const res = await fetch(`${CONFIG.GEOCODING_BASE}?name=${encodeURIComponent(query)}&count=1`);
        const data = await res.json();
        if (data.results && data.results.length) {
            return { lat: data.results[0].latitude, lng: data.results[0].longitude, name: data.results[0].name };
        }
        return null;
    }
    getCurrentForecast() { return this.current; }
}
