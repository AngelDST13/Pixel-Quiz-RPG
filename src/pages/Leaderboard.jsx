import { useEffect, useState } from 'react';
import LoadingErrorState from '../components/LoadingErrorState';

function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/players')
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener puntajes');
        return res.json();
      })
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading || error) {
    return <LoadingErrorState loading={loading} error={error} />;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Tabla de Puntajes (Salón de la Fama)</h1>
      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #fff' }}>
            <th>Jugador</th>
            <th>XP</th>
            <th>Salud Restante</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '0.5rem 0' }}>{p.name}</td>
              <td>{p.xp}</td>
              <td>{p.lives} HP</td>
              <td>{p.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;