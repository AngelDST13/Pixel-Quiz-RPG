import { useState } from 'react';
import { GameContext } from './GameContext';

export default function GameProvider({ children }) {
  const [player, setPlayer] = useState({
    name: '',
    p2Name: 'Jugador 2',
    avatarUrl: '',
    score: 0,
    cpuScore: 0,
    difficulty: 'facil',
    gameMode: '1p'
  });

  const resetGame = (playerName, difficulty = 'facil', mode = '1p', secondPlayerName = 'Jugador 2') => {
    const avatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(playerName || 'PongHero')}`;
    setPlayer({
      name: playerName || 'Jugador 1',
      p2Name: secondPlayerName || 'Jugador 2',
      avatarUrl: avatar,
      score: 0,
      cpuScore: 0,
      difficulty,
      gameMode: mode
    });
  };

  const updateScore = (playerPoints, cpuPoints) => {
    setPlayer((prev) => ({
      ...prev,
      score: prev.score + playerPoints,
      cpuScore: prev.cpuScore + cpuPoints
    }));
  };

  return (
    <GameContext.Provider value={{ player, setPlayer, resetGame, updateScore }}>
      {children}
    </GameContext.Provider>
  );
}