import React from "react";
import "./WeatherAlerts.css";

const WeatherAlerts = ({ currentWeather, forecastData }) => {
  if (!currentWeather || !forecastData) return null;

  const currentTemp = Math.round(currentWeather.main.temp);
  const currentDesc = currentWeather.weather[0].description;
  const currentWind = Math.round(currentWeather.wind.speed);
  const currentHumidity = currentWeather.main.humidity;

  const isSevereNow = {
    highTemp: currentTemp >= 35,
    lowTemp: currentTemp <= 0,
    highWind: currentWind >= 30,
    stormy: /storm|thunder|tornado|snow/i.test(currentDesc),
    humid: currentHumidity >= 90,
  };

  const hasAlertNow = Object.values(isSevereNow).some(Boolean);

  const currentAlert = (
    <div className="alert current-alert">
      <div className="alert-header">
        <span role="img" aria-label="current weather">🌤️</span>
        <h3>Current Weather</h3>
      </div>
      <div className="alert-content">
        <p className="alert-main">
          {currentDesc.charAt(0).toUpperCase() + currentDesc.slice(1)} with {currentTemp}°C
        </p>
        <div className="alert-details">
          {isSevereNow.highTemp && <span>🔥 High heat</span>}
          {isSevereNow.lowTemp && <span>❄️ Freezing</span>}
          {isSevereNow.highWind && <span>💨 Strong wind</span>}
          {isSevereNow.stormy && <span>⛈️ Stormy</span>}
          {isSevereNow.humid && <span>💧 High humidity</span>}
        </div>
      </div>
    </div>
  );

  // Forecast alerts for the next 3 days
  const now = new Date();
  const forecastAlerts = [];

  const groupedByDay = {};

  // Group forecast by date (per day)
  forecastData.list.forEach(entry => {
    const date = new Date(entry.dt * 1000);
    const dayKey = date.toISOString().split("T")[0];

    if (!groupedByDay[dayKey]) groupedByDay[dayKey] = [];
    groupedByDay[dayKey].push(entry);
  });

  const forecastDays = Object.entries(groupedByDay)
    .filter(([dayKey]) => {
      const dayDate = new Date(dayKey);
      const diff = (dayDate - now) / (1000 * 60 * 60 * 24);
      return diff > 0 && diff <= 3;
    })
    .slice(0, 3); // Max 3 days ahead

  forecastDays.forEach(([dayKey, entries]) => {
    const midday = entries[Math.floor(entries.length / 2)] || entries[0];
    const date = new Date(dayKey);
    const desc = midday.weather[0].description;
    const min = Math.min(...entries.map(e => e.main.temp_min));
    const max = Math.max(...entries.map(e => e.main.temp_max));

    const shouldAlert = max >= 35 || min <= 0 || /storm|thunder|tornado|snow/i.test(desc);

    if (shouldAlert) {
      forecastAlerts.push(
        <div className="alert tomorrow-alert" key={dayKey}>
          <div className="alert-header">
            <span role="img" aria-label="forecast">📅</span>
            <h3>{date.toLocaleDateString(undefined, { weekday: 'long' })}</h3>
          </div>
          <div className="alert-content">
            <p className="alert-main">
              {desc.charAt(0).toUpperCase() + desc.slice(1)} with temps from {Math.round(min)}°C to {Math.round(max)}°C
            </p>
            <div className="alert-details">
              {max >= 35 && <span>🔥 High heat</span>}
              {min <= 0 && <span>❄️ Cold alert</span>}
              {/storm|thunder|tornado|snow/i.test(desc) && <span>⛈️ Storm risk</span>}
            </div>
          </div>
        </div>
      );
    }
  });

  return (
    <div className="weather-alerts">
      {currentAlert}
      {forecastAlerts}
    </div>
  );
};

export default WeatherAlerts;
