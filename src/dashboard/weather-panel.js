export class WeatherPanel {
    render(forecast) {
        const el = document.getElementById('forecast-panel');
        if (!forecast || !forecast.current_weather) { el.innerHTML = 'Không có dữ liệu'; return; }
        const cw = forecast.current_weather;
        el.innerHTML = `
            <h3>Thời tiết hiện tại</h3>
            <p>Nhiệt độ: ${cw.temperature}°C</p>
            <p>Gió: ${cw.windspeed} km/h (${cw.winddirection}°)</p>
            <p>Mã thời tiết: ${cw.weathercode}</p>
        `;
    }
}
