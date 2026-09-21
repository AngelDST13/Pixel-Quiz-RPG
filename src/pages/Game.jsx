import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';
import Scoreboard from '../components/Scoreboard';
import Card from '../components/Card';
import LoadingErrorState from '../components/LoadingErrorState';

function Game() {
  const { nivel } = useParams();
  const navigate = useNavigate();
  const { player, updateStats, nextLevel } = useContext(GameContext);

  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Requisito 2.4: Petición GET para cargar el escenario según el parámetro dinámico
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/scenarios?level=${nivel}`)
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar el nivel');
        return res.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setScenario(data[0]);
        } else {
          // Fin de los niveles disponibles
          finishGame();
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [nivel]);

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

  const finishGame = () => {
    const finalData = {
      id: Date.now().toString(),
      name: player.name || 'Héroe Anónimo',
      xp: player.xp,
      lives: player.hp,
      date: new Date().toISOString().split('T')[0]
    };

    // 1. Guardar en db.json (Operación POST)
    fetch('http://localhost:3001/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData)
    }).catch((err) => console.error('Error al guardar en db.json:', err));

    // 2. Enviar datos al Webhook de n8n (Requisito Sección 3)
    fetch('http://localhost:5678/webhook/pixel-quiz-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalData)
    }).catch((err) => console.log('n8n Webhook no disponible en este momento:', err));

    navigate('/puntajes');
  };

  if (loading || error) {
    return <LoadingErrorState loading={loading} error={error} />;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <Scoreboard />
      
      {scenario && (
        <div style={{ marginTop: '2rem', background: '#1a1a2e', padding: '1.5rem', borderRadius: '8px' }}>
          <h2>{scenario.title}</h2>
          <h3>Enemigo: {scenario.enemy}</h3>
          <p style={{ margin: '1.5rem 0' }}>{scenario.question}</p>

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

export default Game;