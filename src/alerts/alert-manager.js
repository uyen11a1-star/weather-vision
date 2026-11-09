export class AlertManager {
    checkAlerts(weatherData) {
        // Logic cảnh báo demo: gió mạnh > 50 km/h
        const wind = weatherData.current_weather?.windspeed;
        if (wind > 50) return [`Cảnh báo gió mạnh: ${wind} km/h`];
        return [];
    }
}
