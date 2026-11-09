export const CONFIG = {
    OPEN_METEO_BASE: 'https://api.open-meteo.com/v1/forecast',
    GEOCODING_BASE: 'https://geocoding-api.open-meteo.com/v1/search',
    NHC_STORMS_URL: 'https://www.nhc.noaa.gov/CurrentStorms.json',
    DEFAULT_LOCATION: { lat: 21.0285, lng: 105.8542 }, // Hà Nội
    DEFAULT_ZOOM: 6,
    WIND_LAYER_URL: 'https://api.open-meteo.com/v1/forecast?latitude=21&longitude=105&hourly=wind_speed_10m,wind_direction_10m&forecast_days=1'
};
