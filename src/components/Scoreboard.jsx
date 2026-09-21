import { useContext } from 'react';
import { GameContext } from '../context/GameContext';
import { Pause, Play, RotateCcw } from 'lucide-react';

export default function Scoreboard({ isPaused, onTogglePause, onRestart, hasStarted }) {
  const { player } = useContext(GameContext);

  return (
    <div className="pixel-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        {player.avatarUrl && (
          <img src={player.avatarUrl} alt="Avatar Pixel" className="animated-title" style={{ width: '48px', height: '48px', border: '2px solid #00e5ff', background: '#000' }} />
        )}
        <div style={{ fontSize: '0.55rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div>P1: <span style={{ color: '#00e5ff' }}>{player.name || 'Jugador 1'}</span></div>
          <div>P2/CPU: <span style={{ color: '#ff0055' }}>{player.gameMode === '2p' ? player.p2Name : 'CPU'}</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '1rem', color: '#ff0055', letterSpacing: '2px' }}>
          <span style={{ color: '#00e5ff' }}>{player.score}</span> : <span style={{ color: '#ff0055' }}>{player.cpuScore}</span>
        </div>

        <button 
          onClick={onTogglePause} 
          disabled={!hasStarted}
          className="pixel-btn" 
          style={{ padding: '0.5rem', opacity: hasStarted ? 1 : 0.4, cursor: hasStarted ? 'pointer' : 'not-allowed' }}
          title={hasStarted ? "Pausar / Reanudar (ESC)" : "Inicia la partida para pausar"}
        >
          {isPaused ? <Play size={16} /> : <Pause size={16} />}
        </button>

        <button onClick={onRestart} className="pixel-btn" style={{ padding: '0.5rem', background: '#00e5ff', color: '#000' }} title="Reiniciar Partida">
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}