import { MapEngine } from './map/map-engine.js';
import { LayerManager } from './map/layer-manager.js';
import { ForecastEngine } from './forecast/forecast-engine.js';
import { StormTracker } from './storms/storm-tracker.js';
import { AlertManager } from './alerts/alert-manager.js';
import { WeatherPanel } from './dashboard/weather-panel.js';
import { CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const mapEngine = new MapEngine('map', CONFIG.DEFAULT_LOCATION, CONFIG.DEFAULT_ZOOM);
    const layerManager = new LayerManager(mapEngine.map);
    const forecastEngine = new ForecastEngine();
    const stormTracker = new StormTracker();
    const alertManager = new AlertManager();
    const weatherPanel = new WeatherPanel();

    // Tải dữ liệu mặc định
    await forecastEngine.loadForecast(CONFIG.DEFAULT_LOCATION.lat, CONFIG.DEFAULT_LOCATION.lng);
    weatherPanel.render(forecastEngine.getCurrentForecast());

    // Storm tracker chạy nền
    stormTracker.fetchActiveStorms().then(storms => {
        if (storms.length) layerManager.addStormLayer(storms);
    });

    // Xử lý tìm kiếm
    document.getElementById('search-btn').addEventListener('click', async () => {
        const query = document.getElementById('search-input').value;
        if (!query) return;
        const loc = await forecastEngine.geocode(query);
        if (loc) {
            mapEngine.setView(loc.lat, loc.lng, 8);
            await forecastEngine.loadForecast(loc.lat, loc.lng);
            weatherPanel.render(forecastEngine.getCurrentForecast());
        }
    });

    // Toggle layers
    document.getElementById('toggle-wind').addEventListener('change', (e) => {
        layerManager.toggleLayer('wind', e.target.checked);
    });
});
