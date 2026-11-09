import { MapEngine } from './map/map-engine.js';
import { LayerManager } from './map/layer-manager.js';
import { ForecastEngine } from './forecast/forecast-engine.js';
import { WeatherPanel } from './dashboard/weather-panel.js';
import { CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    const mapEngine = new MapEngine('map', CONFIG.DEFAULT_LOCATION, CONFIG.DEFAULT_ZOOM);
    const layerManager = new LayerManager(mapEngine.map);
    const forecastEngine = new ForecastEngine();
    const weatherPanel = new WeatherPanel();

    // Tải dữ liệu mặc định (Hà Nội)
    let currentLocation = CONFIG.DEFAULT_LOCATION;
    let currentForecast = await forecastEngine.loadForecast(currentLocation.lat, currentLocation.lng);
    weatherPanel.render(currentForecast, currentLocation.name);
    
    // Bật lớp gió mặc định
    await layerManager.addWindLayer(currentLocation.lat, currentLocation.lng);

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
            
            await layerManager.addWindLayer(loc.lat, loc.lng);
        } else {
            alert('Không tìm thấy địa điểm này!');
        }
    }

    // Xử lý Toggles (Bật/tắt lớp)
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const layerName = e.target.dataset.layer;
            const isActive = e.target.classList.contains('active');

            // Chỉ cho phép bật/tắt gió trong bản demo này để tránh nặng máy
            if (layerName === 'wind') {
                if (isActive) {
                    e.target.classList.remove('active');
                    if(layerManager.layers.wind) mapEngine.map.removeLayer(layerManager.layers.wind);
                } else {
                    e.target.classList.add('active');
                    await layerManager.addWindLayer(currentLocation.lat, currentLocation.lng);
                }
            } else {
                // Các lớp mưa/mây đang phát triển
                alert('Tính năng lớp ' + layerName + ' đang được cập nhật!');
            }
        });
    });

    // Xử lý thanh trượt thời gian (Timeline)
    const slider = document.getElementById('time-slider');
    const hourDisplay = document.getElementById('hour-display');
    
    slider.addEventListener('input', (e) => {
        const hour = parseInt(e.target.value);
        hourDisplay.textContent = hour === 0 ? 'Bây giờ' : `${hour}:00`;
        // Logic cập nhật bản đồ theo giờ có thể thêm vào đây
    });
});
