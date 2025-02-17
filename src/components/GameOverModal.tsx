import { Trophy } from 'lucide-react';
import { GameOverModalProps } from '../types';

export function GameOverModal({ gameResult, onReset, isDarkMode }: GameOverModalProps) {
  if (!gameResult) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center rounded-lg transition-all duration-300">
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-8 rounded-xl shadow-2xl text-center transform transition-all duration-300 scale-100`}>
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">
          {gameResult === 'win' && 'You Won!'}
          {gameResult === 'loss' && 'AI Won!'}
          {gameResult === 'draw' && "It's a Draw!"}
        </h2>
        <button
          onClick={onReset}
          className={`px-6 py-3 ${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg`}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}