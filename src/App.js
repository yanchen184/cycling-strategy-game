import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './App.css';

// Import game components
import MainMenu from './components/MainMenu';
import CharacterSelection from './components/CharacterSelection';
import GameBoard from './components/GameBoard';
import GameOver from './components/GameOver';

// Import game states
import { GAME_STATES } from './utils/constants';

// Current version
const VERSION = 'v0.2.0';

function App() {
  // Track current game state
  const [gameState, setGameState] = useState(GAME_STATES.MAIN_MENU);
  
  // Game configuration
  const [gameConfig, setGameConfig] = useState({
    playerCount: 2,
    aiOpponent: false,
    trackType: 'standard'
  });
  
  // Function to handle game state transitions
  const handleStateChange = (newState, config = {}) => {
    setGameState(newState);
    if (Object.keys(config).length > 0) {
      setGameConfig({...gameConfig, ...config});
    }
  };
  
  // Render appropriate component based on game state
  const renderGameState = () => {
    switch (gameState) {
      case GAME_STATES.MAIN_MENU:
        return <MainMenu onStateChange={handleStateChange} />;
      
      case GAME_STATES.CHARACTER_SELECTION:
        return <CharacterSelection 
          onStateChange={handleStateChange}
          gameConfig={gameConfig}
        />;
      
      case GAME_STATES.GAME_BOARD:
        return <GameBoard 
          onStateChange={handleStateChange}
          gameConfig={gameConfig}
        />;
      
      case GAME_STATES.GAME_OVER:
        return <GameOver 
          onStateChange={handleStateChange}
          gameConfig={gameConfig}
        />;
      
      default:
        return <MainMenu onStateChange={handleStateChange} />;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>風馳電掣</h1>
        <div className="version-display">{VERSION}</div>
      </header>
      <main className="game-container">
        {renderGameState()}
      </main>
      <footer className="App-footer">
        <p>© 2025 風馳電掣</p>
      </footer>
    </div>
  );
}

export default App;