import React, { useState, useEffect } from 'react';
import './Fixtures.scss';
import Fixture from '../fixture/Fixture';
import Weather from '../weather/Weather';

function Fixtures(props) {
  const [fixtures, setFixtures] = useState([]);
  const [selectedFixture, setSelectedFixture] = useState(null);

  useEffect(() => {
    async function fetchFixtures() {
      // Set API endpoint and query parameters
      const apiUrl = 'https://'+process.env.REACT_APP_FOOTBALL_API_HOST+'/v3/fixtures';
      const apiHeaders = {
        'X-RapidAPI-Host': process.env.REACT_APP_FOOTBALL_API_HOST,
        'X-RapidAPI-Key': process.env.REACT_APP_FOOTBALL_API_KEY
      };

      const queryParams = `team=${props.selectedTeam.team.id}&next=5`;

      try {
        // Call API to retrieve list of fixtures
        const response = await fetch(`${apiUrl}?${queryParams}`, {
          headers: apiHeaders
        });
        const data = await response.json();

        console.log(data);

        // Extract list of fixtures from API response
        const fixtures = data.response;

        // Update the fixtures state with the retrieved data
        setFixtures(fixtures);
      } catch (error) {
        console.log(error);
        setFixtures([]);
      }
    }

    if (props.selectedTeam) {
      fetchFixtures();
    } else {
      setFixtures([]);
    }
  }, [props.selectedTeam]);

  function handleFixtureSelect(fixture) {
    setSelectedFixture(fixture);
  }

  return (
    <div className="fixtures">
      {props.selectedTeam && (
        <>
          <h2>click on any fixture below to show weather</h2>
          {fixtures && fixtures.length > 0 ? (
            <div className="fixtures-grid">
              {fixtures.map(fixture => (
                <Fixture key={fixture.fixture.id} fixture={fixture} onFixtureSelect={handleFixtureSelect} />
              ))}
            </div>
          ) : (
            <p>No fixtures found.</p>
          )}
          {selectedFixture && (
            <Weather
              lat={selectedFixture.fixture.venue.latitude}
              lon={selectedFixture.fixture.venue.longitude}
              apiKey="651a37dea3206fc70e1cd20bfb09c62e"
              onClose={() => setSelectedFixture(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Fixtures;
