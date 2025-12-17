import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import Lobby from './pages/Lobby';
import GameArena from './pages/GameArena';

// Main content component that uses game context
const AppContent = () => {
  const { gameState } = useGame();

  // Route based on game state
  if (gameState.status === 'playing' || gameState.status === 'finished') {
    return <GameArena />;
  }

  return <Lobby />;
};

// App wrapper with provider
const App = () => {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
};

export default App;