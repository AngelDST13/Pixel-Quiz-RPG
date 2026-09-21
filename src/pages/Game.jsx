import { useEffect, useState, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import Scoreboard from '../components/Scoreboard';
import Card from '../components/Card';
import LoadingErrorState from '../components/LoadingErrorState';

export default function Game() {
  const { nivel } = useParams();
  const navigate = useNavigate();
  const { player, updateStats, nextLevel } = useContext(GameContext);

  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const finishGame = useCallback(() => {
    const finalData = {
      id: Date.now().toString(),
      name: player.name || 'Héroe Anónimo',
      xp: player.xp,
      lives: player.hp,
      date: new Date().toISOString().split('T')[0]
    };

    fetch('http://localhost:3001/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData)
    }).catch((err) => console.error('Error db.json:', err));

    fetch('http://localhost:5678/webhook/pixel-quiz-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData)
    }).catch((err) => console.log('n8n Webhook ausente:', err));

    navigate('/puntajes');
  }, [player, navigate]);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/scenarios?level=${nivel}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener nivel');
        return res.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setScenario(data[0]);
        } else {
          finishGame();
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [nivel, finishGame]);

  const handleOptionSelect = (option) => {
    updateStats(option.damage, option.xp);

    const nextLevelNum = parseInt(nivel) + 1;
    if (nextLevelNum <= 3) {
      nextLevel();
      navigate(`/juego/${nextLevelNum}`);
    } else {
      finishGame();
    }
  };

  if (loading || error) return <LoadingErrorState loading={loading} error={error} />;

  // API de Sprites Pixel Art para los enemigos
  const enemySprite = scenario ? `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(scenario.enemy)}` : '';

  return (
    <div style={{ maxWidth: '650px', margin: '2rem auto', padding: '0 1rem' }}>
      <Scoreboard />
      
      {scenario && (
        <div className="pixel-box">
          <div style={{ textTransform: 'uppercase', color: '#ffcc00', fontSize: '0.7rem', marginBottom: '1rem' }}>
            {scenario.title}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#000', padding: '1rem', marginBottom: '1rem' }}>
            <img src={enemySprite} alt="Enemigo Pixel" className="enemy-shake" style={{ width: '60px', height: '60px' }} />
            <div>
              <div style={{ color: '#ff0055', fontSize: '0.7rem' }}>{scenario.enemy}</div>
              <p style={{ fontSize: '0.6rem', marginTop: '0.5rem', lineHeight: '1.4' }}>{scenario.question}</p>
            </div>
          </div>

          <div>
            {scenario.options.map((option) => (
              <Card key={option.id} option={option} onSelect={handleOptionSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}