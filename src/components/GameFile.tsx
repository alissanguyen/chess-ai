import { GameStatusProps } from '../types';

export function GameStatus({ isCheck, turn }: GameStatusProps) {
  return (
    <div className="mt-6 text-gray-600 flex justify-between items-center">
      <p className="text-lg font-medium">
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