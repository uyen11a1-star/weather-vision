export const CONFIG = {
    OPEN_METEO_BASE: 'https://api.open-meteo.com/v1/forecast',
    GEOCODING_BASE: 'https://geocoding-api.open-meteo.com/v1/search',
    DEFAULT_LOCATION: { lat: 21.0285, lng: 105.8542, name: 'Hà Nội' }, // Mặc định Hà Nội
    DEFAULT_ZOOM: 5,
    // API lấy dữ liệu gió cho lớp Velocity (grid)
    WIND_LAYER_URL: 'https://api.open-meteo.com/v1/forecast'
};
