import { useState, useCallback } from "react";
import "./Header.css";

import { getCurrentDate } from "../../api/api.js";
import DarkModeToggle from "../Switches/DarkModeToggle.jsx";
import TemperatureToggle from "../Switches/TemperatureToggle.jsx";

import { Cloudy, Clock, Locate, LocateFixed, MapPin, Settings, Calendar } from 'lucide-react';
import CurrentLocationButton from "../CurrentLocationButton/CurrentLocationButton.jsx";
import { useAppContext } from "../../context/AppContext.jsx";

const Header = ({ 
  setTempUnits, 
  setShowTermsOfService,
  onCurrentLocation,
  isLoadingLocation,
  isAtHero
}) => {
  const [openSettings, setOpenSettings] = useState(false);
  const curDate = getCurrentDate();

  // Get location and temperature info from context
  const {
    currentLocation,
    defaultLocation,
    tempUnits,
    defaultLocationWeather,
    defaultLocationForecast
  } = useAppContext();

  // Determine which location to show
  const hasCurrentLocation = !!currentLocation;

  // Get temperature for the location (prefer currentLocation, fallback to defaultLocation)
  const temperature = defaultLocationWeather?.main?.temp !== undefined
    ? `${Math.round(defaultLocationWeather.main.temp)}°${tempUnits === "metric" ? "C" : "F"}`
    : "--";

  const handleTemperatureChange = useCallback((units) => {
    setTempUnits(units);
    setOpenSettings(false);
  }, [setTempUnits]);

  const toggleSettings = useCallback(() => {
    setOpenSettings(prev => !prev);
  }, []);

  const toggleTermsOfService = useCallback(() => {
    setShowTermsOfService(prev => !prev);
    setOpenSettings(false);
  }, [setShowTermsOfService]);

   const cleanCityName = (name) => {
    // Remove common suffixes
    return name
      .replace(/ Metropolitan Municipality$/i, '')
      .replace(/ Municipality$/i, '')
      .replace(/ District$/i, '')
      .replace(/ City$/i, '')
      .replace(/ Local Municipality$/i, '')
      .replace(/ County$/i, '')
      .trim();
  };

  return (
    <header className="header">
      <div className="header__brand">
        <h2 className="header__title"><Cloudy/> <span>Aurora</span>Cast </h2>
        {!isAtHero && (
          <span className="header__datetime">
            {hasCurrentLocation ? (
              <>
                <LocateFixed size={14} /> {cleanCityName(currentLocation.cityName)}
                {" "}
                <span className="header__temp">{temperature}</span>
              </>
            ) : defaultLocation ? (
              <>
                <MapPin size={14} /> {cleanCityName(defaultLocation.cityName)}
              </>
            ) : (
              <>
                <MapPin size={14} /> "No Location Set"
                {" "}
                <span className="header__temp">{temperature}</span>
              </>
            )}
            <br />
            
            <Calendar size={12} /> {curDate.day}
          </span>
        )}
      </div>

      <button 
        className="header__menu-button"
        onClick={toggleSettings}
        aria-label="Toggle menu"
      >
        <span className="header__menu-icon">☰</span>
      </button>

      <nav className={`header__nav ${openSettings ? 'header__nav--open' : ''}`}>
        <div className="header__controls">
          <CurrentLocationButton 
            onClick={onCurrentLocation} 
            loading={isLoadingLocation}
            hasCurrentLocation={hasCurrentLocation}
            temperature={temperature} // <-- Pass temperature as a prop
          />
          <DarkModeToggle />
          <button
            className="header__settings-button"
            onClick={toggleSettings}
            aria-label="Settings"
          >
            <Settings size="32" color="#ffff" />
            <span className="header__tooltip">Settings</span>
          </button>
        </div>
      </nav>

      <div className={`header__dropdown ${openSettings ? 'header__dropdown--open' : ''}`}>
        <TemperatureToggle onChange={handleTemperatureChange} />
        <button
          className="header__terms-button"
          onClick={toggleTermsOfService}
        >
          Terms of Service
        </button>
      </div>
    </header>
  );
};

export default Header;