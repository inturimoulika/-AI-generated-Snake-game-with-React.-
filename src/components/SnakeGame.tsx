/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GAME_CONFIG } from '../constants.ts';
import { Point, Direction } from '../types.ts';
import { Trophy, RefreshCw, Zap } from 'lucide-react';

interface SnakeGameProps {
  accentColor: string;
}

export default function SnakeGame({ accentColor }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(GAME_CONFIG.INITIAL_SPEED);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GAME_CONFIG.TILE_COUNT),
        y: Math.floor(Math.random() * GAME_CONFIG.TILE_COUNT),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(spawnFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(GAME_CONFIG.INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };
      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check wall collision
      if (
        head.x < 0 || head.x >= GAME_CONFIG.TILE_COUNT ||
        head.y < 0 || head.y >= GAME_CONFIG.TILE_COUNT ||
        prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collection
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 10);
        setFood(spawnFood(newSnake));
        setSpeed((prev) => Math.max(GAME_CONFIG.MIN_SPEED, prev - GAME_CONFIG.SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, score, highScore, spawnFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); if (gameOver) resetGame(); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  useEffect(() => {
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [moveSnake, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GAME_CONFIG.TILE_COUNT; i++) {
      ctx.beginPath(); ctx.moveTo(i * GAME_CONFIG.GRID_SIZE, 0); ctx.lineTo(i * GAME_CONFIG.GRID_SIZE, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * GAME_CONFIG.GRID_SIZE); ctx.lineTo(canvas.width, i * GAME_CONFIG.GRID_SIZE); ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const x = segment.x * GAME_CONFIG.GRID_SIZE;
      const y = segment.y * GAME_CONFIG.GRID_SIZE;
      const opacity = Math.max(0.2, 1 - index / snake.length);
      
      ctx.shadowBlur = index === 0 ? 15 : 0;
      ctx.shadowColor = accentColor;
      ctx.fillStyle = index === 0 ? accentColor : `${accentColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
      
      // Draw segment with rounded corners
      const size = GAME_CONFIG.GRID_SIZE - 2;
      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, size, size, 4);
      ctx.fill();
    });

    // Draw food
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#fff';
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    const foodX = food.x * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2;
    const foodY = food.y * GAME_CONFIG.GRID_SIZE + GAME_CONFIG.GRID_SIZE / 2;
    ctx.arc(foodX, foodY, GAME_CONFIG.GRID_SIZE / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Food outer ring
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(foodX, foodY, GAME_CONFIG.GRID_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowBlur = 0;
  }, [snake, food, accentColor]);

  return (
    <div className="flex flex-col items-center gap-8 py-8 w-full">
      <div className="flex justify-between w-full max-w-[400px] items-end">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Current Score</p>
          <div className="text-4xl font-bold font-mono tracking-tighter flex items-center gap-2">
            <Zap size={24} style={{ color: accentColor }} />
            {score.toString().padStart(4, '0')}
          </div>
        </div>
        <div className="text-right space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Top Strike</p>
          <div className="text-xl font-bold font-mono text-white/60 flex items-center gap-2 justify-end">
            {highScore.toString().padStart(4, '0')}
            <Trophy size={16} />
          </div>
        </div>
      </div>

      <div className="relative group">
        <div 
          className="absolute -inset-1 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"
          style={{ backgroundColor: accentColor }}
        />
        <canvas
          ref={canvasRef}
          width={GAME_CONFIG.TILE_COUNT * GAME_CONFIG.GRID_SIZE}
          height={GAME_CONFIG.TILE_COUNT * GAME_CONFIG.GRID_SIZE}
          className="relative bg-black rounded-xl border border-white/10 shadow-2xl overflow-hidden"
          style={{ boxShadow: `0 0 40px ${accentColor}11` }}
        />

        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-sm bg-black/40 rounded-xl"
            >
              <div className="text-center p-8 glass-panel rounded-2xl border-white/5 mx-4 max-w-xs w-full shadow-2xl">
                <h2 className={`text-2xl font-bold mb-2 ${gameOver ? 'text-red-500' : 'text-white'}`}>
                  {gameOver ? 'STRIKE OVER' : 'PAUSED'}
                </h2>
                <p className="text-white/40 text-sm mb-6 font-mono leading-relaxed">
                  {gameOver ? `YOUR FINAL SCORE: ${score}` : 'USE ARROW KEYS TO MOVE'}
                </p>
                <button
                  onClick={resetGame}
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] font-bold tracking-tight"
                  style={{ backgroundColor: accentColor, color: '#000' }}
                >
                  <RefreshCw size={20} />
                  {gameOver ? 'NITRO RESTART' : 'RESUME'}
                </button>
                <p className="mt-4 text-[10px] text-white/20 uppercase tracking-widest">or press space</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
        <div className="flex items-center gap-2 px-4 py-1">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-mono text-white/40">SYSTEM OK</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-1 border-x border-white/10">
          <span className="text-[10px] font-mono text-white/40 uppercase">SPD: {Math.round((GAME_CONFIG.INITIAL_SPEED - speed + 10) / 2)}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-1">
          <span className="text-[10px] font-mono text-white/40 uppercase">LVL: {Math.floor(score / 50) + 1}</span>
        </div>
      </div>
    </div>
  );
}
