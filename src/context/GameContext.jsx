import { createContext, useState } from 'react';

export const GameContext = createContext();

export default function GameProvider({ children }) {
  const [player, setPlayer] = useState({
    name: '',
    avatarUrl: '',
    hp: 100,
    xp: 0,
    currentLevel: 1
  });

  const resetGame = (playerName) => {
    // API Externa: Generación de Avatar Pixel Art automático basado en el nombre
    const avatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(playerName || 'Hero')}`;
    
    setPlayer({
      name: playerName || 'Héroe Anónimo',
      avatarUrl: avatar,
      hp: 100,
      xp: 0,
      currentLevel: 1
    });
  };

  const updateStats = (damage, gainedXp) => {
    setPlayer((prev) => ({
      ...prev,
      hp: Math.max(0, prev.hp - damage),
      xp: prev.xp + gainedXp
    }));
  };

  const nextLevel = () => {
    setPlayer((prev) => ({
      ...prev,
      currentLevel: prev.currentLevel + 1
    }));
  };

  return (
    <GameContext.Provider value={{ player, setPlayer, resetGame, updateStats, nextLevel }}>
      {children}
    </GameContext.Provider>
  );
}