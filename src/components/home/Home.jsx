import React, { useState } from 'react';
import './Home.scss';
import SearchBox from '../searchbox/SearchBox';
import Fixtures from '../fixtures/Fixtures';

function Home() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  function handleSearchResults(filteredTeams) {
    setTeams(filteredTeams);
    setSelectedTeam(null);
  }

  function handleTeamSelect(team) {
    setSelectedTeam(team);
  }

  return (
    <div className="Home">
      <SearchBox onSearch={handleSearchResults} onTeamSelect={handleTeamSelect} />
      <button onClick={() => handleSearchResults(teams)}>Search</button>
      {selectedTeam ? (
        <>
          <div className="team-selection">
            <div className="selected-team">
              <img src={selectedTeam.team.logo} alt={selectedTeam.team.name} />
              <h2>{selectedTeam.team.name}</h2>
            </div>
            <Fixtures selectedTeam={selectedTeam} />
          </div>
        </>
      ) : (
        <>
          {teams?.length > 0 ? (
            <div className="team-list">
              {teams.map(team => (
                <div key={team.team.id} className="team" onClick={() => handleTeamSelect(team)}>
                  <img src={team.team.logo} alt={team.team.name} />
                  <h2>{team.team.name}</h2>
                </div>
              ))}
            </div>
          ) : (
            <p>No teams found.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
