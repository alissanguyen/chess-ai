import { Brain, RotateCcw, Sun, Moon } from 'lucide-react';
import { GameHeaderProps } from '../types';

export function GameHeader({ stats, onReset, isDarkMode, onThemeToggle }: GameHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
      <div className="flex items-center space-x-4">
        <Brain className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <div>
          <h1 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} text-center sm:text-left`}>
            Chess vs AI
          </h1>
          {stats && (
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-center sm:text-left`}>
              Playing as: {stats.username}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 sm:ml-auto">
        {stats && (
          <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} flex gap-4`}>
            <p>Wins: <span className="font-bold text-green-400">{stats.wins}</span></p>
            <p>Losses: <span className="font-bold text-red-400">{stats.losses}</span></p>
            <p>Draws: <span className="font-bold text-gray-400">{stats.draws}</span></p>
          </div>
        )}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onReset}
            className={`flex items-center justify-center space-x-2 px-4 py-2 ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex-1 sm:flex-none`}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            <span>Reset Game</span>
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
        </div>
      </div>
    </div>
  );
}