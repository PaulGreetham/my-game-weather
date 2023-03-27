import React, { useState, useEffect } from 'react';
import './Fixtures.scss';
import Weather from '../weather/Weather';

function Fixtures(props) {
  const [fixtures, setFixtures] = useState([]);
  const [selectedFixture, setSelectedFixture] = useState(null);

  useEffect(() => {
    async function fetchFixtures() {
      // Set API endpoint and query parameters
      const apiUrl = 'https://api-football-beta.p.rapidapi.com/fixtures';
      const apiHeaders = {
        'X-RapidAPI-Host': 'api-football-beta.p.rapidapi.com',
        'X-RapidAPI-Key': 'f2aedf2b85msh4b5764021d9e69fp1d6d18jsn3369b176cba2'
      };
      const queryParams = `team=${props.selectedTeam.team.id}&next=5`;

      try {
        // Call API to retrieve list of fixtures
        const response = await fetch(`${apiUrl}?${queryParams}`, {
          headers: apiHeaders
        });
        const data = await response.json();

        // Extract list of fixtures from API response
        const fixtures = data.response;

        // Update the fixtures state with the retrieved data
        setFixtures(fixtures);
      } catch (error) {
        console.log(error);
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
      {props.selectedTeam ? (
        <>
          <h2>Upcoming fixtures for {props.selectedTeam.team.name}</h2>
          {fixtures.length > 0 ? (
            <ul>
              {fixtures.map(fixture => (
                <li key={fixture.fixture.id} onClick={() => handleFixtureSelect(fixture)}>
                  {fixture.fixture.date} - {fixture.fixture.status.short} - {fixture.teams.home.name} vs {fixture.teams.away.name}
                </li>
              ))}
            </ul>
          ) : (
            <p>No fixtures found.</p>
          )}
        </>
      ) : (
        <p>Please select a team to view fixtures.</p>
      )}
      {selectedFixture && (
        <Weather
          lat={selectedFixture.fixture.venue.coordinates.latitude}
          lon={selectedFixture.fixture.venue.coordinates.longitude}
          apiKey="651a37dea3206fc70e1cd20bfb09c62e"
          onClose={() => setSelectedFixture(null)}
        />
      )}
    </div>
  );
}

export default Fixtures;
