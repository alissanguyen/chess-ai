import { Chessboard } from 'react-chessboard';
import { ChessBoardProps } from '../types';

export function ChessBoard({
  game,
  onSquareClick,
  onSquareRightClick,
  moveSquares,
  optionSquares,
  rightClickedSquares
}: ChessBoardProps) {
  return (
    <div className="relative rounded-lg overflow-hidden shadow-xl">
      <Chessboard
        id="PlayVsAI"
        animationDuration={200}
        position={game.fen()}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        customBoardStyle={{
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        }}
        customSquareStyles={{
          ...moveSquares,
          ...optionSquares,
          ...rightClickedSquares,
        }}
        boardWidth={Math.min(600, window.innerWidth - 64)}
        customDarkSquareStyle={{ backgroundColor: '#b58863' }}
        customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
      />
    </div>
  );
}