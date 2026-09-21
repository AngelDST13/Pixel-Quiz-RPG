import { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import Scoreboard from '../components/Scoreboard';
import GameBoard from '../components/GameBoard';

export default function Game() {
  const { dificultad } = useParams();
  const navigate = useNavigate();
  const { player } = useContext(GameContext);
  const [isPaused, setIsPaused] = useState(false);

  const handleGameOver = (finalScore, cpuScore) => {
    const recordPayload = {
      id: Date.now().toString(),
      player: player.name || 'Héroe Anónimo',
      score: finalScore,
      cpuScore: cpuScore,
      difficulty: dificultad || 'facil',
      date: new Date().toISOString().split('T')[0]
    };

    fetch('http://localhost:3001/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordPayload)
    }).catch((err) => console.error('Error db.json:', err));

    fetch('http://localhost:5678/webhook/pixel-quiz-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordPayload)
    }).catch((err) => console.log('n8n Webhook ausente:', err));

    navigate('/puntajes');
  };

  return (
    <div style={{ maxWidth: '650px', margin: '1.5rem auto', padding: '0 1rem' }}>
      <Scoreboard isPaused={isPaused} onTogglePause={() => setIsPaused((prev) => !prev)} />
      <GameBoard
        difficulty={dificultad || 'facil'}
        onGameOver={handleGameOver}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
      />
    </div>
  );
}