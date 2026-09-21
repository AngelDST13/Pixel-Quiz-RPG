import { createContext, useState } from 'react';

const GameContext = createContext();

function GameProvider({ children }) {
  const [player, setPlayer] = useState({
    name: '',
    hp: 100,
    xp: 0,
    currentLevel: 1
  });

  const resetGame = (playerName) => {
    setPlayer({
      name: playerName || player.name,
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

export { GameContext, GameProvider };
export default GameProvider;