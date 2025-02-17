import { Brain, RotateCcw } from 'lucide-react';
import { GameHeaderProps } from '../types';

export function GameHeader({ stats, onReset }: GameHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
      <div className="flex items-center space-x-4">
        <Brain className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">Chess vs AI</h1>
          {stats && (
            <p className="text-sm text-gray-600 text-center sm:text-left">Playing as: {stats.username}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:ml-auto">
        {stats && (
          <div className="text-sm text-gray-600 flex sm:block gap-4">
            <p>Wins: <span className="font-bold text-green-600">{stats.wins}</span></p>
            <p>Losses: <span className="font-bold text-red-600">{stats.losses}</span></p>
            <p>Draws: <span className="font-bold text-gray-600">{stats.draws}</span></p>
          </div>
        )}
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Game</span>
        </button>
      </div>
    </div>
  );
}