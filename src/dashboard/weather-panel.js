import { ForecastEngine } from '../forecast/forecast-engine.js';

export class WeatherPanel {
    render(forecast, locationName) {
        if (!forecast || !forecast.current) return;
        
        const cw = forecast.current;
        const info = ForecastEngine.getWeatherInfo(cw.weather_code);
        const windDir = ForecastEngine.getWindDirection(cw.wind_direction_10m);

        document.getElementById('location-name').textContent = locationName || 'Vị trí hiện tại';
        document.getElementById('location-coords').textContent = `${forecast.latitude.toFixed(2)}°N, ${forecast.longitude.toFixed(2)}°E`;
        
        document.getElementById('current-temp').textContent = Math.round(cw.temperature_2m);
        document.getElementById('weather-icon').textContent = info.icon;
        document.getElementById('weather-text').textContent = info.text;
        
        document.getElementById('wind-speed').textContent = `${cw.wind_speed_10m} km/h`;
        document.getElementById('wind-dir').textContent = windDir;
        document.getElementById('humidity').textContent = `${cw.relative_humidity_2m}%`;
        document.getElementById('precipitation').textContent = `${cw.precipitation} mm`;
    }
}
