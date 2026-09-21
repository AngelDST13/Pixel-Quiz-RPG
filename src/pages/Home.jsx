import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

export default function Home() {
  const [nameInput, setNameInput] = useState('');
  const [difficulty, setDifficulty] = useState('facil');
  const { resetGame } = useContext(GameContext);
  const navigate = useNavigate();

  const previewAvatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(nameInput || 'PongHero')}`;

  const handleStart = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    resetGame(nameInput, difficulty);
    navigate(`/juego/${difficulty}`);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2.5rem auto', textAlign: 'center', padding: '0 1rem' }}>
      <div className="pixel-box">
        <h1 style={{ fontSize: '1.1rem', color: '#ffcc00', marginBottom: '1rem' }}>PIXEL PONG RPG</h1>
        <p style={{ fontSize: '0.55rem', lineHeight: '1.6', color: '#00e5ff' }}>
          MUEVE LA RAQUETA CON EL MOUSE Y DERROTA A LA IA PARA GUARDAR TU RÉCORD.
        </p>

        <div style={{ margin: '1.5rem 0' }}>
          <img src={previewAvatar} alt="Avatar Preview" style={{ width: '80px', height: '80px', border: '4px solid #00e5ff', background: '#000' }} />
        </div>

        <form onSubmit={handleStart}>
          <input
            className="pixel-input"
            type="text"
            placeholder="NOMBRE DEL JUGADOR"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem' }}
            required
          />

          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{ fontSize: '0.55rem', color: '#ffcc00', display: 'block', marginBottom: '0.5rem' }}>DIFICULTAD:</label>
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

          <button className="pixel-btn" type="submit" style={{ width: '100%' }}>
            [ INICIAR PARTIDO ]
          </button>
        </form>
      </div>
    </div>
  );
}