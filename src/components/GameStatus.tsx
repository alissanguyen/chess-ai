import { GameStatusProps } from '../types';
import { Brain } from 'lucide-react';

export function GameStatus({ isCheck, turn, isReplaying, isDarkMode }: GameStatusProps) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
      <p className="text-base sm:text-lg font-medium text-center sm:text-left">
        {isReplaying ? (
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
            <Brain className="w-5 h-5 animate-pulse" />
            Replaying moves...
          </span>
        ) : turn === 'w' ? (
          <span className="text-blue-600">Your turn (White)</span>
        ) : (
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>AI's turn (Black)</span>
        )}
      </p>
      {isCheck && !isReplaying && (
        <p className="text-red-500 font-bold text-lg animate-pulse">
          Check!
        </p>
      )}
    </div>
  );
}