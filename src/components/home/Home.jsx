import React, { useState } from 'react';
import './Home.scss';
import SearchBox from '../searchbox/SearchBox';
import Fixtures from '../fixtures/Fixtures';

function Home() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  async function handleTeamSelect(team) {
    try {
      const apiUrl = `https://${process.env.REACT_APP_FOOTBALL_API_HOST}/fixtures?team=${team.team.id}&next=5`;
      const apiHeaders = {
        'X-RapidAPI-Host': process.env.REACT_APP_FOOTBALL_API_HOST,
        'X-RapidAPI-Key': process.env.REACT_APP_FOOTBALL_API_KEY
      };

      const response = await fetch(apiUrl, {
        headers: apiHeaders
      });
      const data = await response.json();

      setSelectedTeam({ ...team, fixtures: data.response });
    } catch (error) {
      console.log(error);
    }
  }

  function handleSearchResults(filteredTeams) {
    setTeams(filteredTeams);
    setSelectedTeam(null);
  }

  return (
    <div className="Home">
      <SearchBox onSearch={handleSearchResults} onTeamSelect={handleTeamSelect} />
      {selectedTeam && (
        <>
          <div className="team-selection">
            <div className="selected-team">
              <img src={selectedTeam.team.logo} alt={selectedTeam.team.name} />
              <h2>{selectedTeam.team.name}</h2>
            </div>
            <Fixtures selectedTeam={selectedTeam} />
          </div>
        </>
      )}
      {teams?.length > 0 && !selectedTeam && (
        <div className="team-list">
          {teams.map(team => (
            <div key={team.team.id} className="team" onClick={() => handleTeamSelect(team)}>
              <img src={team.team.logo} alt={team.team.name} />
              <h2>{team.team.name}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
