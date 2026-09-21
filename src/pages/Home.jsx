import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameContext } from '../context/GameContext';

function Home() {
  const [nameInput, setNameInput] = useState('');
  const { resetGame } = useContext(GameContext);
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    resetGame(nameInput);
    navigate('/juego/1');
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Pixel Quiz RPG</h1>
      <p>Supera los desafíos de React y derrota a las criaturas del código.</p>

      <form onSubmit={handleStart} style={{ marginTop: '2rem' }}>
        <input
          type="text"
          placeholder="Nombre de tu héroe"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', marginRight: '0.5rem' }}
          required
        />
        <button type="submit" style={{ padding: '0.8rem 1.5rem', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Comenzar Aventura
        </button>
      </form>
    </div>
  );
}

export default Home;