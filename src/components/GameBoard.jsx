import { useEffect, useRef, useContext, useCallback, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { Play, PauseCircle, Trophy, Skull, RotateCcw } from 'lucide-react';

export default function GameBoard({ difficulty, onGameOver, isPaused, setIsPaused, hasStarted, setHasStarted, onRestart }) {
  const canvasRef = useRef(null);
  const { updateScore } = useContext(GameContext);
  const [matchResult, setMatchResult] = useState(null);

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

  const requestRef = useRef(null);

  const triggerGameOver = useCallback((result) => {
    setMatchResult(result);
    onGameOver(gameState.current.playerScore, gameState.current.cpuScore, result);
  }, [onGameOver]);

  // Manejo de Teclado (ESC -> Pausa / ESPACIO -> Saque)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && hasStarted && !matchResult) {
        setIsPaused((prev) => !prev);
      } else if ((e.key === ' ' || e.key === 'Enter') && !hasStarted && !matchResult) {
        setHasStarted(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, isPaused, matchResult, setIsPaused, setHasStarted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // DIFICULTAD REALMENTE NOTABLE
    const diffSettings = {
      facil: { baseSpeedX: 4, cpuSpeed: 2.2, accel: 1.02 },
      medio: { baseSpeedX: 6, cpuSpeed: 4.2, accel: 1.05 },
      dificil: { baseSpeedX: 8.5, cpuSpeed: 7.2, accel: 1.08 } // Bola rápida + IA ágil
    };

    const currentDiff = diffSettings[difficulty] || diffSettings.facil;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseY = e.clientY - rect.top - root.scrollTop;
      gameState.current.paddleY = Math.max(0, Math.min(320, mouseY - 40));
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    // LOOP ultra fluido mediante requestAnimationFrame
    const gameLoop = () => {
      if (!hasStarted || isPaused || matchResult) {
        renderCanvas(ctx, gameState.current);
        requestRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      let state = gameState.current;

      state.ballX += state.ballSpeedX;
      state.ballY += state.ballSpeedY;

      // Rebote Superior / Inferior
      if (state.ballY <= 5 || state.ballY >= 395) state.ballSpeedY *= -1;

      // IA CPU (Seguimiento suavizado en dificil)
      const cpuCenter = state.cpuY + 40;
      if (state.ballY > cpuCenter + 5) {
        state.cpuY += currentDiff.cpuSpeed;
      } else if (state.ballY < cpuCenter - 5) {
        state.cpuY -= currentDiff.cpuSpeed;
      }

      // Colisión Paleta Jugador
      if (state.ballX <= 25 && state.ballY >= state.paddleY && state.ballY <= state.paddleY + 80) {
        state.ballSpeedX = Math.abs(state.ballSpeedX) * currentDiff.accel;
        // Variación del ángulo según dónde impacte la bola
        const deltaY = state.ballY - (state.paddleY + 40);
        state.ballSpeedY = deltaY * 0.15;
      }

      // Colisión Paleta CPU
      if (state.ballX >= 575 && state.ballY >= state.cpuY && state.ballY <= state.cpuY + 80) {
        state.ballSpeedX = -Math.abs(state.ballSpeedX) * currentDiff.accel;
        const deltaY = state.ballY - (state.cpuY + 40);
        state.ballSpeedY = deltaY * 0.15;
      }

      // Punto CPU
      if (state.ballX <= 0) {
        state.cpuScore += 1;
        updateScore(0, 1);
        resetBall(1, currentDiff.baseSpeedX);
      }

      // Punto Jugador
      if (state.ballX >= 600) {
        state.playerScore += 1;
        updateScore(1, 0);
        resetBall(-1, currentDiff.baseSpeedX);
      }

      renderCanvas(ctx, state);

      // Evaluación Fin de Juego (Gane 5 / Derrota 10)
      if (state.playerScore >= 5) {
        triggerGameOver('win');
      } else if (state.cpuScore >= 10) {
        triggerGameOver('lose');
      } else {
        requestRef.current = requestAnimationFrame(gameLoop);
      }
    };

    requestRef.current = requestAnimationFrame(gameLoop);

    function resetBall(direction, baseSpeed) {
      gameState.current.ballX = 300;
      gameState.current.ballY = 200;
      gameState.current.ballSpeedX = baseSpeed * direction;
      gameState.current.ballSpeedY = (Math.random() > 0.5 ? 3 : -3);
      setHasStarted(false);
    }

    function renderCanvas(context, state) {
      context.fillStyle = '#090810';
      context.fillRect(0, 0, 600, 400);

      context.strokeStyle = '#222';
      context.setLineDash([6, 6]);
      context.beginPath();
      context.moveTo(300, 0);
      context.lineTo(300, 400);
      context.stroke();

      context.fillStyle = '#00e5ff';
      context.fillRect(10, state.paddleY, 12, 80);

      context.fillStyle = '#ff0055';
      context.fillRect(578, state.cpuY, 12, 80);

      context.fillStyle = '#ffcc00';
      context.fillRect(state.ballX - 5, state.ballY - 5, 10, 10);
    }

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [difficulty, hasStarted, isPaused, matchResult, updateScore, triggerGameOver, setHasStarted]);

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

      {!hasStarted && !isPaused && !matchResult && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(9, 8, 16, 0.85)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1rem'
        }}>
          <h2 style={{ fontSize: '0.85rem', color: '#ffcc00' }} className="animated-title">¡LISTO PARA EL SAQUE!</h2>
          <button className="pixel-btn" onClick={() => setHasStarted(true)}>
            <Play size={16} /> [ PRESIONA ESPACIO O CLICK ]
          </button>
        </div>
      )}

      {isPaused && !matchResult && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(9, 8, 16, 0.9)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1rem'
        }}>
          <PauseCircle size={48} color="#ff0055" className="animated-title" />
          <h2 style={{ fontSize: '0.9rem', color: '#ff0055' }}>JUEGO EN PAUSA</h2>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="pixel-btn" onClick={() => setIsPaused(false)}>
              [ REANUDAR ]
            </button>
            <button className="pixel-btn" onClick={onRestart} style={{ background: '#00e5ff', color: '#000' }}>
              [ REINICIAR ]
            </button>
          </div>
        </div>
      )}

      {matchResult === 'win' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(9, 8, 16, 0.95)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1rem'
        }}>
          <Trophy size={60} color="#ffcc00" className="victory-banner" />
          <h2 style={{ fontSize: '1.1rem', color: '#00ff66' }}>¡VICTORIA ÉPICA!</h2>
          <p style={{ fontSize: '0.55rem', color: '#ffcc00' }}>ALCANZASTE LOS 5 PUNTOS PRIMERO</p>
          <button className="pixel-btn" onClick={onRestart}>
            <RotateCcw size={16} /> [ JUGAR DE NUEVO ]
          </button>
        </div>
      )}

      {matchResult === 'lose' && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(9, 8, 16, 0.95)', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1rem'
        }}>
          <Skull size={60} color="#ff0055" className="animated-title" />
          <h2 style={{ fontSize: '1.1rem', color: '#ff0055' }}>GAME OVER</h2>
          <p style={{ fontSize: '0.55rem', color: '#aaa' }}>LA CPU ALCANZÓ LOS 10 PUNTOS</p>
          <button className="pixel-btn" onClick={onRestart} style={{ background: '#00e5ff', color: '#000' }}>
            <RotateCcw size={16} /> [ REINTENTAR ]
          </button>
        </div>
      )}
    </div>
  );
}