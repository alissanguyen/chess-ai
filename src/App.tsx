import { useState, useCallback, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { ChessBoard } from './components/ChessBoard';
import { GameOverModal } from './components/GameOverModal';
import { UsernameModal } from './components/UsernameModal';
import { GameStatus } from './components/GameStatus';
import { GameHeader } from './components/GameHeader';
import { loadStats, saveStats } from './utils/localStorage';
import { GameStats } from './types';

function App() {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState<Square | ''>('');
  const [rightClickedSquares, setRightClickedSquares] = useState<{ [key: string]: { background: string } | undefined }>({});
  const [moveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw' | null>(null);
  const [stats, setStats] = useState<GameStats | null>(loadStats());
  const [showUsernameModal, setShowUsernameModal] = useState(!stats);

  useEffect(() => {
    if (stats) {
      saveStats(stats);
    }
  }, [stats]);

  const handleUsernameSubmit = (username: string) => {
    setStats({
      username,
      wins: 0,
      losses: 0,
      draws: 0,
      lastUpdated: Date.now()
    });
    setShowUsernameModal(false);
  };

  function safeGameMutate(modify: (game: Chess) => void) {
    setGame((g) => {
      const update = new Chess(g.fen());
      modify(update);
      return update;
    });
  }

  const makeAIMove = useCallback(() => {
    const possibleMoves = game.moves();
    if (game.isGameOver()) {
      setGameOver(true);
      if (game.isDraw()) {
        setGameResult('draw');
        setStats(prev => prev ? {
          ...prev,
          draws: prev.draws + 1,
          lastUpdated: Date.now()
        } : null);
      } else {
        setGameResult(game.turn() === 'b' ? 'win' : 'loss');
        setStats(prev => prev ? {
          ...prev,
          [game.turn() === 'b' ? 'wins' : 'losses']: prev[game.turn() === 'b' ? 'wins' : 'losses'] + 1,
          lastUpdated: Date.now()
        } : null);
      }
      return;
    }

    if (possibleMoves.length === 0) {
      setGameOver(true);
      return;
    }

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const move = possibleMoves[randomIndex];
    
    safeGameMutate((game) => {
      game.move(move);
    });
  }, [game]);

  useEffect(() => {
    if (game.turn() === 'b') {
      setTimeout(makeAIMove, 300);
    }
  }, [game, makeAIMove]);

  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true
    });
    if (moves.length === 0) {
      setOptionSquares({});
      return false;
    }

    const newSquares: { [key: string]: { background: string } } = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(255,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    };
    setOptionSquares(newSquares);
    return true;
  }

  function onSquareClick(square: Square) {
    if (game.turn() === 'b' || gameOver) return;

    setRightClickedSquares({});

    if (!moveFrom) {
      const hasMoves = getMoveOptions(square);
      if (hasMoves) setMoveFrom(square);
      return;
    }

    if (moveFrom) {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: moveFrom,
        to: square,
        promotion: 'q'
      });
      
      if (move === null) {
        const hasMoves = getMoveOptions(square);
        if (hasMoves) setMoveFrom(square);
        return;
      }

      safeGameMutate((game) => {
        game.move(move);
      });

      setMoveFrom('');
      setOptionSquares({});
    }
  }

  function onSquareRightClick(square: Square) {
    const colour = 'rgba(0, 0, 255, 0.4)';
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]: {
        background: rightClickedSquares[square]?.background === colour ? '' : colour,
      },
    });
  }

  function resetGame() {
    safeGameMutate((game) => {
      game.reset();
    });
    setGameOver(false);
    setGameResult(null);
    setMoveFrom('');
    setRightClickedSquares({});
    setOptionSquares({});
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center py-8 px-2 sm:px-4">
      {showUsernameModal && (
        <UsernameModal onSubmit={handleUsernameSubmit} />
      )}

      <div className="bg-white py-8 px-2 sm:px-8 rounded-xl shadow-2xl w-full max-w-3xl">
        <GameHeader stats={stats} onReset={resetGame} />

        <div className="relative w-full">
          <ChessBoard
            game={game}
            onSquareClick={onSquareClick}
            onSquareRightClick={onSquareRightClick}
            moveSquares={moveSquares}
            optionSquares={optionSquares}
            rightClickedSquares={rightClickedSquares}
          />
          
          {gameOver && (
            <GameOverModal gameResult={gameResult} onReset={resetGame} />
          )}
        </div>

        <GameStatus isCheck={game.isCheck()} turn={game.turn()} />
      </div>
    </div>
  );
}

export default App;