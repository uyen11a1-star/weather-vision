import { MapEngine } from './map/map-engine.js';
import { ForecastEngine } from './forecast/forecast-engine.js';
import { WeatherPanel } from './dashboard/weather-panel.js';
import { WindRenderer } from './visualization/wind-renderer.js';
import { RainRenderer } from './visualization/rain-renderer.js';
import { CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const mapEngine = new MapEngine('map', CONFIG.DEFAULT_LOCATION, CONFIG.DEFAULT_ZOOM);
    const forecastEngine = new ForecastEngine();
    const weatherPanel = new WeatherPanel();

    // Khởi tạo các Engine vẽ Canvas tự chế
    const windRenderer = new WindRenderer(mapEngine.map);
    const rainRenderer = new RainRenderer(mapEngine.map);

    // Tải dữ liệu mặc định (Hà Nội)
    let currentLocation = CONFIG.DEFAULT_LOCATION;
    let currentForecast = await forecastEngine.loadForecast(currentLocation.lat, currentLocation.lng);
    weatherPanel.render(currentForecast, currentLocation.name);
    
    // Bật gió mặc định
    windRenderer.start();

    // Xử lý sự kiện Tìm kiếm
    document.getElementById('search-btn').addEventListener('click', handleSearch);
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    async function handleSearch() {
        const query = document.getElementById('search-input').value;
        if (!query) return;
        
        document.getElementById('search-input').value = 'Đang tìm...';
        const loc = await forecastEngine.geocode(query);
        document.getElementById('search-input').value = query;

        if (loc) {
            currentLocation = loc;
            mapEngine.setView(loc.lat, loc.lng, 7);
            
            currentForecast = await forecastEngine.loadForecast(loc.lat, loc.lng);
            weatherPanel.render(currentForecast, loc.name);
        } else {
            alert('Không tìm thấy địa điểm này!');
        }
    }

    // Xử lý Toggles (Bật/tắt lớp Canvas)
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const layerName = e.target.dataset.layer;
            const isActive = e.target.classList.contains('active');
            e.target.classList.toggle('active');

            if (layerName === 'wind') {
                isActive ? windRenderer.stop() : windRenderer.start();
            } else if (layerName === 'rain') {
                isActive ? rainRenderer.stop() : rainRenderer.start();
            } else if (layerName === 'clouds') {
                alert('Lớp Mây đang được phát triển (sẽ dùng Canvas vẽ mây mù)!');
            }
        });
    });

    // Timeline (Demo)
    const slider = document.getElementById('time-slider');
    const hourDisplay = document.getElementById('hour-display');
    slider.addEventListener('input', (e) => {
        const hour = parseInt(e.target.value);
        hourDisplay.textContent = hour === 0 ? 'Bây giờ' : `${hour}:00`;
    });
});
