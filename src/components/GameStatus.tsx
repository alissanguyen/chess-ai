import { GameStatusProps } from '../types';

export function GameStatus({ isCheck, turn }: GameStatusProps) {
  return (
    <div className="mt-6 text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-2">
      <p className="text-base sm:text-lg font-medium text-center sm:text-left">
        {turn === 'w' ? 
          <span className="text-blue-600">Your turn (White)</span> : 
          <span className="text-gray-800">AI's turn (Black)</span>
        }
      </p>
      {isCheck && (
        <p className="text-red-500 font-bold text-lg animate-pulse">
          Check!
        </p>
      )}
    </div>
  );
}