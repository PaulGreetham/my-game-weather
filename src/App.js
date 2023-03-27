import React from 'react';
import './App.scss';
import Home from './components/home/Home';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>My Game Weather</h1>
      </header>
      <main>
        <Home />
      </main>
    </div>
  );
}

export default App;
