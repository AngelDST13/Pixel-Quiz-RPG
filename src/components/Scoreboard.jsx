import { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { Pause, Play } from 'lucide-react';

export default function Scoreboard({ isPaused, onTogglePause }) {
  const { player } = useContext(GameContext);

  return (
    <div className="pixel-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {player.avatarUrl && (
          <img src={player.avatarUrl} alt="Avatar Pixel" style={{ width: '48px', height: '48px', border: '2px solid #00e5ff', background: '#000' }} />
        )}
        <div style={{ fontSize: '0.55rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div>JUGADOR: <span style={{ color: '#ffcc00' }}>{player.name || 'Invitado'}</span></div>
          <div>DIFICULTAD: <span style={{ color: '#00e5ff' }}>{player.difficulty ? player.difficulty.toUpperCase() : 'FÁCIL'}</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ fontSize: '1.1rem', color: '#ff0055', letterSpacing: '3px' }}>
          {player.score} : {player.cpuScore}
        </div>

        <button 
          onClick={onTogglePause} 
          className="pixel-btn" 
          style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Pausar / Reanudar (ESC)"
        >
          {isPaused ? <Play size={16} color="#fff" /> : <Pause size={16} color="#fff" />}
        </button>
      </div>
    </div>
  );
}