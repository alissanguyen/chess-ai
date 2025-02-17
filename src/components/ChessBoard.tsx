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
  isDarkMode,
  boardOrientation
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
      <div 
        className={`relative overflow-hidden touch-none mx-auto rounded-lg ${
          isDarkMode 
            ? 'shadow-[0_0_15px_rgba(0,0,0,0.3),0_0_5px_rgba(0,0,0,0.3)_inset]' 
            : 'shadow-[0_0_20px_rgba(0,0,0,0.1),0_0_5px_rgba(0,0,0,0.1)_inset]'
        }`}
        style={{ 
          width: `${boardWidth}px`,
          background: isDarkMode 
            ? 'linear-gradient(45deg, #2c2c2c, #1a1a1a)' 
            : 'linear-gradient(45deg, #e6e6e6, #f5f5f5)',
          padding: '12px',
          border: isDarkMode 
            ? '1px solid rgba(255,255,255,0.1)' 
            : '1px solid rgba(0,0,0,0.1)'
        }}
      >
        <Chessboard
          id="PlayVsAI"
          animationDuration={200}
          position={game.fen()}
          onSquareClick={onSquareClick}
          onSquareRightClick={onSquareRightClick}
          boardOrientation={boardOrientation}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: isDarkMode 
              ? '0 4px 12px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)' 
              : '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
          }}
          customSquareStyles={{
            ...moveSquares,
            ...optionSquares,
            ...rightClickedSquares,
          }}
          boardWidth={boardWidth - 24} // Adjust for padding
          customDarkSquareStyle={{ 
            backgroundColor: isDarkMode ? '#755b47' : '#b58863',
            transition: 'background-color 0.2s ease'
          }}
          customLightSquareStyle={{ 
            backgroundColor: isDarkMode ? '#d3b594' : '#f0d9b5',
            transition: 'background-color 0.2s ease'
          }}
        />
      </div>
    </div>
  );
}