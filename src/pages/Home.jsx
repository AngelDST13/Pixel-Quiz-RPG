import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

export default function Home() {
  const [nameInput, setNameInput] = useState('');
  const [p2NameInput, setP2NameInput] = useState('');
  const [gameMode, setGameMode] = useState('1p'); // '1p' o '2p'
  const [difficulty, setDifficulty] = useState('facil');
  const { resetGame } = useContext(GameContext);
  const navigate = useNavigate();

  const previewAvatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(nameInput || 'PongHero')}`;

  const handleStart = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    resetGame(nameInput, difficulty, gameMode, p2NameInput);
    navigate(`/juego/${difficulty}`);
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto', textAlign: 'center', padding: '0 1rem' }}>
      <div className="pixel-box">
        <h1 style={{ fontSize: '1.1rem', color: '#ffcc00', marginBottom: '1rem' }}>PIXEL PONG RPG</h1>
        <p style={{ fontSize: '0.55rem', lineHeight: '1.6', color: '#00e5ff' }}>
          EL PRIMERO EN LLEGAR A 10 PUNTOS SERÁ EL CAMPEÓN DEL REINO.
        </p>

        <div style={{ margin: '1.2rem 0' }}>
          <img src={previewAvatar} alt="Avatar Preview" style={{ width: '75px', height: '75px', border: '3px solid #00e5ff', background: '#000' }} />
        </div>

        <form onSubmit={handleStart}>
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ fontSize: '0.55rem', color: '#ffcc00', display: 'block', marginBottom: '0.4rem' }}>MODO DE JUEGO:</label>
            <select
              className="pixel-input"
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="1p">1 JUGADOR (VS CPU)</option>
              <option value="2p">2 JUGADORES (LOCAL - MISMO TECLADO)</option>
            </select>
          </div>

          <input
            className="pixel-input"
            type="text"
            placeholder={gameMode === '2p' ? "JUGADOR 1 (TECLAS W / S)" : "NOMBRE JUGADOR"}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem' }}
            required
          />

          {gameMode === '2p' && (
            <input
              className="pixel-input"
              type="text"
              placeholder="JUGADOR 2 (FLECHAS ↑ / ↓)"
              value={p2NameInput}
              onChange={(e) => setP2NameInput(e.target.value)}
              style={{ width: '100%', marginBottom: '1rem' }}
              required
            />
          )}

          {gameMode === '1p' && (
            <div style={{ marginBottom: '1.2rem', textAlign: 'left' }}>
              <label style={{ fontSize: '0.55rem', color: '#ffcc00', display: 'block', marginBottom: '0.4rem' }}>DIFICULTAD CPU:</label>
              <select
                className="pixel-input"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="facil">FÁCIL</option>
                <option value="medio">MEDIO</option>
                <option value="dificil">DIFÍCIL</option>
              </select>
            </div>
          )}

          <button className="pixel-btn" type="submit" style={{ width: '100%' }}>
            [ INICIAR PARTIDO ]
          </button>
        </form>
      </div>
    </div>
  );
}