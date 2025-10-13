import React from 'react'
import './WeatherCardMini.css'
import weatherIcons from '../../constants.js'
import { EllipsisVertical } from 'lucide-react';

const WeatherCardMini = ({ name, weather, onRemove, onSelect }) => {
    const handleMenuClick = (e) => {
        e.stopPropagation(); // Prevent card click when clicking menu
        if (window.confirm(`Are you sure you want to remove ${name}?`)) {
            onRemove(name);
        }
    };

    return (
        <div className="cardm" onClick={() => onSelect(name)}>
            <div className="card__icon">
                {weather?.weather?.[0]?.icon ? weatherIcons[weather.weather[0].icon] : '⛅'}
            </div>
            <div className="card__details">
                <h3>{name}</h3>
                <p>{weather?.main?.temp ? `${Math.round(weather.main.temp)}°C` : '--'}</p>
            </div>
            <div className="card__menu">
                <button onClick={handleMenuClick}><EllipsisVertical /></button>
            </div>
        </div>
    )
}

export default WeatherCardMini