import { GameStats } from '../types';

export const loadStats = (): GameStats | null => {
  const stats = localStorage.getItem('chessStats');
  if (stats) {
    const parsed = JSON.parse(stats);
    // Check if stats are older than a month
    if (Date.now() - parsed.lastUpdated > 30 * 24 * 60 * 60 * 1000) {
      localStorage.removeItem('chessStats');
      return null;
    }
    return parsed;
  }
  return null;
};

export const saveStats = (stats: GameStats): void => {
  localStorage.setItem('chessStats', JSON.stringify(stats));
};