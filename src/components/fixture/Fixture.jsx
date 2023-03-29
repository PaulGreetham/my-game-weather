import React from 'react';
import './Fixture.scss';

function Fixture(props) {
  const { fixture, onFixtureSelect } = props;
  const homeTeam = fixture.homeTeam || {};
  const awayTeam = fixture.awayTeam || {};

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
        <div className="fixture-date">{fixture.date}</div>
        <div className="fixture-status">{fixture.status?.short || 'N/A'}</div>
      </div>
    </div>
  );
}

export default Fixture;
