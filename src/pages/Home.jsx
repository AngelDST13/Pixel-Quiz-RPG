import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

export default function Home() {
  const [nameInput, setNameInput] = useState('');
  const { resetGame } = useContext(GameContext);
  const navigate = useNavigate();

  const previewAvatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(nameInput || 'Hero')}`;

  const handleStart = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    resetGame(nameInput);
    navigate('/juego/1');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '3rem auto', textAlign: 'center', padding: '0 1rem' }}>
      <div className="pixel-box">
        <h1 style={{ fontSize: '1.2rem', color: '#ffcc00', marginBottom: '1rem' }}>PIXEL QUIZ RPG</h1>
        <p style={{ fontSize: '0.6rem', lineHeight: '1.6', color: '#00e5ff' }}>
          DESAFÍA LAS CRIATURAS DEL CÓDIGO REACT Y REGISTRA TU PUNTAJE EN EL REINO.
        </p>

        <div style={{ margin: '1.5rem 0' }}>
          <img src={previewAvatar} alt="Avatar Preview" style={{ width: '80px', height: '80px', border: '4px solid #00e5ff', background: '#000' }} />
        </div>

        <form onSubmit={handleStart}>
          <input
            className="pixel-input"
            type="text"
            placeholder="NOMBRE DEL HÉROE"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            style={{ width: '100%', marginBottom: '1rem' }}
            required
          />
          <button className="pixel-btn" type="submit" style={{ width: '100%' }}>
            [ INICIAR AVENTURA ]
          </button>
        </form>
      </div>
    </div>
  );
}