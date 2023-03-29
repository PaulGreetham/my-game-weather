import React, { useState, useEffect } from 'react';
import './Weather.scss';

function Weather(props) {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      const { lat, lon, date } = props;

      // Set API endpoint and query parameters
      const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&dt=${Math.floor(date.getTime() / 1000)}&appid=${props.apiKey}&units=metric`;

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

    if (props.lat && props.lon && props.date) {
      fetchWeather();
    }
  }, [props]);

  if (!weather) {
    return null;
  }

  const { icon, description } = weather.weather[0];

  return (
    <div className="weather">
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
