import { useState } from 'react';
import { GameContext } from './GameContext';

export default function GameProvider({ children }) {
  const [player, setPlayer] = useState({
    name: '',
    avatarUrl: '',
    score: 0,
    cpuScore: 0,
    difficulty: 'facil'
  });

  const resetGame = (playerName, difficulty = 'facil') => {
    const avatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(playerName || 'PongHero')}`;
    setPlayer({
      name: playerName || 'Héroe Anónimo',
      avatarUrl: avatar,
      score: 0,
      cpuScore: 0,
      difficulty
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