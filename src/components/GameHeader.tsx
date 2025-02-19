import { Brain, RotateCcw, Sun, Moon, LogOut, Trophy, Target, Medal, LogIn, Crown } from 'lucide-react';
import { GameHeaderProps } from '../types';
import { UserAvatar } from './UserAvatar';
import { useState } from 'react';
import { Leaderboard } from './Leaderboard';
import { AuthModal } from './AuthModal';

export function GameHeader({ 
  onReset, 
  isDarkMode, 
  onThemeToggle, 
  playerIsWhite,
  user,
  profile,
  onSignOut
}: GameHeaderProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <Brain className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <div>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-center sm:text-left`}>
              Chess vs AI
            </h1>
            {user && profile && (
              <div className="flex items-center gap-2 mt-1">
                <UserAvatar 
                  username={profile.username} 
                  color={profile.avatar_color} 
                  size="sm" 
                />
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {profile.username} ({playerIsWhite ? 'White' : 'Black'})
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {profile.total_matches} games
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 sm:ml-auto w-full sm:w-auto">
          {profile && (
            <div className={`w-full sm:w-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {/* Mobile Stats (visible only on small screens) */}
              <div className="sm:hidden w-full">
                <div className={`grid grid-cols-3 gap-2 p-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="flex flex-col items-center justify-center p-2">
                    <Crown className="w-4 h-4 text-yellow-500 mb-1" />
                    <div className="text-center">
                      <p className="font-bold text-green-400">{profile.win_count}</p>
                      <p className="text-xs opacity-75">Wins</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-r border-gray-700 p-2">
                    <Target className="w-4 h-4 text-blue-500 mb-1" />
                    <div className="text-center">
                      <p className="font-bold">{profile.current_win_streak}</p>
                      <p className="text-xs opacity-75">Current</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2">
                    <Medal className="w-4 h-4 text-purple-500 mb-1" />
                    <div className="text-center">
                      <p className="font-bold text-blue-400">{profile.longest_win_streak}</p>
                      <p className="text-xs opacity-75">Best</p>
                    </div>
                  </div>
                </div>
                <div className={`mt-1 flex justify-center gap-4 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>Losses: {profile.loss_count}</span>
                  <span>Draws: {profile.draw_count}</span>
                  <span>Win Rate: {profile.win_rate}%</span>
                </div>
              </div>

              {/* Desktop Stats (hidden on small screens) */}
              <div className="hidden sm:grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p>Wins: <span className="font-bold text-green-400">{profile.win_count}</span></p>
                    <p className="text-xs opacity-75">Rate: {profile.win_rate}%</p>
                  </div>
                </div>
                <div>
                  <p>Losses: <span className="font-bold text-red-400">{profile.loss_count}</span></p>
                  <p>Draws: <span className="font-bold text-gray-400">{profile.draw_count}</span></p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <div>
                      <p>Streak: <span className="font-bold text-blue-400">{profile.current_win_streak}</span></p>
                      <p className="text-xs opacity-75">Best: {profile.longest_win_streak}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Mobile Action Buttons */}
          <div className="flex flex-wrap gap-2 w-full sm:hidden">
            <button
              onClick={onReset}
              className={`flex-1 flex items-center justify-center px-3 py-2 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg min-w-[80px]`}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              <span>Reset</span>
            </button>
            {!user && (
              <button
                onClick={() => setShowAuthModal(true)}
                className={`flex-1 flex items-center justify-center px-3 py-2 ${
                  isDarkMode 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg min-w-[80px]`}
              >
                <LogIn className="w-4 h-4 mr-1" />
                <span>Sign In</span>
              </button>
            )}
            <button
              onClick={() => setShowLeaderboard(true)}
              className={`flex-1 flex items-center justify-center px-3 py-2 ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-200 text-yellow-600 hover:bg-gray-300'
              } rounded-lg transition-all duration-200 min-w-[80px]`}
            >
              <Trophy className="w-4 h-4 mr-1" />
              <span>Ranking</span>
            </button>
            <button
              onClick={onThemeToggle}
              className={`flex-1 flex items-center justify-center px-3 py-2 ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              } rounded-lg transition-all duration-200 min-w-[80px]`}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 mr-1" />
                  <span></span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 mr-1" />
                  <span></span>
                </>
              )}
            </button>
            {user && (
              <button
                onClick={onSignOut}
                className={`flex-1 flex items-center justify-center px-3 py-2 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-red-400 hover:bg-gray-700' 
                    : 'bg-gray-200 text-red-600 hover:bg-gray-300'
                } rounded-lg transition-all duration-200 min-w-[80px]`}
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span>Exit</span>
              </button>
            )}
          </div>
          {/* Desktop Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onReset}
              className={`flex items-center justify-center space-x-2 px-4 py-2 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg`}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              <span>Reset Game</span>
            </button>
            {!user && (
              <button
                onClick={() => setShowAuthModal(true)}
                className={`flex items-center justify-center space-x-2 px-4 py-2 ${
                  isDarkMode 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg`}
              >
                <LogIn className="w-4 h-4 mr-2" />
                <span>Sign In</span>
              </button>
            )}
            <button
              onClick={() => setShowLeaderboard(true)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-200 text-yellow-600 hover:bg-gray-300'
              }`}
              title="View Leaderboard"
            >
              <Trophy className="w-5 h-5" />
            </button>
            <button
              onClick={onThemeToggle}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            {user && (
              <button
                onClick={onSignOut}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-800 text-red-400 hover:bg-gray-700' 
                    : 'bg-gray-200 text-red-600 hover:bg-gray-300'
                }`}
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {showLeaderboard && (
        <Leaderboard 
          isDarkMode={isDarkMode} 
          onClose={() => setShowLeaderboard(false)} 
        />
      )}

      {showAuthModal && (
        <AuthModal 
          isDarkMode={isDarkMode} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </>
  );
}