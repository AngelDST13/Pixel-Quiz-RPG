import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#1a1a2e', color: '#fff' }}>
      <h2>Pixel Quiz RPG</h2>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Inicio</Link>
        <Link to="/juego/1" style={{ color: '#fff', textDecoration: 'none' }}>Juego</Link>
        <Link to="/puntajes" style={{ color: '#fff', textDecoration: 'none' }}>Puntajes</Link>
      </div>
    </nav>
  );
}

export default Navbar;