import { useState, useCallback, useEffect } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { ChessBoard } from './components/ChessBoard';
import { GameOverModal } from './components/GameOverModal';
import { UsernameModal } from './components/UsernameModal';
import { GameStatus } from './components/GameStatus';
import { GameHeader } from './components/GameHeader';
import { MoveLog } from './components/MoveLog';
import { loadStats, saveStats, loadGameState, saveGameState } from './utils/localStorage';
import { GameStats } from './types';

function App() {
  const [game, setGame] = useState(new Chess());
  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [rightClickedSquares, setRightClickedSquares] = useState<{ [key: string]: { background: string } }>({});
  const [moveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw' | null>(null);
  const [stats, setStats] = useState<GameStats | null>(loadStats());
  const [showUsernameModal, setShowUsernameModal] = useState(!stats);
  const [moves, setMoves] = useState<Move[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('chessTheme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [playerIsWhite, setPlayerIsWhite] = useState(() => {
    const saved = localStorage.getItem('chessPlayerColor');
    return saved ? saved === 'white' : true;
  });

  useEffect(() => {
    localStorage.setItem('chessTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('chessPlayerColor', playerIsWhite ? 'white' : 'black');
  }, [playerIsWhite]);

  useEffect(() => {
    const savedState = loadGameState();
    if (savedState) {
      setIsReplaying(true);
      const chess = new Chess();
      const savedMoves: Move[] = [];
      
      let currentMove = 0;
      const replayInterval = setInterval(() => {
        if (currentMove < savedState.moves.length) {
          try {
            const move = chess.move(savedState.moves[currentMove]);
            if (move) {
              savedMoves.push(move);
              setGame(new Chess(chess.fen()));
              setMoves(savedMoves.slice());
            }
          } catch (error) {
            console.error('Error replaying move:', error);
          }
          currentMove++;
        } else {
          clearInterval(replayInterval);
          setIsReplaying(false);
        }
      }, 300);

      return () => clearInterval(replayInterval);
    }
  }, []);

  useEffect(() => {
    if (!isReplaying && moves.length > 0) {
      saveGameState(game.fen(), moves);
    }
  }, [game, moves, isReplaying]);

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


  const makeAIMove = useCallback(() => {
    if (isReplaying) return;

    const possibleMoves = game.moves({ verbose: true });
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
        const playerWon = (playerIsWhite && game.turn() === 'b') || (!playerIsWhite && game.turn() === 'w');
        setGameResult(playerWon ? 'win' : 'loss');
        setStats(prev => prev ? {
          ...prev,
          [playerWon ? 'wins' : 'losses']: prev[playerWon ? 'wins' : 'losses'] + 1,
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
    
    try {
      const newGame = new Chess(game.fen());
      const result = newGame.move(move);
      if (result) {
        setGame(newGame);
        setMoves(prev => [...prev, result]);
      }
    } catch (error) {
      console.error('Error making AI move:', error);
    }
  }, [game, isReplaying, playerIsWhite]);

  useEffect(() => {
    const isPlayerTurn = (playerIsWhite && game.turn() === 'w') || (!playerIsWhite && game.turn() === 'b');
    if (!isPlayerTurn && !isReplaying) {
      setTimeout(makeAIMove, 300);
    }
  }, [game, makeAIMove, isReplaying, playerIsWhite]);

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
    const isPlayerTurn = (playerIsWhite && game.turn() === 'w') || (!playerIsWhite && game.turn() === 'b');
    if (!isPlayerTurn || gameOver || isReplaying) return;

    setRightClickedSquares({});

    if (!moveFrom) {
      const hasMoves = getMoveOptions(square);
      if (hasMoves) setMoveFrom(square);
      return;
    }

    try {
      const newGame = new Chess(game.fen());
      const result = newGame.move({
        from: moveFrom,
        to: square,
        promotion: 'q'
      });

      if (result) {
        setGame(newGame);
        setMoves(prev => [...prev, result]);
        setMoveFrom(null);
        setOptionSquares({});
      } else {
        const hasMoves = getMoveOptions(square);
        if (hasMoves) setMoveFrom(square);
      }
    } catch (error) {
      console.error('Error making move:', error);
      setMoveFrom(null);
      setOptionSquares({});
    }
  }

  function onSquareRightClick(square: Square) {
    if (isReplaying) return;
    
    const colour = 'rgba(0, 0, 255, 0.4)';
    setRightClickedSquares({
      ...rightClickedSquares,
      [square]: {
        background: rightClickedSquares[square]?.background === colour ? '' : colour,
      },
    });
  }

  function resetGame() {
    localStorage.removeItem('chessGameState');
    const newGame = new Chess();
    setGame(newGame);
    setGameOver(false);
    setGameResult(null);
    setMoveFrom(null);
    setRightClickedSquares({});
    setOptionSquares({});
    setMoves([]);
    setPlayerIsWhite(prev => !prev);
  }

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-gradient-to-br from-blue-50 to-white'} flex items-center justify-center px-2 py-4 sm:p-4`}>
      {showUsernameModal && (
        <UsernameModal onSubmit={handleUsernameSubmit} isDarkMode={isDarkMode} />
      )}

      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 sm:p-6 rounded-none sm:rounded-xl shadow-2xl w-full max-w-7xl`}>
        <GameHeader 
          stats={stats} 
          onReset={resetGame} 
          isDarkMode={isDarkMode} 
          onThemeToggle={toggleTheme}
          playerIsWhite={playerIsWhite}
        />

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="flex-1">
            <div className="relative w-full">
              <ChessBoard
                game={game}
                onSquareClick={onSquareClick}
                onSquareRightClick={onSquareRightClick}
                moveSquares={moveSquares}
                optionSquares={optionSquares}
                rightClickedSquares={rightClickedSquares}
                isReplaying={isReplaying}
                isDarkMode={isDarkMode}
                boardOrientation={playerIsWhite ? 'white' : 'black'}
              />
              
              {gameOver && (
                <GameOverModal gameResult={gameResult} onReset={resetGame} isDarkMode={isDarkMode} />
              )}
            </div>

            <GameStatus 
              isCheck={game.isCheck()} 
              turn={game.turn()} 
              isReplaying={isReplaying}
              isDarkMode={isDarkMode}
              playerIsWhite={playerIsWhite}
            />
          </div>

          <div className="lg:w-80">
            <MoveLog 
              moves={moves} 
              currentPosition={game.fen()} 
              isDarkMode={isDarkMode} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;