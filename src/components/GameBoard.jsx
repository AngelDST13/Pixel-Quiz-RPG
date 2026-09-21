import { useEffect, useRef, useContext, useCallback, useState } from 'react';
import { GameContext } from '../context/GameContext';
import { Play, PauseCircle, Trophy, RotateCcw } from 'lucide-react';

export default function GameBoard({ difficulty, onGameOver, isPaused, setIsPaused, hasStarted, setHasStarted, onRestart }) {
  const canvasRef = useRef(null);
  const { player, updateScore } = useContext(GameContext);
  const [matchResult, setMatchResult] = useState(null);

  const gameState = useRef({
    paddleY: 150,
    cpuY: 150,
    ballX: 300,
    ballY: 200,
    ballSpeedX: 4,
    ballSpeedY: 3,
    playerScore: 0,
    cpuScore: 0,
    isResetting: false,
    keys: {}
  });

  const requestRef = useRef(null);
  const lastTimeRef = useRef(0);

  const triggerGameOver = useCallback((winner) => {
    setMatchResult(winner);
    onGameOver(gameState.current.playerScore, gameState.current.cpuScore, winner);
  }, [onGameOver]);

  // Captura de teclado para 1P / 2P y Pausa
  useEffect(() => {
    const handleKeyDown = (e) => {
      gameState.current.keys[e.key.toLowerCase()] = true;

      if (e.key === 'Escape' && hasStarted && !matchResult) {
        setIsPaused((prev) => !prev);
      } else if ((e.key === ' ' || e.key === 'Enter') && !hasStarted && !matchResult) {
        setHasStarted(true);
      }
    };

    const handleKeyUp = (e) => {
      gameState.current.keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [hasStarted, isPaused, matchResult, setIsPaused, setHasStarted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const diffSettings = {
      facil: { baseSpeedX: 320, cpuSpeed: 180, accel: 1.02 },
      medio: { baseSpeedX: 450, cpuSpeed: 300, accel: 1.04 },
      dificil: { baseSpeedX: 620, cpuSpeed: 520, accel: 1.07 }
    };

    const currentDiff = diffSettings[difficulty] || diffSettings.facil;

    if (gameState.current.ballSpeedX === 4) {
      gameState.current.ballSpeedX = currentDiff.baseSpeedX;
      gameState.current.ballSpeedY = 200;
    }

    // Control con Mouse si es 1P
    const handleMouseMove = (e) => {
      if (player.gameMode === '1p') {
        const rect = canvas.getBoundingClientRect();
        const root = document.documentElement;
        const mouseY = e.clientY - rect.top - root.scrollTop;
        gameState.current.paddleY = Math.max(0, Math.min(320, mouseY - 40));
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const gameLoop = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;
      const dt = Math.min(deltaTime, 0.05);

      if (!hasStarted || isPaused || matchResult) {
        renderCanvas(ctx, gameState.current);
        requestRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      let state = gameState.current;

      // Movimiento con teclado si es 2P o usa teclas en 1P (W / S)
      if (state.keys['w']) state.paddleY = Math.max(0, state.paddleY - 420 * dt);
      if (state.keys['s']) state.paddleY = Math.min(320, state.paddleY + 420 * dt);

      // Si es modo 2P, Paleta derecha se mueve con Flecha Arriba / Flecha Abajo
      if (player.gameMode === '2p') {
        if (state.keys['arrowup']) state.cpuY = Math.max(0, state.cpuY - 420 * dt);
        if (state.keys['arrowdown']) state.cpuY = Math.min(320, state.cpuY + 420 * dt);
      } else {
        // IA CPU para modo 1P
        const cpuCenter = state.cpuY + 40;
        if (state.ballY > cpuCenter + 5) {
          state.cpuY += currentDiff.cpuSpeed * dt;
        } else if (state.ballY < cpuCenter - 5) {
          state.cpuY -= currentDiff.cpuSpeed * dt;
        }
      }

      if (!state.isResetting) {
        state.ballX += state.ballSpeedX * dt;
        state.ballY += state.ballSpeedY * dt;

        if (state.ballY <= 5) {
          state.ballY = 5;
          state.ballSpeedY *= -1;
        } else if (state.ballY >= 395) {
          state.ballY = 395;
          state.ballSpeedY *= -1;
        }

        // Colisión Paleta Izquierda (P1)
        if (state.ballX <= 25 && state.ballY >= state.paddleY && state.ballY <= state.paddleY + 80) {
          state.ballX = 25;
          state.ballSpeedX = Math.abs(state.ballSpeedX) * currentDiff.accel;
          const deltaY = state.ballY - (state.paddleY + 40);
          state.ballSpeedY = deltaY * 8;
        }

        // Colisión Paleta Derecha (CPU / P2)
        if (state.ballX >= 575 && state.ballY >= state.cpuY && state.ballY <= state.cpuY + 80) {
          state.ballX = 575;
          state.ballSpeedX = -Math.abs(state.ballSpeedX) * currentDiff.accel;
          const deltaY = state.ballY - (state.cpuY + 40);
          state.ballSpeedY = deltaY * 8;
        }

        // Punto Jugador Derecha
        if (state.ballX <= 0) {
          state.cpuScore += 1;
          updateScore(0, 1);
          autoResetBall(1, currentDiff.baseSpeedX);
        }

        // Punto Jugador Izquierda
        if (state.ballX >= 600) {
          state.playerScore += 1;
          updateScore(1, 0);
          autoResetBall(-1, currentDiff.baseSpeedX);
        }
      }

      renderCanvas(ctx, state);

      // REGLA UNIFICADA: EL PRIMERO EN LLEGAR A 10 PUNTOS GANA
      if (state.playerScore >= 10) {
        triggerGameOver('p1');
      } else if (state.cpuScore >= 10) {
        triggerGameOver(player.gameMode === '2p' ? 'p2' : 'cpu');
      } else {
        requestRef.current = requestAnimationFrame(gameLoop);
      }
    };

    requestRef.current = requestAnimationFrame(gameLoop);

    function autoResetBall(direction, baseSpeed) {
      gameState.current.isResetting = true;
      gameState.current.ballX = 300;
      gameState.current.ballY = 200;
      gameState.current.ballSpeedX = 0;
      gameState.current.ballSpeedY = 0;

      setTimeout(() => {
        gameState.current.ballSpeedX = baseSpeed * direction;
        gameState.current.ballSpeedY = (Math.random() > 0.5 ? 200 : -200);
        gameState.current.isResetting = false;
      }, 700);
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
  }, [difficulty, hasStarted, isPaused, matchResult, player.gameMode, updateScore, triggerGameOver]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', margin: '1rem auto' }}>
      <div style={{ textAlign: 'center' }}>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/39.gif"
          alt="Mascota Izquierda"
          className="retro-kirby"
          style={{ width: '50px', height: '50px', display: 'block', margin: '0 auto' }}
        />
        <span style={{ fontSize: '0.45rem', color: '#00e5ff', marginTop: '0.4rem', display: 'block' }}>{player.name || 'P1'}</span>
      </div>

      <div style={{ position: 'relative', width: '600px' }}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          style={{
            border: '4px solid #fff',
            boxShadow: '-4px 0 0 0 #ff0055, 4px 0 0 0 #ff0055, 0 -4px 0 0 #ff0055, 0 4px 0 0 #ff0055',
            display: 'block',
            cursor: player.gameMode === '2p' ? 'default' : 'none'
          }}
        />

        {/* OVERLAY SAQUE INICIAL */}
        {!hasStarted && !isPaused && !matchResult && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(9, 8, 16, 0.85)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '1rem'
          }}>
            <h2 style={{ fontSize: '0.85rem', color: '#ffcc00' }} className="animated-title">¡PRIMERO A 10 PUNTOS GANA!</h2>
            <button className="pixel-btn" onClick={() => setHasStarted(true)}>
              <Play size={16} /> [ PRESIONA ESPACIO O CLICK ]
            </button>
          </div>
        )}

        {/* OVERLAY PAUSA */}
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

        {/* PANTALLA DE VICTORIA P1 / JUGADOR */}
        {matchResult === 'p1' && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(9, 8, 16, 0.95)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '1rem'
          }}>
            <Trophy size={60} color="#ffcc00" className="victory-banner" />
            <h2 style={{ fontSize: '1rem', color: '#00ff66' }}>¡{player.name.toUpperCase()} HA GANADO!</h2>
            <p style={{ fontSize: '0.55rem', color: '#ffcc00' }}>ALCANZÓ LOS 10 PUNTOS PRIMERO</p>
            <button className="pixel-btn" onClick={onRestart}>
              <RotateCcw size={16} /> [ JUGAR DE NUEVO ]
            </button>
          </div>
        )}

        {/* PANTALLA DE VICTORIA P2 O DERROTA VS CPU */}
        {(matchResult === 'p2' || matchResult === 'cpu') && (
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(9, 8, 16, 0.95)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '1rem'
          }}>
            <Trophy size={60} color="#ff0055" className="victory-banner" />
            <h2 style={{ fontSize: '1rem', color: '#ff0055' }}>
              {matchResult === 'p2' ? `¡${player.p2Name.toUpperCase()} HA GANADO!` : '¡VICTORIA DE LA CPU!'}
            </h2>
            <p style={{ fontSize: '0.55rem', color: '#aaa' }}>ALCANZÓ LOS 10 PUNTOS PRIMERO</p>
            <button className="pixel-btn" onClick={onRestart} style={{ background: '#00e5ff', color: '#000' }}>
              <RotateCcw size={16} /> [ REINTENTAR ]
            </button>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center' }}>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/143.gif"
          alt="Mascota Derecha"
          className="retro-yoshi"
          style={{ width: '50px', height: '50px', display: 'block', margin: '0 auto' }}
        />
        <span style={{ fontSize: '0.45rem', color: '#ff0055', marginTop: '0.4rem', display: 'block' }}>
          {player.gameMode === '2p' ? player.p2Name || 'P2' : 'CPU'}
        </span>
      </div>
    </div>
  );
}