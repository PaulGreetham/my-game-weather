import React, { useState, useEffect } from 'react';
import './Weather.scss';

function Weather(props) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      const { venue, date, apiKey } = props;

      // Geocode venue to get latitude and longitude
      const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${venue}&limit=1&appid=${apiKey}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.length === 0) {
        console.log(`Unable to find coordinates for ${venue}`);
        return;
      }

      const { lat, lon } = geocodeData[0];

      // Set API endpoint and query parameters
      const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&dt=${Math.floor(date.getTime() / 1000)}&appid=${apiKey}&units=metric`;

      try {
        // Call API to retrieve weather data
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Extract relevant weather data from API response
        const weatherData = data.daily.find(day => day.dt === Math.floor(date.getTime() / 1000));
        setWeather(weatherData);
      } catch (error) {
        console.log(error);
      }
    }

    if (props.venue && props.date) {
      fetchWeather();
    }
  }, [props]);

  if (!weather) {
    return null;
  }

  const { icon, description } = weather.weather[0];

  return (
    <div className="fixture-weather" onClick={(e) => e.stopPropagation()}>
      <div className="weather-icon">
        <img src={`https://openweathermap.org/img/w/${icon}.png`} alt={description} />
      </div>
      <div className="weather-details">
        <h3>{description}</h3>
        <p>Temperature: {Math.round(weather.temp.day)}°C</p>
        <p>Humidity: {weather.humidity}%</p>
        <p>Wind speed: {weather.wind_speed} m/s</p>
      </div>
    </div>
  );
}

export default Weather;
