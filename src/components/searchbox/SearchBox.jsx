import React, { useState } from 'react';
import './SearchBox.scss';

function SearchBox(props) {
  const [searchTerm, setSearchTerm] = useState('');

  function handleInputChange(event) {
    setSearchTerm(event.target.value);
  }

  async function handleSearch() {
    // Set API endpoint and query parameters
    const apiUrl = 'https://api-football-beta.p.rapidapi.com/teams';
    const apiHeaders = {
      'X-RapidAPI-Host': 'api-football-beta.p.rapidapi.com',
      'X-RapidAPI-Key': 'f2aedf2b85msh4b5764021d9e69fp1d6d18jsn3369b176cba2'
    };
    const queryParams = `name=${searchTerm}`;

    try {
      // Call API to retrieve list of teams
      const response = await fetch(`${apiUrl}?${queryParams}`, {
        headers: apiHeaders
      });
      const data = await response.json();

      // Extract list of teams from API response
      const teams = data.response;

      // Pass list of teams to parent component
      props.onSearch(teams);
    } catch (error) {
      console.log(error);
    }
  }

  function handleTeamSelect(team) {
    props.onTeamSelect(team);
  }

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Enter team name"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>
      {props.selectedTeam && (
        <div className="search-result" onClick={() => handleTeamSelect(props.selectedTeam)}>
          <img src={props.selectedTeam.team.logo} alt={props.selectedTeam.team.name} />
          <h2>{props.selectedTeam.team.name}</h2>
        </div>
      )}
    </div>
  );
}

export default SearchBox;
