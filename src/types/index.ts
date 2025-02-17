import { Chess, Square } from 'chess.js';

export interface GameStats {
  username: string;
  wins: number;
  losses: number;
  draws: number;
  lastUpdated: number;
}

export interface ChessBoardProps {
  game: Chess;
  onSquareClick: (square: Square) => void;
  onSquareRightClick: (square: Square) => void;
  moveSquares: object;
  optionSquares: object;
  rightClickedSquares: object;
}

export interface GameOverModalProps {
  gameResult: 'win' | 'loss' | 'draw' | null;
  onReset: () => void;
}

export interface UsernameModalProps {
  onSubmit: (username: string) => void;
}

export interface GameStatusProps {
  isCheck: boolean;
  turn: string;
}

export interface GameHeaderProps {
  stats: GameStats | null;
  onReset: () => void;
}