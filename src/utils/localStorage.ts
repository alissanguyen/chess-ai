import { GameStats, GameState } from '../types';

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

export const loadGameState = (): GameState | null => {
  const gameState = localStorage.getItem('chessGameState');
  if (gameState) {
    const parsed = JSON.parse(gameState);
    // Check if game state is older than a day
    if (Date.now() - parsed.lastUpdated > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('chessGameState');
      return null;
    }
    return parsed;
  }
  return null;
};

export const saveGameState = (fen: string, moves: any[]): void => {
  // Store only the essential move information
  const simplifiedMoves = moves.map(move => ({
    from: move.from,
    to: move.to,
    promotion: move.promotion || undefined,
    color: move.color,
    piece: move.piece,
    flags: move.flags,
    san: move.san,
    lan: move.lan,
    before: move.before,
    after: move.after
  }));

  const gameState: GameState = {
    fen,
    moves: simplifiedMoves,
    lastUpdated: Date.now()
  };
  localStorage.setItem('chessGameState', JSON.stringify(gameState));
};