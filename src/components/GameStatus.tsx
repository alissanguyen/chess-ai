import { GameStatusProps } from '../types';
import { Brain } from 'lucide-react';

export function GameStatus({ isCheck, turn, isReplaying, isDarkMode, playerIsWhite }: GameStatusProps) {
  const isPlayerTurn = (playerIsWhite && turn === 'w') || (!playerIsWhite && turn === 'b');

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
      <p className="text-base sm:text-lg font-medium text-center sm:text-left">
        {isReplaying ? (
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
            <Brain className="w-5 h-5 animate-pulse" />
            Replaying moves...
          </span>
        ) : isPlayerTurn ? (
          <span className="text-blue-600">Your turn ({playerIsWhite ? 'White' : 'Black'})</span>
        ) : (
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-800'}>AI's turn ({playerIsWhite ? 'Black' : 'White'})</span>
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