import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export default function Scoreboard() {
  const { player } = useContext(GameContext);

  return (
    <div className="pixel-box" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      {player.avatarUrl && (
        <img src={player.avatarUrl} alt="Avatar Pixel" style={{ width: '50px', height: '50px', border: '2px solid #00e5ff', background: '#000' }} />
      )}
      <div style={{ fontSize: '0.6rem', lineHeight: '1.6' }}>
        <div>HÉROE: <span style={{ color: '#ffcc00' }}>{player.name || 'Invitado'}</span></div>
        <div>HP: <span style={{ color: player.hp > 30 ? '#00ff66' : '#ff0055' }}>{player.hp}/100</span></div>
        <div>XP: <span style={{ color: '#00e5ff' }}>{player.xp}</span></div>
        <div>NIVEL: {player.currentLevel}</div>
      </div>
    </div>
  );
}