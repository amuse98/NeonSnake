import { GameSettings, GameStats } from '../types/game';
import { INITIAL_SETTINGS, INITIAL_STATS } from './gameConstants';

const SETTINGS_KEY = 'neon_snake_settings_v1';
const STATS_KEY = 'neon_snake_stats_v1';

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return INITIAL_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_SETTINGS, ...parsed };
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return INITIAL_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATS,
      ...parsed,
      highestScore: {
        ...INITIAL_STATS.highestScore,
        ...(parsed.highestScore || {}),
      },
      achievementsUnlocked: Array.isArray(parsed.achievementsUnlocked)
        ? parsed.achievementsUnlocked
        : [],
    };
  } catch {
    return INITIAL_STATS;
  }
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}
