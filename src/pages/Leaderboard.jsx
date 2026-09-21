import { useEffect, useState } from 'react';
import LoadingErrorState from '../components/LoadingErrorState';

export default function Leaderboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/scores')
      .then((res) => {
        if (!res.ok) throw new Error('Error al conectar con la base de datos');
        return res.json();
      })
      .then((data) => {
        setScores(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading || error) return <LoadingErrorState loading={loading} error={error} />;

  return (
    <div style={{ maxWidth: '650px', margin: '2rem auto', padding: '0 1rem' }}>
      <div className="pixel-box">
        <h1 style={{ fontSize: '1rem', color: '#ffcc00', marginBottom: '1.5rem', textAlign: 'center' }}>
          🏆 SALÓN DE LA FAMA PONG
        </h1>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.55rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ff0055', color: '#00e5ff' }}>
              <th style={{ padding: '0.5rem' }}>JUGADOR</th>
              <th>SCORE</th>
              <th>DIFICULTAD</th>
              <th>FECHA</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '0.6rem 0.5rem', color: '#ffcc00' }}>{s.player}</td>
                <td>{s.score} - {s.cpuScore}</td>
                <td>{s.difficulty?.toUpperCase()}</td>
                <td>{s.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}