import React, { useState, useEffect } from 'react';

function Weather(props) {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    async function fetchWeather() {
      // Extract the venue details from the fixture data
      const venue = props.fixture.fixture.venue;

      // Set API endpoint and query parameters
      const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
      const apiKey = '651a37dea3206fc70e1cd20bfb09c62e';
      const queryParams = `lat=${venue.lat}&lon=${venue.lng}&appid=${apiKey}&units=metric`;

      try {
        // Call API to retrieve weather data for the venue
        const response = await fetch(`${apiUrl}?${queryParams}`);
        const data = await response.json();

        // Update the weatherData state with the retrieved data
        setWeatherData(data);
      } catch (error) {
        console.log(error);
      }
    }

    if (props.fixture) {
      fetchWeather();
    } else {
      setWeatherData(null);
    }
  }, [props.fixture]);

  return (
    <div>
      {weatherData ? (
        <>
          <h2>Weather Report for {props.fixture.fixture.venue.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </>
      ) : (
        <p>No weather data available.</p>
      )}
    </div>
  );
}

export default Weather;
