// components/ClockHero.jsx
import { useState, useEffect, useRef } from 'react';
import { Sunrise, Sunset, ThermometerSun } from 'lucide-react';
import moment from 'moment-timezone';

import { MapProvider , World} from '@yanikemmenegger/react-world-map';
// import World from '@yanikemmenegger/react-world-map';



import './ClockHero.css';
import { useAppContext } from '../../context/AppContext.jsx';
import { useScroll, useTransform, motion } from 'framer-motion';

const ClockHero = ({isAtHero}) => {
  const {
    weatherData,
    tempUnits,
    worldClocks,
    selectedWorldClock,
    handleSelectWorldClock,
    defaultLocation,
    setDefaultLocation,
    removeWorldClock,
    addWorldClock,
  } = useAppContext();

  // State for current time
  const [currentTime, setCurrentTime] = useState(moment());

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Determine the timezone of the searched/focused location
  const timezone = selectedWorldClock?.timezone || moment.tz.guess();

  // Format time and date
  const time = currentTime.tz(timezone).format('HH:mm:ss');
  const date = currentTime.tz(timezone).format('dddd, MMMM D, YYYY');

  // Sunrise and sunset
  const sunrise = weatherData?.sys?.sunrise
    ? moment.unix(weatherData.sys.sunrise).tz(timezone).format('HH:mm')
    : '--:--';
  const sunset = weatherData?.sys?.sunset
    ? moment.unix(weatherData.sys.sunset).tz(timezone).format('HH:mm')
    : '--:--';

  // Check if the searched location's timezone matches any world clock
  const searchedTimezone = weatherData?.timezone
    ? moment.tz.zone(moment.tz.guess()).name
    : selectedWorldClock?.timezone;
  const isInWorldClocks = worldClocks.some(clock => clock.timezone === searchedTimezone);

  // Determine if current location is default
  const isDefault = defaultLocation
    ? weatherData?.coord?.lat === defaultLocation.lat && weatherData?.coord?.lon === defaultLocation.lon
    : false;

  return (
    <>
      <div className={`clock-hero__map-container ${!isAtHero ? 'atHero' : ''}`}>
            <MapProvider
              initialFillColors={{ US: 'red', JP: 'red', ZA: 'green' }}
              defaultFillColor="#cccccc"
              defaultFillType="color"
            >
              <World controls={false} className="world-map" />
            </MapProvider>
          </div>
      <div  className="clock-hero__content">            
          

        <p className="clock-hero__location">
          Time in <span>
            {weatherData?.name || defaultLocation?.cityName || selectedWorldClock?.cityName}
          </span>
          , {defaultLocation?.country || selectedWorldClock?.country} currently
        </p>
        <h2 className="clock-hero__time">{time}</h2>   

        <p className="clock-hero__date">{date}</p>
        <div className="clock-hero__info-row">
          <span><Sunrise size={18} /> {sunrise}</span>
          <span><Sunset size={18} /> {sunset}</span>
          <span><ThermometerSun size={18} /> {weatherData?.main?.temp !== undefined ? `${Math.round(weatherData.main.temp)}°${tempUnits === 'metric' ? 'C' : 'F'}` : '--'}</span>
          {/* Default location logic */}
          {defaultLocation &&
            weatherData?.coord?.lat === defaultLocation.lat &&
            weatherData?.coord?.lon === defaultLocation.lon ? (
              <span className="clock-hero__default-label">Default Location</span>
            ) : (
              <button
                className="clock-hero__button"
                onClick={() => setDefaultLocation(weatherData?.coord)}
              >
                Set As Default
              </button>
            )
          }
          {/* World clock add/remove logic */}
          {!isInWorldClocks ? (
            <button className="clock-hero__button" onClick={() => addWorldClock({
              cityName: weatherData?.name,
              country: selectedWorldClock.country,
              timezone: searchedTimezone,
              lat: weatherData?.coord?.lat,
              lon: weatherData?.coord?.lon
            })}>
              Add To World Clocks
            </button>
          ) : (
            <button className="clock-hero__button" onClick={() => removeWorldClock(searchedTimezone)}>
              Remove From World Clocks
            </button>
          )}
        </div>
        {/* World Clocks Grid */}
        <div className="world-clock-grid">
          {worldClocks.map(clock => {
            const now = moment().tz(clock.timezone);
            return (
              <button
                key={clock.cityName}
                className={`world-clock-column${selectedWorldClock.cityName === clock.cityName ? " selected" : ""}`}
                onClick={() => handleSelectWorldClock(clock)}
                tabIndex={0}
              >
                <div className="world-clock-city">{clock.cityName}</div>
                <div className="world-clock-time">{now.format("HH:mm")}</div>
              </button>
            );
          })}
        </div>

       

      </div>
    </>
   
  );
};

export default ClockHero;
