import { useEffect, useRef, useContext, useCallback } from 'react';
import { GameContext } from '../context/GameContext';

export default function GameBoard({ difficulty, onGameOver }) {
  const canvasRef = useRef(null);
  const { player, updateScore } = useContext(GameContext);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const speedMultiplier = difficulty === 'dificil' ? 1.5 : difficulty === 'medio' ? 1.2 : 1;
    gameState.current.ballSpeedX = 4 * speedMultiplier;
    gameState.current.ballSpeedY = 3 * speedMultiplier;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const root = document.documentElement;
      const mouseY = e.clientY - rect.top - root.scrollTop;
      gameState.current.paddleY = Math.max(0, Math.min(320, mouseY - 40));
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const gameInterval = setInterval(() => {
      let state = gameState.current;

      // Movimiento bola
      state.ballX += state.ballSpeedX;
      state.ballY += state.ballSpeedY;

      // Rebote Paredes
      if (state.ballY <= 0 || state.ballY >= 390) state.ballSpeedY *= -1;

      // IA CPU
      const cpuSpeed = difficulty === 'dificil' ? 4.5 : difficulty === 'medio' ? 3.2 : 2.2;
      if (state.ballY > state.cpuY + 40) state.cpuY += cpuSpeed;
      else if (state.ballY < state.cpuY + 40) state.cpuY -= cpuSpeed;

      // Colisión Paleta Jugador
      if (state.ballX <= 20 && state.ballY >= state.paddleY && state.ballY <= state.paddleY + 80) {
        state.ballSpeedX *= -1.05;
      }

      // Colisión Paleta CPU
      if (state.ballX >= 580 && state.ballY >= state.cpuY && state.ballY <= state.cpuY + 80) {
        state.ballSpeedX *= -1.05;
      }

      // Punto CPU
      if (state.ballX <= 0) {
        state.cpuScore += 1;
        updateScore(0, 1);
        resetBall(1);
      }

      // Punto Jugador
      if (state.ballX >= 600) {
        state.playerScore += 1;
        updateScore(1, 0);
        resetBall(-1);
      }

      // Renderizado
      ctx.fillStyle = '#090810';
      ctx.fillRect(0, 0, 600, 400);

      // Línea central
      ctx.strokeStyle = '#333';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(300, 0);
      ctx.lineTo(300, 400);
      ctx.stroke();

      // Paletas
      ctx.fillStyle = '#00e5ff';
      ctx.fillRect(10, state.paddleY, 10, 80);

      ctx.fillStyle = '#ff0055';
      ctx.fillRect(580, state.cpuY, 10, 80);

      // Bola
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(state.ballX - 5, state.ballY - 5, 10, 10);

      // Fin del partido a los 5 puntos
      if (state.playerScore >= 5 || state.cpuScore >= 5) {
        clearInterval(gameInterval);
        handleGameOver();
      }
    }, 1000 / 60);

    function resetBall(direction) {
      gameState.current.ballX = 300;
      gameState.current.ballY = 200;
      gameState.current.ballSpeedX = 4 * speedMultiplier * direction;
    }

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      clearInterval(gameInterval);
    };
  }, [difficulty, updateScore, handleGameOver]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      style={{
        border: '4px solid #fff',
        boxShadow: '-4px 0 0 0 #ff0055, 4px 0 0 0 #ff0055, 0 -4px 0 0 #ff0055, 0 4px 0 0 #ff0055',
        display: 'block',
        margin: '1rem auto',
        cursor: 'none'
      }}
    />
  );
}