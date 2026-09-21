import { useEffect, useRef, useContext, useCallback, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { Play, PauseCircle } from 'lucide-react';

export default function GameBoard({ difficulty, onGameOver, isPaused, setIsPaused }) {
  const canvasRef = useRef(null);
  const { updateScore } = useContext(GameContext);
  const [hasStarted, setHasStarted] = useState(false);

  const gameState = useRef({
    paddleY: 150,
    cpuY: 150,
    ballX: 300,
    ballY: 200,
    ballSpeedX: 4,
    ballSpeedY: 3,
    playerScore: 0,
    cpuScore: 0
  });

  const handleGameOver = useCallback(() => {
    onGameOver(gameState.current.playerScore, gameState.current.cpuScore);
  }, [onGameOver]);

  // Listener para teclado (ESC para pausa, ESPACIO para iniciar)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsPaused((prev) => !prev);
      } else if ((e.key === ' ' || e.key === 'Enter') && !hasStarted) {
        setHasStarted(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, setIsPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const speedMultiplier = difficulty === 'dificil' ? 1.5 : difficulty === 'medio' ? 1.2 : 1;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseY = e.clientY - rect.top - root.scrollTop;
      gameState.current.paddleY = Math.max(0, Math.min(320, mouseY - 40));
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const gameInterval = setInterval(() => {
      // Dibuja el estado estático si el juego no ha iniciado o está en pausa
      if (!hasStarted || isPaused) {
        renderCanvas(ctx, gameState.current);
        return;
      }

      let state = gameState.current;

      // Movimiento bola
      state.ballX += state.ballSpeedX;
      state.ballY += state.ballSpeedY;

      // Rebote Paredes
      if (state.ballY <= 5 || state.ballY >= 395) state.ballSpeedY *= -1;

      // IA CPU
      const cpuSpeed = difficulty === 'dificil' ? 4.5 : difficulty === 'medio' ? 3.2 : 2.2;
      if (state.ballY > state.cpuY + 40) state.cpuY += cpuSpeed;
      else if (state.ballY < state.cpuY + 40) state.cpuY -= cpuSpeed;

      // Colisión Paleta Jugador
      if (state.ballX <= 25 && state.ballY >= state.paddleY && state.ballY <= state.paddleY + 80) {
        state.ballSpeedX = Math.abs(state.ballSpeedX) * 1.05;
      }

      // Colisión Paleta CPU
      if (state.ballX >= 575 && state.ballY >= state.cpuY && state.ballY <= state.cpuY + 80) {
        state.ballSpeedX = -Math.abs(state.ballSpeedX) * 1.05;
      }

      // Punto CPU
      if (state.ballX <= 0) {
        state.cpuScore += 1;
        updateScore(0, 1);
        resetBall(1, speedMultiplier);
      }

      // Punto Jugador
      if (state.ballX >= 600) {
        state.playerScore += 1;
        updateScore(1, 0);
        resetBall(-1, speedMultiplier);
      }

      renderCanvas(ctx, state);

      // Fin del partido a los 5 puntos
      if (state.playerScore >= 5 || state.cpuScore >= 5) {
        clearInterval(gameInterval);
        handleGameOver();
      }
    }, 1000 / 60);

    function resetBall(direction, multiplier) {
      gameState.current.ballX = 300;
      gameState.current.ballY = 200;
      gameState.current.ballSpeedX = 4 * multiplier * direction;
      gameState.current.ballSpeedY = (Math.random() > 0.5 ? 3 : -3) * multiplier;
      setHasStarted(false); // Detiene el saqué hasta que el jugador presione sacar
    }

    function renderCanvas(context, state) {
      context.fillStyle = '#090810';
      context.fillRect(0, 0, 600, 400);

      // Línea central
      context.strokeStyle = '#222';
      context.setLineDash([6, 6]);
      context.beginPath();
      context.moveTo(300, 0);
      context.lineTo(300, 400);
      context.stroke();

      // Paletas
      context.fillStyle = '#00e5ff';
      context.fillRect(10, state.paddleY, 12, 80);

      context.fillStyle = '#ff0055';
      context.fillRect(578, state.cpuY, 12, 80);

      // Bola
      context.fillStyle = '#ffcc00';
      context.fillRect(state.ballX - 5, state.ballY - 5, 10, 10);
    }

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      clearInterval(gameInterval);
    };
  }, [difficulty, hasStarted, isPaused, updateScore, handleGameOver]);

  return (
    <div style={{ position: 'relative', width: '600px', margin: '1rem auto' }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        style={{
          border: '4px solid #fff',
          boxShadow: '-4px 0 0 0 #ff0055, 4px 0 0 0 #ff0055, 0 -4px 0 0 #ff0055, 0 4px 0 0 #ff0055',
          display: 'block',
          cursor: 'none'
        }}
      />

      {/* OVERLAY DE INICIO */}
      {!hasStarted && !isPaused && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(9, 8, 16, 0.85)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1rem'
        }}>
          <h2 style={{ fontSize: '0.9rem', color: '#ffcc00' }}>¡LISTO PARA EL SAQUE!</h2>
          <button className="pixel-btn" onClick={() => setHasStarted(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Play size={16} /> [ PRESIONA ESPACIO O CLICK PARA JUGAR ]
          </button>
        </div>
      )}

      {/* OVERLAY DE PAUSA */}
      {isPaused && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(9, 8, 16, 0.9)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1rem'
        }}>
          <PauseCircle size={48} color="#ff0055" />
          <h2 style={{ fontSize: '1rem', color: '#ff0055' }}>JUEGO EN PAUSA</h2>
          <p style={{ fontSize: '0.55rem', color: '#00e5ff' }}>PRESIONA [ESC] O EL BOTÓN PARA CONTINUAR</p>
          <button className="pixel-btn" onClick={() => setIsPaused(false)}>
            [ REANUDAR ]
          </button>
        </div>
      )}
    </div>
  );
}