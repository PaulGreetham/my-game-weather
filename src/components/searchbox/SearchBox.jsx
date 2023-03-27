import React, { useState } from 'react';
import './SearchBox.scss';

function SearchBox(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
      setSearchResults(teams);
    } catch (error) {
      console.log(error);
    }
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
      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map(team => (
            <div
              key={team.team.id}
              className="search-result"
              onClick={() => {
                setSearchTerm(team.team.name);
                setSearchResults([]);
                props.onTeamSelect(team);
              }}
            >
              <img src={team.team.logo} alt={team.team.name} />
              <h2>{team.team.name}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBox
