import { Chessboard } from 'react-chessboard';
import { ChessBoardProps } from '../types';
import { useEffect, useState } from 'react';
import { Square } from 'chess.js';

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

  // Validate moves using chess.js before allowing the piece to drop
  const onPieceDrop = (sourceSquare: Square, targetSquare: Square, piece: string) => {
    try {
      // Check if it's a valid move
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        // Only set promotion if it's a pawn moving to the last rank
        promotion: piece.toLowerCase().includes('p') && 
          ((piece[0] === 'w' && targetSquare[1] === '8') || 
           (piece[0] === 'b' && targetSquare[1] === '1')) 
          ? 'q' 
          : undefined
      });

      // If move is invalid, chess.js will return null
      if (move === null) return false;

      // Undo the move since we're handling it through the click handler
      game.undo();
      
      return true;
    } catch (error) {
      console.error('Error validating move:', error);
      return false;
    }
  };

  // Check if a move results in a pawn promotion
  const onPromotionCheck = (sourceSquare: Square, targetSquare: Square, piece: string) => {
    return (
      ((piece === "wP" && sourceSquare[1] === "7" && targetSquare[1] === "8") || 
       (piece === "bP" && sourceSquare[1] === "2" && targetSquare[1] === "1")) && 
      Math.abs(sourceSquare.charCodeAt(0) - targetSquare.charCodeAt(0)) <= 1
    );
  };

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
          onPieceDrop={onPieceDrop}
          onPromotionCheck={onPromotionCheck}
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