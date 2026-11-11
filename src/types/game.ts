export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Position {
  x: number;
  y: number;
}

export type GameMode = 'CLASSIC' | 'ARCADE' | 'OBSTACLES' | 'TIME_ATTACK';

export type Difficulty = 'EASY' | 'NORMAL' | 'HARD' | 'EXTREME';

export type FoodType = 
  | 'APPLE'          // Standard food (+10)
  | 'GOLDEN_APPLE'   // High score (+50, +2 combo)
  | 'SPEED_CHILI'    // Fast speed + 2x multiplier for 6s
  | 'FREEZE_BERRY'   // Slow speed for 7s
  | 'DIET_MUSHROOM'  // Shrinks body by 2 segments (+25)
  | 'MAGNET';        // Pulls items within 4 tiles for 5s

export interface FoodItem {
  id: string;
  x: number;
  y: number;
  type: FoodType;
  points: number;
  expiresAt?: number; // timestamp when it despawns (for special items)
  spawnTime: number;
}

export interface ActiveBuff {
  type: FoodType;
  expiresAt: number;
  durationMs: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  alpha: number;
  scale: number;
}

export type SkinId = 
  | 'CYBER_VIPER' 
  | 'NEO_TOKYO' 
  | 'MATRIX_RUNNER' 
  | 'BLADE_PHANTOM' 
  | 'GHOST_SHELL'
  | 'NEON' 
  | 'RETRO';

export interface Skin {
  id: SkinId;
  name: string;
  theme: string;
  description: string;
  primaryColor: string;      // Main armor / head color
  secondaryColor: string;    // Armor plate secondary
  coreGlowColor: string;     // Inner plasma glow
  visorColor: string;        // Cyber visor / scanner laser
  circuitColor: string;      // Circuit trace lines
  particleColor: string;     // Thruster / impact particles
}

export interface GameSettings {
  mode: GameMode;
  difficulty: Difficulty;
  skin: SkinId;
  wallPassThrough: boolean; // Wrap around vs Hit wall
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  touchControlsVisible: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  totalFoodEaten: number;
  maxLengthEver: number;
  highestScore: Record<GameMode, number>;
  totalScore: number;
  achievementsUnlocked: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
