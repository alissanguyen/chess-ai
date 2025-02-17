import { Chessboard } from 'react-chessboard';
import { ChessBoardProps } from '../types';
import { useEffect, useState } from 'react';

export function ChessBoard({
  game,
  onSquareClick,
  onSquareRightClick,
  moveSquares,
  optionSquares,
  rightClickedSquares
}: ChessBoardProps) {
  const [boardWidth, setBoardWidth] = useState(Math.min(600, window.innerWidth - 64));

  useEffect(() => {
    function handleResize() {
      const container = document.querySelector('.chess-container');
      if (container) {
        const containerWidth = container.clientWidth;
        // Subtract padding and ensure it's a number divisible by 8 for perfect squares
        const newWidth = Math.floor((containerWidth - 32) / 8) * 8;
        setBoardWidth(Math.min(600, newWidth));
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size
    
    // Additional call after a short delay to ensure proper sizing
    setTimeout(handleResize, 100);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="chess-container relative w-full">
      <div className="relative rounded-lg overflow-hidden shadow-xl touch-none mx-auto" style={{ width: `${boardWidth}px` }}>
        <Chessboard
          id="PlayVsAI"
          animationDuration={200}
          position={game.fen()}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          customBoardStyle={{
            borderRadius: '8px',
          }}
          customSquareStyles={{
            ...moveSquares,
            ...optionSquares,
            ...rightClickedSquares,
          }}
          boardWidth={boardWidth}
          customDarkSquareStyle={{ backgroundColor: '#b58863' }}
          customLightSquareStyle={{ backgroundColor: '#f0d9b5' }}
        />
      </div>
    </div>
  );
}