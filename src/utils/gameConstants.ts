import { Difficulty, GameMode, GameSettings, GameStats, Skin, SkinId, Achievement } from '../types/game';

export const GRID_SIZE = 24; // 24 x 24 board

export const DIFFICULTY_SPEEDS: Record<Difficulty, number> = {
  EASY: 125,     // ms per tick
  NORMAL: 90,
  HARD: 68,
  EXTREME: 48,
};

export const SKINS: Record<SkinId, Skin> = {
  CYBER_VIPER: {
    id: 'CYBER_VIPER',
    name: '사이버 바이퍼',
    theme: '나이트시티 네온',
    description: '일렉트릭 시안과 네온 마젠타 코어가 빛나는 사이버 개조 스네이크',
    primaryColor: '#00f0ff',       // Neon Cyan
    secondaryColor: '#0f172a',     // Dark Carbon Armor
    coreGlowColor: 'rgba(0, 240, 255, 0.75)',
    visorColor: '#ff0055',        // Hot Magenta Visor
    circuitColor: '#00f0ff',
    particleColor: '#00f0ff',
  },
  NEO_TOKYO: {
    id: 'NEO_TOKYO',
    name: '네오 도쿄',
    theme: '일렉트릭 퍼플 & 골드',
    description: '심야 메트로폴리스의 자줏빛 홀로그램과 레이저 골드 회로',
    primaryColor: '#c084fc',       // Electric Purple
    secondaryColor: '#1e1b4b',     // Deep Violet Chassis
    coreGlowColor: 'rgba(192, 132, 252, 0.75)',
    visorColor: '#facc15',        // Laser Gold
    circuitColor: '#e879f9',
    particleColor: '#c084fc',
  },
  MATRIX_RUNNER: {
    id: 'MATRIX_RUNNER',
    name: '매트릭스 러너',
    theme: '디지털 바이오스 그린',
    description: '암호화된 녹색 터미널 데이터 스트림과 고전압 인젝터',
    primaryColor: '#22c55e',       // Phosphor Green
    secondaryColor: '#052e16',     // Deep Matrix Black
    coreGlowColor: 'rgba(34, 197, 94, 0.8)',
    visorColor: '#4ade80',        // Bright Green Optics
    circuitColor: '#86efac',
    particleColor: '#22c55e',
  },
  BLADE_PHANTOM: {
    id: 'BLADE_PHANTOM',
    name: '블레이드 팬텀',
    theme: '크림슨 프로토콜',
    description: '강렬한 붉은 레이저 블레이드와 경고 앰버 코어의 암살 기체',
    primaryColor: '#ff003c',       // Laser Red
    secondaryColor: '#18181b',     // Stealth Zinc
    coreGlowColor: 'rgba(255, 0, 60, 0.75)',
    visorColor: '#fbbf24',        // Warning Amber
    circuitColor: '#f43f5e',
    particleColor: '#ff003c',
  },
  GHOST_SHELL: {
    id: 'GHOST_SHELL',
    name: '고스트 인 더 쉘',
    theme: '크로뮴 티타늄 & 아이스',
    description: '반투명한 홀로그래픽 크리스털 외골격과 초전도 아이스 빔',
    primaryColor: '#38bdf8',       // Ice Blue
    secondaryColor: '#0f172a',     // Titanium Slate
    coreGlowColor: 'rgba(56, 189, 248, 0.8)',
    visorColor: '#ffffff',        // Pure White Laser Visor
    circuitColor: '#7dd3fc',
    particleColor: '#38bdf8',
  },
  // Backward compatibility aliases
  NEON: {
    id: 'CYBER_VIPER',
    name: '사이버 바이퍼',
    theme: '나이트시티 네온',
    description: '일렉트릭 시안과 네온 마젠타 코어가 빛나는 사이버 개조 스네이크',
    primaryColor: '#00f0ff',
    secondaryColor: '#0f172a',
    coreGlowColor: 'rgba(0, 240, 255, 0.75)',
    visorColor: '#ff0055',
    circuitColor: '#00f0ff',
    particleColor: '#00f0ff',
  },
  RETRO: {
    id: 'MATRIX_RUNNER',
    name: '매트릭스 러너',
    theme: '디지털 바이오스 그린',
    description: '암호화된 녹색 터미널 데이터 스트림과 고전압 인젝터',
    primaryColor: '#22c55e',
    secondaryColor: '#052e16',
    coreGlowColor: 'rgba(34, 197, 94, 0.8)',
    visorColor: '#4ade80',
    circuitColor: '#86efac',
    particleColor: '#22c55e',
  },
};

