import React from 'react';
import './Fixture.scss';

function Fixture(props) {
  const { fixture, onFixtureSelect } = props;
  const homeTeam = fixture.teams.home || {};
  const awayTeam = fixture.teams.away || {};

  const fixtureDate = new Date(fixture.fixture.date);
  const fixtureDateString = fixtureDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const fixtureTimeString = fixtureDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' });

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
      </div>
    </div>
  );
}

export default Fixture;
