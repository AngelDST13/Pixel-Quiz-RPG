import { Link } from 'react-router-dom';
import { Gamepad2, Trophy, Home as HomeIcon } from 'lucide-react';

export default function Navbar() {
  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#090810', borderBottom: '4px solid #ff0055' }}>
      <h2 style={{ fontSize: '0.9rem', color: '#ffcc00', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Gamepad2 color="#ff0055" /> PIXEL PONG RPG
      </h2>
      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.65rem' }}>
        <Link to="/" style={{ color: '#00e5ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <HomeIcon size={14} /> INICIO
        </Link>
        <Link to="/juego/facil" style={{ color: '#00e5ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Gamepad2 size={14} /> JUEGO
        </Link>
        <Link to="/puntajes" style={{ color: '#00e5ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Trophy size={14} /> PUNTAJES
        </Link>
      </div>
    </nav>
  );
}