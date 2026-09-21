import { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import Scoreboard from '../components/Scoreboard';
import GameBoard from '../components/GameBoard';

export default function Game() {
  const { dificultad } = useParams();
  const navigate = useNavigate();
  const { player } = useContext(GameContext);

  const handleGameOver = (finalScore, cpuScore) => {
    const recordPayload = {
      id: Date.now().toString(),
      player: player.name || 'Héroe Anónimo',
      score: finalScore,
      cpuScore: cpuScore,
      difficulty: dificultad || 'facil',
      date: new Date().toISOString().split('T')[0]
    };

    // GET/POST al backend local json-server
    fetch('http://localhost:3001/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordPayload)
    }).catch((err) => console.error('Error db.json:', err));

    // Webhook POST a n8n
    fetch('http://localhost:5678/webhook/pixel-quiz-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recordPayload)
    }).catch((err) => console.log('n8n Webhook ausente:', err));

    navigate('/puntajes');
  };

  return (
    <div style={{ maxWidth: '650px', margin: '1.5rem auto', padding: '0 1rem' }}>
      <Scoreboard />
      <GameBoard difficulty={dificultad || 'facil'} onGameOver={handleGameOver} />
    </div>
  );
}