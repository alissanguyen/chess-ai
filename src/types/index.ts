import { Chess, Square, Move } from 'chess.js';
import { User } from '@supabase/supabase-js';

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

export interface Profile {
  username: string;
  avatar_color: string;
  win_count: number;
  loss_count: number;
  draw_count: number;
  longest_win_streak: number;
  current_win_streak: number;
  total_matches: number;
  win_rate: number;
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
  boardOrientation: 'white' | 'black';
}

export interface GameOverModalProps {
  gameResult: 'win' | 'loss' | 'draw' | null;
  onReset: () => void;
  isDarkMode: boolean;
}

export interface GameStatusProps {
  isCheck: boolean;
  turn: string;
  isReplaying?: boolean;
  isDarkMode: boolean;
  playerIsWhite: boolean;
}

export interface GameHeaderProps {
  stats: GameStats | null;
  onReset: () => void;
  isDarkMode: boolean;
  onThemeToggle: () => void;
  playerIsWhite: boolean;
  user: User | null;
  profile: Profile | null;
  onSignOut: () => void;
}

export interface MoveLogProps {
  moves: Move[];
  currentPosition: string;
  isDarkMode: boolean;
}

export interface UsernameModalProps {
  onSubmit: (username: string) => void;
  isDarkMode: boolean;
}