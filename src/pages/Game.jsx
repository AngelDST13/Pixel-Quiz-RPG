import { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import Scoreboard from '../components/Scoreboard';
import GameBoard from '../components/GameBoard';

export default function Game() {
  const { dificultad } = useParams();
  const navigate = useNavigate();
  const { player, setPlayer } = useContext(GameContext);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleRestart = () => {
    setIsPaused(false);
    setHasStarted(false);
    setPlayer((prev) => ({ ...prev, score: 0, cpuScore: 0 }));
    window.location.reload();
  };

  const handleGameOver = (finalScore, cpuScore, result) => {
    const recordPayload = {
      id: Date.now().toString(),
      player: player.name || 'Héroe Anónimo',
      score: finalScore,
      cpuScore: cpuScore,
      difficulty: dificultad || 'facil',
      status: result === 'win' ? 'Victoria' : 'Derrota',
      date: new Date().toISOString().split('T')[0]
    };

    // 1. Guardado en json-server
    fetch('http://localhost:3001/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordPayload)
    }).catch((err) => console.error('Error db.json:', err));

    // 2. Envío al Webhook de n8n
    fetch('http://localhost:5678/webhook/pixel-quiz-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordPayload)
    }).catch((err) => console.log('n8n Webhook ausente:', err));

    setTimeout(() => navigate('/puntajes'), 3500);
  };

  return (
    <div style={{ maxWidth: '650px', margin: '1.5rem auto', padding: '0 1rem' }}>
      <Scoreboard
        isPaused={isPaused}
        onTogglePause={() => setIsPaused((prev) => !prev)}
        onRestart={handleRestart}
        hasStarted={hasStarted}
      />
      <GameBoard
        difficulty={dificultad || 'facil'}
        onGameOver={handleGameOver}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        hasStarted={hasStarted}
        setHasStarted={setHasStarted}
        onRestart={handleRestart}
      />
    </div>
  );
}