/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ActiveBuff,
  Direction,
  FloatingText,
  FoodItem,
  FoodType,
  GameMode,
  GameSettings,
  GameStats,
  Particle,
  Position,
} from './types/game';
import {
  ACHIEVEMENTS,
  DIFFICULTY_SPEEDS,
  GENERATE_OBSTACLES,
  GRID_SIZE,
  SKINS,
} from './utils/gameConstants';
import { loadSettings, loadStats, saveSettings, saveStats } from './utils/storage';
import { soundManager } from './utils/audio';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { GameBoard } from './components/GameBoard';
import { TouchControls } from './components/TouchControls';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { StatsModal } from './components/StatsModal';
import { HelpModal } from './components/HelpModal';

export default function App() {
  // Load persistent settings & stats
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [stats, setStats] = useState<GameStats>(loadStats);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Game Engine State
  const [snake, setSnake] = useState<Position[]>([
    { x: 12, y: 12 },
    { x: 11, y: 12 },
    { x: 10, y: 12 },
    { x: 9, y: 12 },
  ]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [obstacles, setObstacles] = useState<Position[]>([]);

  // Scores & Multipliers
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [comboTimeLeft, setComboTimeLeft] = useState(1);
  const [maxComboThisGame, setMaxComboThisGame] = useState(1);
  const [foodEatenCount, setFoodEatenCount] = useState(0);
  const [goldenAppleCount, setGoldenAppleCount] = useState(0);

  // Time Attack mode timer (seconds)
  const [timeLeft, setTimeLeft] = useState<number>(60);

  // Buffs & Visual FX
  const [activeBuffs, setActiveBuffs] = useState<ActiveBuff[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Game Status
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  // Refs for current mutable values in game tick
  const snakeRef = useRef(snake);
  snakeRef.current = snake;
  const directionRef = useRef(direction);
  directionRef.current = direction;
  const nextDirectionRef = useRef(nextDirection);
  nextDirectionRef.current = nextDirection;
  const foodItemsRef = useRef(foodItems);
  foodItemsRef.current = foodItems;
  const obstaclesRef = useRef(obstacles);
  obstaclesRef.current = obstacles;
  const activeBuffsRef = useRef(activeBuffs);
  activeBuffsRef.current = activeBuffs;
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const comboRef = useRef(combo);
  comboRef.current = combo;
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const isGameOverRef = useRef(isGameOver);
  isGameOverRef.current = isGameOver;
  const statsRef = useRef(stats);
  statsRef.current = stats;

  const lastComboTickRef = useRef<number>(Date.now());
  const specialSpawnTimerRef = useRef<number>(Date.now());

  // Synchronize sound manager with settings
  useEffect(() => {
    soundManager.setMuted(!settings.soundEnabled);
    saveSettings(settings);
  }, [settings]);

  // Generate safe random position that doesn't overlap snake or obstacles or existing food
  const getSafeRandomPosition = useCallback(
    (currentSnake: Position[], currentObstacles: Position[], currentFood: FoodItem[]): Position => {
      let candidate: Position = { x: 0, y: 0 };
      let attempts = 0;
      let valid = false;

      while (!valid && attempts < 500) {
        attempts++;
        candidate = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };

        const onSnake = currentSnake.some((s) => s.x === candidate.x && s.y === candidate.y);
        const onObs = currentObstacles.some((o) => o.x === candidate.x && o.y === candidate.y);
        const onFood = currentFood.some((f) => f.x === candidate.x && f.y === candidate.y);

        if (!onSnake && !onObs && !onFood) {
          valid = true;
        }
      }

      return candidate;
    },
    []
  );

  // Spawn initial food or regular apple
  const spawnFood = useCallback(
    (type: FoodType = 'APPLE', currentSnake?: Position[], currentObs?: Position[], currentFood?: FoodItem[]) => {
      const s = currentSnake || snakeRef.current;
      const obs = currentObs || obstaclesRef.current;
      const fList = currentFood || foodItemsRef.current;

      const pos = getSafeRandomPosition(s, obs, fList);
      const points =
        type === 'APPLE'
          ? 10
          : type === 'GOLDEN_APPLE'
          ? 50
          : type === 'DIET_MUSHROOM'
          ? 25
          : 20;

      const newFood: FoodItem = {
        id: `food_${Date.now()}_${Math.random()}`,
        x: pos.x,
        y: pos.y,
        type,
        points,
        spawnTime: Date.now(),
        expiresAt: type !== 'APPLE' ? Date.now() + 11000 : undefined, // Special items despawn after 11s
      };

      setFoodItems((prev) => [...prev, newFood]);
    },
    [getSafeRandomPosition]
  );

  // Spawn special item periodically in ARCADE mode
  const checkSpecialItemSpawn = useCallback(() => {
    if (settingsRef.current.mode !== 'ARCADE' && settingsRef.current.mode !== 'TIME_ATTACK') return;
    const now = Date.now();
    if (now - specialSpawnTimerRef.current > 9000) {
      specialSpawnTimerRef.current = now;

      // Only spawn if fewer than 3 food items on board
      if (foodItemsRef.current.length < 3) {
        const specialTypes: FoodType[] = [
          'GOLDEN_APPLE',
          'SPEED_CHILI',
          'FREEZE_BERRY',
          'DIET_MUSHROOM',
          'MAGNET',
        ];
        const randomType = specialTypes[Math.floor(Math.random() * specialTypes.length)];
        spawnFood(randomType);
      }
    }
  }, [spawnFood]);

  // Particle creation helper
  const addParticles = useCallback((x: number, y: number, color: string, count = 12) => {
    const cellSize = 560 / GRID_SIZE;
    const cx = (x + 0.5) * cellSize;
    const cy = (y + 0.5) * cellSize;

    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
      const speed = 1.2 + Math.random() * 3.5;
      newParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2.5 + Math.random() * 2.5,
        alpha: 1,
        life: 0,
        maxLife: 20 + Math.random() * 15,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  }, []);

  // Floating text notification (+10, COMBO x2!)
  const addFloatingText = useCallback((x: number, y: number, text: string, color = '#facc15') => {
    const cellSize = 560 / GRID_SIZE;
    const cx = (x + 0.5) * cellSize;
    const cy = (y + 0.5) * cellSize;

    setFloatingTexts((prev) => [
      ...prev,
      {
        id: `ft_${Date.now()}_${Math.random()}`,
        x: cx,
        y: cy - 10,
        text,
        color,
        alpha: 1,
        scale: 1,
      },
    ]);
  }, []);

  // Check and unlock achievements
  const triggerAchievementCheck = useCallback(
    (currentScore: number, currentLength: number, currentCombo: number, goldCount: number) => {
      const unlocked = new Set(statsRef.current.achievementsUnlocked);
      const newlyEarned: string[] = [];

      const tryUnlock = (id: string, condition: boolean) => {
        if (condition && !unlocked.has(id)) {
          unlocked.add(id);
          const meta = ACHIEVEMENTS.find((a) => a.id === id);
          if (meta) newlyEarned.push(`${meta.icon} ${meta.title} (${meta.description})`);
        }
      };

      tryUnlock('FIRST_BITE', true);
      tryUnlock('GROWTH_SPURT', currentLength >= 15);
      tryUnlock('GIANT_WORM', currentLength >= 35);
      tryUnlock('COMBO_MASTER', currentCombo >= 5);
      tryUnlock('GOLDEN_LUCK', goldCount >= 3);
      tryUnlock('SCORE_500', currentScore >= 500);
      tryUnlock('SCORE_1000', currentScore >= 1000);

      if (newlyEarned.length > 0) {
        soundManager.playHighScore();
        const updatedStats: GameStats = {
          ...statsRef.current,
          achievementsUnlocked: Array.from(unlocked),
        };
        setStats(updatedStats);
        saveStats(updatedStats);
        setNewAchievements((prev) => [...prev, ...newlyEarned]);
      }
    },
    []
  );

  // Start / Reset Game
  const startNewGame = useCallback(() => {
    const initialSnake: Position[] = [
      { x: 12, y: 12 },
      { x: 11, y: 12 },
      { x: 10, y: 12 },
      { x: 9, y: 12 },
    ];
    setSnake(initialSnake);
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setCombo(1);
    setComboTimeLeft(1);
    setMaxComboThisGame(1);
    setFoodEatenCount(0);
    setGoldenAppleCount(0);
    setActiveBuffs([]);
    setParticles([]);
    setFloatingTexts([]);
    setIsPaused(false);
    setIsGameOver(false);
    setIsNewRecord(false);
    setNewAchievements([]);
    setTimeLeft(60);

    // Setup obstacles if OBSTACLES mode
    let obsList: Position[] = [];
    if (settingsRef.current.mode === 'OBSTACLES') {
      obsList = GENERATE_OBSTACLES(GRID_SIZE);
      setObstacles(obsList);
    } else {
      setObstacles([]);
    }

    // Spawn 1 standard apple
    const safePos = getSafeRandomPosition(initialSnake, obsList, []);
    const initialFood: FoodItem = {
      id: `food_init_${Date.now()}`,
      x: safePos.x,
      y: safePos.y,
      type: 'APPLE',
      points: 10,
      spawnTime: Date.now(),
    };
    setFoodItems([initialFood]);

    lastComboTickRef.current = Date.now();
    specialSpawnTimerRef.current = Date.now();
  }, [getSafeRandomPosition]);

  // Initial mount game setup
  useEffect(() => {
    startNewGame();
  }, [settings.mode, startNewGame]);

  // Handle Game Over
  const handleGameOver = useCallback(() => {
    if (isGameOverRef.current) return;
    setIsGameOver(true);
    soundManager.playGameOver();

    if (settingsRef.current.vibrationEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 150]);
      } catch {}
    }

    // Explode snake into cyber particles
    const currentSkin = SKINS[settingsRef.current.skin] || SKINS.CYBER_VIPER;
    snakeRef.current.forEach((seg) => {
      addParticles(seg.x, seg.y, currentSkin.primaryColor, 4);
    });

    const currentScore = scoreRef.current;
    const mode = settingsRef.current.mode;
    const bestForMode = statsRef.current.highestScore[mode] || 0;
    const achievedNewRecord = currentScore > bestForMode;

    if (achievedNewRecord) {
      setIsNewRecord(true);
      soundManager.playHighScore();
    }

    // Update career stats
    const updatedStats: GameStats = {
      ...statsRef.current,
      gamesPlayed: statsRef.current.gamesPlayed + 1,
      totalFoodEaten: statsRef.current.totalFoodEaten + foodEatenCount,
      maxLengthEver: Math.max(statsRef.current.maxLengthEver, snakeRef.current.length),
      highestScore: {
        ...statsRef.current.highestScore,
        [mode]: Math.max(bestForMode, currentScore),
      },
      totalScore: statsRef.current.totalScore + currentScore,
    };

    setStats(updatedStats);
    saveStats(updatedStats);
  }, [addParticles, foodEatenCount]);

  // Process Direction change with 180-degree turn lock
  const changeDirection = useCallback((newDir: Direction) => {
    const currentDir = directionRef.current;
    if (isPausedRef.current) {
      setIsPaused(false);
    }

    if (
      (newDir === 'UP' && currentDir === 'DOWN') ||
      (newDir === 'DOWN' && currentDir === 'UP') ||
      (newDir === 'LEFT' && currentDir === 'RIGHT') ||
      (newDir === 'RIGHT' && currentDir === 'LEFT')
    ) {
      return; // Ignore direct opposite moves
    }

    setNextDirection(newDir);
    soundManager.playTurn();
  }, []);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.code === 'Space') {
        if (!isGameOverRef.current) {
          setIsPaused((prev) => !prev);
        }
        return;
      }

      if (e.key === 'r' || e.key === 'R' || e.key === 'ㄱ') {
        startNewGame();
        return;
      }

      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsStatsOpen(false);
        setIsHelpOpen(false);
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'ㅈ':
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
        case 'ㄴ':
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'ㅁ':
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
        case 'ㅇ':
          changeDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, startNewGame]);

  // Active Buffs countdown tick
  useEffect(() => {
    if (isPaused || isGameOver) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setActiveBuffs((prev) => prev.filter((b) => b.expiresAt > now));
    }, 250);
    return () => clearInterval(interval);
  }, [isPaused, isGameOver]);

  // Combo decay tick
  useEffect(() => {
    if (isPaused || isGameOver) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - lastComboTickRef.current;
      const totalComboWindow = 4000; // 4 seconds to maintain combo
      const remainingRatio = Math.max(0, 1 - elapsed / totalComboWindow);
      setComboTimeLeft(remainingRatio);

      if (remainingRatio <= 0 && comboRef.current > 1) {
        setCombo(1);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPaused, isGameOver]);

  // Visual effects animation loop (Particles & Floating texts)
  useEffect(() => {
    let animId: number;
    const updateVFX = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vx: p.vx * 0.94,
            vy: p.vy * 0.94,
            life: p.life + 1,
            alpha: 1 - p.life / p.maxLife,
          }))
          .filter((p) => p.life < p.maxLife && p.alpha > 0)
      );

      setFloatingTexts((prev) =>
        prev
          .map((ft) => ({
            ...ft,
            y: ft.y - 0.7,
            alpha: ft.alpha - 0.02,
            scale: ft.scale + 0.005,
          }))
          .filter((ft) => ft.alpha > 0)
      );

      animId = requestAnimationFrame(updateVFX);
    };

    animId = requestAnimationFrame(updateVFX);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Time Attack Countdown (if TIME_ATTACK mode)
  useEffect(() => {
    if (settings.mode !== 'TIME_ATTACK' || isPaused || isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleGameOver();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.mode, isPaused, isGameOver, handleGameOver]);

  // Clean expired special items
  useEffect(() => {
    if (isPaused || isGameOver) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setFoodItems((prev) => {
        const filtered = prev.filter((item) => !item.expiresAt || item.expiresAt > now);
        // Ensure at least 1 apple always exists
        if (filtered.length === 0) {
          const safePos = getSafeRandomPosition(snakeRef.current, obstaclesRef.current, []);
          return [
            {
              id: `food_fallback_${now}`,
              x: safePos.x,
              y: safePos.y,
              type: 'APPLE',
              points: 10,
              spawnTime: now,
            },
          ];
        }
        return filtered;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, isGameOver, getSafeRandomPosition]);

  // Main Game Tick Loop
  useEffect(() => {
    if (isPaused || isGameOver) return;

    // Calculate tick speed based on difficulty & buffs
    let baseSpeed = DIFFICULTY_SPEEDS[settings.difficulty] || 90;
    const now = Date.now();
    const hasSpeedBuff = activeBuffsRef.current.some(
      (b) => b.type === 'SPEED_CHILI' && b.expiresAt > now
    );
    const hasSlowBuff = activeBuffsRef.current.some(
      (b) => b.type === 'FREEZE_BERRY' && b.expiresAt > now
    );

    if (hasSpeedBuff) {
      baseSpeed = Math.round(baseSpeed * 0.55); // 45% faster
    } else if (hasSlowBuff) {
      baseSpeed = Math.round(baseSpeed * 1.55); // 55% slower
    }

    const tick = () => {
      // 1. Move Direction
      const curDir = nextDirectionRef.current;
      setDirection(curDir);

      const curSnake = [...snakeRef.current];
      const head = curSnake[0];
      let newHead: Position = { x: head.x, y: head.y };

      switch (curDir) {
        case 'UP':
          newHead.y -= 1;
          break;
        case 'DOWN':
          newHead.y += 1;
          break;
        case 'LEFT':
          newHead.x -= 1;
          break;
        case 'RIGHT':
          newHead.x += 1;
          break;
      }

      // 2. Wall collision handling
      if (settingsRef.current.wallPassThrough) {
        newHead.x = (newHead.x + GRID_SIZE) % GRID_SIZE;
        newHead.y = (newHead.y + GRID_SIZE) % GRID_SIZE;
      } else {
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          handleGameOver();
          return;
        }
      }

      // 3. Self-collision handling (ignoring the very tip of tail which moves forward this frame)
      for (let i = 0; i < curSnake.length - 1; i++) {
        if (curSnake[i].x === newHead.x && curSnake[i].y === newHead.y) {
          handleGameOver();
          return;
        }
      }

      // 4. Obstacle collision handling
      for (const obs of obstaclesRef.current) {
        if (obs.x === newHead.x && obs.y === newHead.y) {
          handleGameOver();
          return;
        }
      }

      // 5. Magnet effect: pull nearby food items toward newHead if magnet buff active
      const hasMagnet = activeBuffsRef.current.some(
        (b) => b.type === 'MAGNET' && b.expiresAt > Date.now()
      );
      if (hasMagnet) {
        setFoodItems((prev) =>
          prev.map((food) => {
            const dist = Math.abs(food.x - newHead.x) + Math.abs(food.y - newHead.y);
            if (dist > 0 && dist <= 3) {
              const dx = newHead.x > food.x ? 1 : newHead.x < food.x ? -1 : 0;
              const dy = newHead.y > food.y ? 1 : newHead.y < food.y ? -1 : 0;
              return { ...food, x: food.x + dx, y: food.y + dy };
            }
            return food;
          })
        );
      }

      // 6. Check Food Consumption
      const eatenFoodIndex = foodItemsRef.current.findIndex(
        (f) => f.x === newHead.x && f.y === newHead.y
      );

      if (eatenFoodIndex !== -1) {
        const food = foodItemsRef.current[eatenFoodIndex];
        const newFoodList = foodItemsRef.current.filter((_, i) => i !== eatenFoodIndex);

        // Score Multipliers
        const currentComboVal = comboRef.current;
        const speedBonus = hasSpeedBuff ? 2 : 1;
        const earnedScore = food.points * currentComboVal * speedBonus;

        setScore((prev) => prev + earnedScore);
        setFoodEatenCount((prev) => prev + 1);

        // Combo increment
        const nextCombo = Math.min(5, currentComboVal + (food.type === 'GOLDEN_APPLE' ? 2 : 1));
        setCombo(nextCombo);
        setMaxComboThisGame((prev) => Math.max(prev, nextCombo));
        lastComboTickRef.current = Date.now();
        setComboTimeLeft(1);

        // Visual FX
        const color =
          food.type === 'APPLE'
            ? '#ef4444'
            : food.type === 'GOLDEN_APPLE'
            ? '#eab308'
            : food.type === 'SPEED_CHILI'
            ? '#f97316'
            : food.type === 'FREEZE_BERRY'
            ? '#38bdf8'
            : food.type === 'DIET_MUSHROOM'
            ? '#a855f7'
            : '#a855f7';

        addParticles(food.x, food.y, color, 14);
        addFloatingText(
          food.x,
          food.y,
          `+${earnedScore}${nextCombo > 1 ? ` (x${nextCombo})` : ''}`,
          color
        );

        // Sound & Buffs application
        if (food.type === 'APPLE') {
          soundManager.playEat();
        } else if (food.type === 'GOLDEN_APPLE') {
          soundManager.playSpecialEat();
          setGoldenAppleCount((prev) => prev + 1);
        } else if (food.type === 'SPEED_CHILI') {
          soundManager.playSpeedUp();
          setActiveBuffs((prev) => [
            ...prev.filter((b) => b.type !== 'SPEED_CHILI'),
            { type: 'SPEED_CHILI', expiresAt: Date.now() + 6000, durationMs: 6000 },
          ]);
        } else if (food.type === 'FREEZE_BERRY') {
          soundManager.playFreeze();
          setActiveBuffs((prev) => [
            ...prev.filter((b) => b.type !== 'FREEZE_BERRY'),
            { type: 'FREEZE_BERRY', expiresAt: Date.now() + 7000, durationMs: 7000 },
          ]);
        } else if (food.type === 'DIET_MUSHROOM') {
          soundManager.playShrink();
        } else if (food.type === 'MAGNET') {
          soundManager.playSpecialEat();
          setActiveBuffs((prev) => [
            ...prev.filter((b) => b.type !== 'MAGNET'),
            { type: 'MAGNET', expiresAt: Date.now() + 5000, durationMs: 5000 },
          ]);
        }

        // Time Attack bonus
        if (settingsRef.current.mode === 'TIME_ATTACK') {
          setTimeLeft((prev) => prev + (food.type === 'GOLDEN_APPLE' ? 6 : 3));
        }

        // Snake Growth or Diet reduction
        if (food.type === 'DIET_MUSHROOM') {
          // Shrink snake by 2 segments (minimum length 3)
          const newLength = Math.max(3, curSnake.length - 1);
          setSnake([newHead, ...curSnake.slice(0, newLength - 1)]);
        } else {
          // Normal growth: don't pop tail
          setSnake([newHead, ...curSnake]);
        }

        // Spawn new apple if none left
        const hasAppleLeft = newFoodList.some((f) => f.type === 'APPLE');
        if (!hasAppleLeft) {
          const safePos = getSafeRandomPosition(curSnake, obstaclesRef.current, newFoodList);
          newFoodList.push({
            id: `food_${Date.now()}`,
            x: safePos.x,
            y: safePos.y,
            type: 'APPLE',
            points: 10,
            spawnTime: Date.now(),
          });
        }
        setFoodItems(newFoodList);

        // Check achievements
        triggerAchievementCheck(
          scoreRef.current + earnedScore,
          curSnake.length + 1,
          nextCombo,
          food.type === 'GOLDEN_APPLE' ? goldenAppleCount + 1 : goldenAppleCount
        );
      } else {
        // Standard move without food: advance head, drop last tail
        setSnake([newHead, ...curSnake.slice(0, -1)]);

        // Subtle ion thruster spark from tail
        if (Math.random() < 0.4) {
          const tail = curSnake[curSnake.length - 1];
          const activeSkin = SKINS[settingsRef.current.skin] || SKINS.CYBER_VIPER;
          addParticles(tail.x, tail.y, activeSkin.particleColor, 1);
        }
      }

      // Check special items spawn periodically
      checkSpecialItemSpawn();
    };

    const timer = setInterval(tick, baseSpeed);
    return () => clearInterval(timer);
  }, [
    isPaused,
    isGameOver,
    settings.difficulty,
    handleGameOver,
    addParticles,
    addFloatingText,
    getSafeRandomPosition,
    triggerAchievementCheck,
    checkSpecialItemSpawn,
    goldenAppleCount,
  ]);

  const currentSkin = SKINS[settings.skin] || SKINS.NEON;
  const currentHighScore = stats.highestScore[settings.mode] || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3-Zone Top Bar Header */}
      <Header
        soundEnabled={settings.soundEnabled}
        onToggleSound={() =>
          setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onRestart={startNewGame}
      />

      {/* Main Game Stage */}
      <main className="flex-1 w-full max-w-2xl px-4 py-4 md:py-6 flex flex-col items-center justify-start gap-4">
        {/* HUD Scoreboard */}
        <ScoreBoard
          score={score}
          highScore={Math.max(currentHighScore, score)}
          length={snake.length}
          combo={combo}
          comboTimeLeft={comboTimeLeft}
          mode={settings.mode}
          timeLeft={settings.mode === 'TIME_ATTACK' ? timeLeft : undefined}
          activeBuffs={activeBuffs}
          wallPassThrough={settings.wallPassThrough}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused((prev) => !prev)}
        />

        {/* Canvas Game Arena */}
        <GameBoard
          snake={snake}
          direction={direction}
          foodItems={foodItems}
          obstacles={obstacles}
          skin={currentSkin}
          activeBuffs={activeBuffs}
          particles={particles}
          floatingTexts={floatingTexts}
          wallPassThrough={settings.wallPassThrough}
          isPaused={isPaused}
          isGameOver={isGameOver}
          onSwipeDirection={changeDirection}
        />

        {/* Virtual D-Pad / Touch Controls */}
        {settings.touchControlsVisible && (
          <TouchControls
            onDirectionChange={changeDirection}
            vibrationEnabled={settings.vibrationEnabled}
          />
        )}
      </main>

      {/* Modals */}
      {isGameOver && (
        <GameOverModal
          score={score}
          highScore={Math.max(currentHighScore, score)}
          isNewRecord={isNewRecord}
          length={snake.length}
          foodEatenCount={foodEatenCount}
          maxComboThisGame={maxComboThisGame}
          mode={settings.mode}
          newAchievements={newAchievements}
          onRestart={startNewGame}
          onOpenSettings={() => {
            setIsGameOver(false);
            setIsSettingsOpen(true);
          }}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(newSet) => setSettings(newSet)}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {isStatsOpen && (
        <StatsModal
          stats={stats}
          onResetStats={() => {
            const emptyStats: GameStats = {
              gamesPlayed: 0,
              totalFoodEaten: 0,
              maxLengthEver: 3,
              highestScore: { CLASSIC: 0, ARCADE: 0, OBSTACLES: 0, TIME_ATTACK: 0 },
              totalScore: 0,
              achievementsUnlocked: [],
            };
            setStats(emptyStats);
            saveStats(emptyStats);
          }}
          onClose={() => setIsStatsOpen(false)}
        />
      )}

      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}
    </div>
  );
}
