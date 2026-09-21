import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

function Scoreboard() {
  const { player } = useContext(GameContext);

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '0.8rem', background: '#16213e', color: '#fff', borderRadius: '8px' }}>
      <div><strong>Héroe:</strong> {player.name || 'Invitado'}</div>
      <div><strong>Salud (HP):</strong> {player.hp} / 100</div>
      <div><strong>Experiencia (XP):</strong> {player.xp}</div>
      <div><strong>Nivel:</strong> {player.currentLevel}</div>
    </div>
  );
}

export default Scoreboard;