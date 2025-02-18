import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { User } from '@supabase/supabase-js';
import { ChessBoard } from './components/ChessBoard';
import { GameOverModal } from './components/GameOverModal';
import { ProfileSetup } from './components/ProfileSetup';
import { GameStatus } from './components/GameStatus';
import { GameHeader } from './components/GameHeader';
import { MoveLog } from './components/MoveLog';
import { WelcomeModal } from './components/WelcomeModal';
import { SignUpPromptModal } from './components/SignUpPromptModal';
import { Footer } from './components/Footer';
import { loadStats, saveStats, saveGameState } from './utils/localStorage';
import { GameStats } from './types';
import { supabase } from './lib/supabase';

interface Profile {
  username: string;
  avatar_color: string;
  win_count: number;
  loss_count: number;
  draw_count: number;
  longest_win_streak: number;
  total_matches: number;
  win_rate: number;
}

// Memoize initial chess instance
const createInitialGame = () => new Chess();

function App() {
  // Use useRef for values that shouldn't trigger re-renders
  const gameRef = useRef(createInitialGame());
  const [gameVersion, setGameVersion] = useState(0); // Used to force re-renders when needed
  const saveTimeoutRef = useRef<number | null>(null);
  const aiMoveTimeoutRef = useRef<number | null>(null);

  const [moveFrom, setMoveFrom] = useState<Square | null>(null);
  const [rightClickedSquares, setRightClickedSquares] = useState<{ [key: string]: { background: string } }>({});
  const [moveSquares] = useState({});
  const [optionSquares, setOptionSquares] = useState({});
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'loss' | 'draw' | null>(null);
  const [stats, setStats] = useState<GameStats | null>(loadStats());
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showSignUpPrompt, setShowSignUpPrompt] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [moves, setMoves] = useState<Move[]>([]);
  const [isReplaying] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('chessTheme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [playerIsWhite, setPlayerIsWhite] = useState(() => {
    const saved = localStorage.getItem('chessPlayerColor');
    return saved ? saved === 'white' : true;
  });

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (aiMoveTimeoutRef.current) clearTimeout(aiMoveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setIsGuestMode(false);
        setShowWelcomeModal(true);
        setShowSignUpPrompt(false);
        localStorage.removeItem('chessGameState');
        localStorage.removeItem('chessStats');
        resetGame();
      } else if (event === 'SIGNED_IN') {
        setUser(session?.user ?? null);
        setShowWelcomeModal(false);
        setIsGuestMode(false);
        setShowSignUpPrompt(false);
        
        // Keep the current game state when transitioning from guest to signed in
        const currentGameState = {
          fen: gameRef.current.fen(),
          moves: moves
        };
        
        // Save the current game state for the new user
        if (currentGameState.moves.length > 0) {
          saveGameState(currentGameState.fen, currentGameState.moves);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [moves]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        setProfileLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('username, avatar_color, win_count, loss_count, draw_count, longest_win_streak, total_matches, win_rate')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('chessTheme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('chessPlayerColor', playerIsWhite ? 'white' : 'black');
  }, [playerIsWhite]);

  // Optimized game state saving
  const saveGameStateDebounced = useCallback((fen: string, moves: Move[]) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      requestAnimationFrame(() => {
        saveGameState(fen, moves);
        saveTimeoutRef.current = null;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    if (!isReplaying && moves.length > 0 && user) {
      saveGameStateDebounced(gameRef.current.fen(), moves);
    }

    if (isGuestMode && !showSignUpPrompt && moves.length >= 20) {
      setShowSignUpPrompt(true);
    }
  }, [moves, saveGameStateDebounced, isGuestMode, showSignUpPrompt, user, isReplaying]);

  useEffect(() => {
    if (stats) {
      saveStats(stats);
    }
  }, [stats]);

  const handleSignOut = async () => {
    try {
      // First clear local storage
      localStorage.removeItem('chessGameState');
      localStorage.removeItem('chessStats');
      localStorage.removeItem('supabase.auth.token');

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Reset all state
      setUser(null);
      setProfile(null);
      setIsGuestMode(false);
      setShowWelcomeModal(true);
      setShowSignUpPrompt(false);
      resetGame();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      // reset state
      setUser(null);
      setProfile(null);
      setIsGuestMode(false);
      setShowWelcomeModal(true);
      setShowSignUpPrompt(false);
      localStorage.removeItem('chessGameState');
      localStorage.removeItem('chessStats'); 
      
      resetGame();
    }
  };

  const handlePlayAsGuest = () => {
    setIsGuestMode(true);
    setShowWelcomeModal(false);
    setShowSignUpPrompt(false);

    if (!stats) {
      const guestStats: GameStats = {
        username: 'Guest',
        wins: 0,
        losses: 0,
        draws: 0,
        lastUpdated: Date.now()
      };
      setStats(guestStats);
      saveStats(guestStats);
    }
  };

  const updateUserStats = async (result: 'win' | 'loss' | 'draw') => {
    if (!user) {
      // Handle guest mode stats
      const newStats = stats || {
        username: 'Guest',
        wins: 0,
        losses: 0,
        draws: 0,
        lastUpdated: Date.now()
      };

      if (result === 'win') newStats.wins++;
      else if (result === 'loss') newStats.losses++;
      else newStats.draws++;

      newStats.lastUpdated = Date.now();
      setStats(newStats);
      return;
    }

    try {
      // First, get the current stats and recent games
      const [statsResponse, gamesResponse] = await Promise.all([
        supabase
          .from('profiles')
          .select('win_count, loss_count, draw_count, longest_win_streak')
          .eq('id', user.id)
          .single(),
        supabase
          .from('game_history')
          .select('result')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100)
      ]);

      if (statsResponse.error) throw statsResponse.error;
      if (gamesResponse.error) throw gamesResponse.error;

      const currentStats = statsResponse.data;
      const recentGames = gamesResponse.data || [];

      // Calculate current win streak
      let currentWinStreak = 0;
      if (result === 'win') {
        currentWinStreak = 1; // Count the current win
        // Add previous consecutive wins
        for (const game of recentGames) {
          if (game.result === 'win') {
            currentWinStreak++;
          } else {
            break;
          }
        }
      }

      // Prepare updates
      const updates = {
        win_count: currentStats.win_count + (result === 'win' ? 1 : 0),
        loss_count: currentStats.loss_count + (result === 'loss' ? 1 : 0),
        draw_count: currentStats.draw_count + (result === 'draw' ? 1 : 0),
        longest_win_streak: Math.max(currentStats.longest_win_streak, currentWinStreak),
        updated_at: new Date().toISOString()
      };

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Record game in history
      const { error: historyError } = await supabase
        .from('game_history')
        .insert([{
          user_id: user.id,
          result,
          current_streak: currentWinStreak
        }]);

      if (historyError) throw historyError;

      // Fetch updated profile
      const { data: updatedProfile, error: profileError } = await supabase
        .from('profiles')
        .select('username, avatar_color, win_count, loss_count, draw_count, longest_win_streak, total_matches, win_rate')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  const makeAIMove = useCallback(() => {
    if (isReplaying) return;

    const game = gameRef.current;
    const possibleMoves = game.moves({ verbose: true });

    if (game.isGameOver()) {
      setGameOver(true);
      if (game.isDraw()) {
        setGameResult('draw');
        updateUserStats('draw');
      } else {
        const playerWon = (playerIsWhite && game.turn() === 'b') || (!playerIsWhite && game.turn() === 'w');
        setGameResult(playerWon ? 'win' : 'loss');
        updateUserStats(playerWon ? 'win' : 'loss');
      }
      return;
    }

    if (possibleMoves.length === 0) {
      setGameOver(true);
      return;
    }

    if (aiMoveTimeoutRef.current) {
      clearTimeout(aiMoveTimeoutRef.current);
    }

    aiMoveTimeoutRef.current = window.setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      const move = possibleMoves[randomIndex];

      try {
        const result = game.move(move);
        if (result) {
          setGameVersion(v => v + 1);
          setMoves(prev => [...prev, result]);
        }
      } catch (error) {
        console.error('Error making AI move:', error);
      }
      aiMoveTimeoutRef.current = null;
    }, 300);
  }, [isReplaying, playerIsWhite]);

  useEffect(() => {
    const isPlayerTurn = (playerIsWhite && gameRef.current.turn() === 'w') || (!playerIsWhite && gameRef.current.turn() === 'b');
    if (!isPlayerTurn && !isReplaying) {
      makeAIMove();
    }
  }, [gameVersion, makeAIMove, isReplaying, playerIsWhite]);

  function getMoveOptions(square: Square) {
    const moves = gameRef.current.moves({
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
          gameRef.current.get(move.to) && gameRef.current.get(move.to).color !== gameRef.current.get(square).color
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
    const isPlayerTurn = (playerIsWhite && gameRef.current.turn() === 'w') || (!playerIsWhite && gameRef.current.turn() === 'b');
    if (!isPlayerTurn || gameOver || isReplaying) return;

    setRightClickedSquares({});

    if (!moveFrom) {
      const hasMoves = getMoveOptions(square);
      if (hasMoves) setMoveFrom(square);
      return;
    }

    try {
      const result = gameRef.current.move({
        from: moveFrom,
        to: square,
        promotion: 'q'
      });

      if (result) {
        setGameVersion(v => v + 1);
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
    gameRef.current = createInitialGame();
    setGameVersion(v => v + 1);
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

  if (!user && !isGuestMode) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
        {showWelcomeModal && (
          <WelcomeModal
            isDarkMode={isDarkMode}
            onPlayAsGuest={handlePlayAsGuest}
          />
        )}
      </div>
    );
  }

  if (user && profileLoading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-gradient-to-br from-blue-50 to-white'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (user && !profile) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-gradient-to-br from-blue-50 to-white'}`}>
        <ProfileSetup
          user={user}
          isDarkMode={isDarkMode}
          onComplete={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-black' : 'bg-gradient-to-br from-blue-50 to-white'} flex flex-col items-center justify-center px-2 py-4 sm:p-4`}>
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 sm:p-6 rounded-none sm:rounded-xl shadow-2xl w-full max-w-7xl`}>
        <GameHeader
          stats={stats}
          onReset={resetGame}
          isDarkMode={isDarkMode}
          onThemeToggle={toggleTheme}
          playerIsWhite={playerIsWhite}
          user={user}
          profile={profile}
          onSignOut={handleSignOut}
        />

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="flex-1">
            <div className="relative w-full">
              <ChessBoard
                game={gameRef.current}
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
              isCheck={gameRef.current.isCheck()}
              turn={gameRef.current.turn()}
              isReplaying={isReplaying}
              isDarkMode={isDarkMode}
              playerIsWhite={playerIsWhite}
            />
          </div>

          <div className="lg:w-80">
            <MoveLog
              moves={moves}
              currentPosition={gameRef.current.fen()}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        <Footer isDarkMode={isDarkMode} user={user} />
      </div>

      {showSignUpPrompt && (
        <SignUpPromptModal
          isDarkMode={isDarkMode}
          onClose={() => setShowSignUpPrompt(false)}
        />
      )}
    </div>
  );
}

export default App;