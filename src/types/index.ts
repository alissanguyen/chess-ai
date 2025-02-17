import { Chess, Square, Move } from 'chess.js';

export interface GameStats {
  username: string;
  wins: number;
  losses: number;
  draws: number;
  lastUpdated: number;
}

export interface GameState {
  fen: string;
  moves: Move[];
  lastUpdated: number;
}

export interface ChessBoardProps {
  game: Chess;
  onSquareClick: (square: Square) => void;
  onSquareRightClick: (square: Square) => void;
  moveSquares: object;
  optionSquares: object;
  rightClickedSquares: object;
  isReplaying?: boolean;
  isDarkMode: boolean;
}

export interface GameOverModalProps {
  gameResult: 'win' | 'loss' | 'draw' | null;
  onReset: () => void;
  isDarkMode: boolean;
}

export interface UsernameModalProps {
  onSubmit: (username: string) => void;
  isDarkMode: boolean;
}

export interface GameStatusProps {
  isCheck: boolean;
  turn: string;
  isReplaying?: boolean;
  isDarkMode: boolean;
}

export interface GameHeaderProps {
  stats: GameStats | null;
  onReset: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export interface MoveLogProps {
  moves: Move[];
  currentPosition: string;
  isDarkMode: boolean;
}