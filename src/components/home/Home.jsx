import React, { useState } from 'react';
import './Home.scss';
import SearchBox from '../searchbox/SearchBox';
import Fixtures from '../fixtures/Fixtures';

function Home() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  async function handleTeamSelect(team) {
    try {
      const apiUrl = `https://api-football-beta.p.rapidapi.com/fixtures?team=${team.team.id}&next=5`;
      const apiHeaders = {
        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
        'X-RapidAPI-Key': '0fcfec633fmshe9a2a6a6fa1a43ap17e111jsn18636abb575d'
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
