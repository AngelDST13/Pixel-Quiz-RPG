import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export default function Scoreboard() {
  const { player } = useContext(GameContext);

  return (
    <div className="pixel-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        {player.avatarUrl && (
          <img src={player.avatarUrl} alt="Avatar Pixel" style={{ width: '45px', height: '45px', border: '2px solid #00e5ff', background: '#000' }} />
        )}
        <div style={{ fontSize: '0.65rem' }}>
          <div>JUGADOR: <span style={{ color: '#ffcc00' }}>{player.name || 'Invitado'}</span></div>
          <div>DIFICULTAD: <span style={{ color: '#00e5ff' }}>{player.difficulty.toUpperCase()}</span></div>
        </div>
      </div>

      <div style={{ fontSize: '1rem', color: '#ff0055', letterSpacing: '2px' }}>
        {player.score} : {player.cpuScore}
      </div>
    </div>
  );
}