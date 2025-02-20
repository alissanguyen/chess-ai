import Queen from "../assets/queen.png"
import Bishop from "../assets/bishop.png"
import Knight from "../assets/knight.png"
import Rook from "../assets/rook.png"

interface PawnPromotionDialogProps {
  isDarkMode: boolean;
  onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
  playerColor: 'w' | 'b';
}

export function PawnPromotionDialog({ isDarkMode, onSelect, playerColor }: PawnPromotionDialogProps) {
  const pieces = [
    { type: 'q' as const, name: 'Queen', icon: Queen },
    { type: 'r' as const, name: 'Rook', icon: Rook },
    { type: 'b' as const, name: 'Bishop', icon: Bishop },
    { type: 'n' as const, name: 'Knight', icon: Knight },
  ];

  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center rounded-lg z-50">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-2 sm:p-4 rounded-xl shadow-2xl`}>
        <h3 className={`text-lg font-bold mb-3 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Choose Promotion
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {pieces.map(({ type, name, icon: Icon }) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`p-3 rounded-lg transition-all duration-200 flex flex-col items-center ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-white' 
                  : 'hover:bg-gray-100 text-gray-900'
              }`}
              title={name}
            >
              <img src={Icon} alt={name} className={`w-8 h-8 sm:w-16 sm:h-16 ${playerColor === 'w' ? 'text-blue-500' : 'text-gray-700'}`} />
              <span className="text-xs mt-1">{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}