import React, { useState } from 'react';
import './Fixture.scss';
import Weather from '../weather/Weather';


function Fixture(props) {
  const { fixture, onFixtureSelect } = props;
  const homeTeam = fixture.teams.home || {};
  const awayTeam = fixture.teams.away || {};

  const fixtureDate = new Date(fixture.fixture.date);
  const fixtureDateString = fixtureDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const fixtureTimeString = fixtureDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' });

  const [showWeather, setShowWeather] = useState(false);
  const [geoData, setGeoData] = useState(null);
  const [geoError, setGeoError] = useState(null);

  async function handleWeatherClick() {
    const venueName = fixture.fixture.venue?.name;
    if (!venueName) {
      return;
    }

    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(venueName)}&limit=1&appid=${apiKey}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setGeoData({ lat, lon });
        setShowWeather(true);
      } else {
        setGeoData(null);
        setGeoError(`No geocoding results found for '${venueName}'`);
      }
    } catch (error) {
      setGeoData(null);
      setGeoError(error.message);
    }
  }

  return (
    <div className="fixture-card" onClick={() => onFixtureSelect(fixture)}>
      <div className="team-logo">
        <img src={homeTeam.logo} alt={homeTeam.name} />
        <img src={awayTeam.logo} alt={awayTeam.name} />
      </div>
      <div className="team-names">
        <div className="team-name">{homeTeam.name || 'N/A'}</div>
        <div className="vs">v</div>
        <div className="team-name">{awayTeam.name || 'N/A'}</div>
      </div>
      <div className="fixture-details">
        <div className="fixture-date">{fixtureDateString}</div>
        <div className="fixture-time">{fixtureTimeString}</div>
        <div className="fixture-venue">{fixture.fixture.venue?.name || 'N/A'}</div>
        <div className="fixture-competition">{fixture.league?.name || 'N/A'}</div>
        <div className="fixture-weather">
          <button className="weather-button" onClick={handleWeatherClick}>Show Weather</button>
          {showWeather && geoData && <Weather lat={geoData.lat} lon={geoData.lon} date={fixtureDate} apiKey={process.env.REACT_APP_OPENWEATHER_API_KEY} />}
          {geoError && <div className="error">{geoError}</div>}
        </div>
      </div>
    </div>
  );
}

export default Fixture;
