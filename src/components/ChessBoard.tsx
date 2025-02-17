import { Chessboard } from 'react-chessboard';
import { ChessBoardProps } from '../types';
import { useEffect, useState } from 'react';

export function ChessBoard({
  game,
  onSquareClick,
  onSquareRightClick,
  moveSquares,
  optionSquares,
  rightClickedSquares,
  isReplaying,
  isDarkMode
}: ChessBoardProps) {
  const [boardWidth, setBoardWidth] = useState(Math.min(600, window.innerWidth));

  useEffect(() => {
    function handleResize() {
      const container = document.querySelector('.chess-container');
      if (container) {
        const containerWidth = container.clientWidth;
        const newWidth = Math.floor(containerWidth / 8) * 8;
        setBoardWidth(Math.min(600, newWidth));
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    setTimeout(handleResize, 100);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="chess-container relative w-full">
      <div className="relative overflow-hidden touch-none mx-auto" style={{ width: `${boardWidth}px` }}>
        <Chessboard
          id="PlayVsAI"
          animationDuration={200}
          position={game.fen()}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: isDarkMode 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
          customSquareStyles={{
            ...moveSquares,
            ...optionSquares,
            ...rightClickedSquares,
          }}
          boardWidth={boardWidth}
          customDarkSquareStyle={{ 
            backgroundColor: '#b58863'
          }}
          customLightSquareStyle={{ 
            backgroundColor: '#f0d9b5'
          }}
        />
      </div>
    </div>
  );
}