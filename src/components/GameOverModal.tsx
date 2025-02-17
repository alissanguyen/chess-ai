import { Trophy } from 'lucide-react';
import { GameOverModalProps } from '../types';

export function GameOverModal({ gameResult, onReset }: GameOverModalProps) {
  if (!gameResult) return null;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center rounded-lg transition-all duration-300">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center transform transition-all duration-300 scale-100">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          {gameResult === 'win' && 'You Won!'}
          {gameResult === 'loss' && 'AI Won!'}
          {gameResult === 'draw' && "It's a Draw!"}
        </h2>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}