import React from 'react';
import './Fixture.scss';

function Fixture(props) {
  const { fixture, onFixtureSelect } = props;
  const homeTeam = fixture.teams.home || {}; // changed from fixture.homeTeam to fixture.teams.home
  const awayTeam = fixture.teams.away || {}; // changed from fixture.awayTeam to fixture.teams.away

  return (
    <div className="fixture-card" onClick={() => onFixtureSelect(fixture)}>
      <div className="team-logo">
        <img src={homeTeam.logo} alt={homeTeam.name} />
        <img src={awayTeam.logo} alt={awayTeam.name} />
      </div>
      <div className="team-names">
        <span>{homeTeam.name || 'N/A'}</span>
        <span>{awayTeam.name || 'N/A'}</span>
      </div>
      <div className="fixture-details">
        <div className="fixture-date">{fixture.fixture.date}</div> {/* Added fixture prefix */}
        <div className="fixture-status">{fixture.fixture.status?.short || 'N/A'}</div> {/* Added fixture prefix */}
        <div className="fixture-venue">{fixture.fixture.venue?.name || 'N/A'}</div> {/* Added fixture prefix */}
        <div className="fixture-competition">{fixture.league?.name || 'N/A'}</div> {/* Replaced fixture.competition with league */}
      </div>
    </div>
  );
}

export default Fixture;
