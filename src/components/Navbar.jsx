import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#090810', borderBottom: '4px solid #ff0055' }}>
      <h2 style={{ fontSize: '1rem', color: '#ffcc00', margin: 0 }}>⚔️ PIXEL QUIZ RPG</h2>
      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.7rem' }}>
        <Link to="/" style={{ color: '#00e5ff', textDecoration: 'none' }}>[INICIO]</Link>
        <Link to="/juego/1" style={{ color: '#00e5ff', textDecoration: 'none' }}>[JUEGO]</Link>
        <Link to="/puntajes" style={{ color: '#00e5ff', textDecoration: 'none' }}>[PUNTAJES]</Link>
      </div>
    </nav>
  );
}