export const INITIAL_SETTINGS: GameSettings = {
  mode: 'CLASSIC',
  difficulty: 'NORMAL',
  skin: 'CYBER_VIPER',
  wallPassThrough: true, // Default to wrap-around for fluid casual play, can toggle to solid
  soundEnabled: true,
  vibrationEnabled: true,
  touchControlsVisible: true,
};

export const INITIAL_STATS: GameStats = {
  gamesPlayed: 0,
  totalFoodEaten: 0,
  maxLengthEver: 3,
  highestScore: {
    CLASSIC: 0,
    ARCADE: 0,
    OBSTACLES: 0,
    TIME_ATTACK: 0,
  },
  totalScore: 0,
  achievementsUnlocked: [],
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'FIRST_BITE',
    title: '첫 식사',
    description: '사과를 처음으로 1개 먹었습니다.',
    icon: '🍎',
    unlocked: false,
  },
  {
    id: 'GROWTH_SPURT',
    title: '쑥쑥 자라요',
    description: '지렁이 길이를 15 이상으로 늘렸습니다.',
    icon: '🌱',
    unlocked: false,
  },
  {
    id: 'GIANT_WORM',
    title: '거대 지렁이',
    description: '지렁이 길이를 35 이상으로 늘렸습니다.',
    icon: '🐉',
    unlocked: false,
  },
  {
    id: 'COMBO_MASTER',
    title: '콤보 마스터',
    description: '연속 5회 이상 콤보를 달성했습니다.',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'GOLDEN_LUCK',
    title: '황금빛 행운',
    description: '황금 사과를 3회 이상 획득했습니다.',
    icon: '🌟',
    unlocked: false,
  },
  {
    id: 'SCORE_500',
    title: '프로 스네이커',
    description: '한 게임에서 500점 이상을 달성했습니다.',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'SCORE_1000',
    title: '지렁이의 전설',
    description: '한 게임에서 1,000점 이상을 달성했습니다.',
    icon: '👑',
    unlocked: false,
  },
];

// Pre-defined obstacle maps for 'OBSTACLES' mode
export const GENERATE_OBSTACLES = (gridSize: number): Array<{ x: number; y: number }> => {
  const obstacles: Array<{ x: number; y: number }> = [];
  const mid = Math.floor(gridSize / 2);
  
  // 4 corner barriers (L-shape small barriers)
  // Top-Left
  obstacles.push({ x: 4, y: 4 }, { x: 5, y: 4 }, { x: 4, y: 5 });
  // Top-Right
  obstacles.push({ x: gridSize - 5, y: 4 }, { x: gridSize - 6, y: 4 }, { x: gridSize - 5, y: 5 });
  // Bottom-Left
  obstacles.push({ x: 4, y: gridSize - 5 }, { x: 5, y: gridSize - 5 }, { x: 4, y: gridSize - 6 });
  // Bottom-Right
  obstacles.push({ x: gridSize - 5, y: gridSize - 5 }, { x: gridSize - 6, y: gridSize - 5 }, { x: gridSize - 5, y: gridSize - 6 });
  
  // Center small cross islands
  obstacles.push(
    { x: mid - 3, y: mid - 3 },
    { x: mid + 3, y: mid - 3 },
    { x: mid - 3, y: mid + 3 },
    { x: mid + 3, y: mid + 3 }
  );

  return obstacles;
};
