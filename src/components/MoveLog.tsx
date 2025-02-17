import { Move } from 'chess.js';
import { MoveLogProps } from '../types';
import { ScrollText } from 'lucide-react';

function getPieceName(piece: string): string {
  switch (piece.toLowerCase()) {
    case 'p': return 'Pawn';
    case 'n': return 'Knight';
    case 'b': return 'Bishop';
    case 'r': return 'Rook';
    case 'q': return 'Queen';
    case 'k': return 'King';
    default: return 'Piece';
  }
}

function getSquareName(square: string): string {
  const file = square[0].toUpperCase();
  const rank = square[1];
  return `${file}${rank}`;
}

function getDescriptiveMove(move: Move): string {
  let description = '';
  
  if (move.flags.includes('k')) {
    return 'Kingside Castle';
  }
  if (move.flags.includes('q')) {
    return 'Queenside Castle';
  }

  const pieceName = getPieceName(move.piece);
  description = `${pieceName} to ${getSquareName(move.to)}`;
  
  if (move.flags.includes('c')) {
    description += ` captures ${getPieceName(move.captured!)}`;
  }
  
  if (move.flags.includes('p')) {
    description += ` promotes to ${getPieceName(move.promotion!)}`;
  }
  
  if (move.san.includes('#')) {
    description += ' (Checkmate)';
  } else if (move.san.includes('+')) {
    description += ' (Check)';
  }

  return description;
}

function analyzeMoveStrength(move: Move): { strength: string; explanation: string } {
  if (move.flags.includes('c')) {
    return {
      strength: 'strong',
      explanation: 'Capture'
    };
  }
  if (move.flags.includes('e')) {
    return {
      strength: 'strong',
      explanation: 'En passant'
    };
  }
  if (move.flags.includes('k') || move.flags.includes('q')) {
    return {
      strength: 'neutral',
      explanation: 'Castle'
    };
  }
  if (move.flags.includes('p')) {
    return {
      strength: 'strong',
      explanation: 'Promotion'
    };
  }
  if (move.san.includes('+')) {
    return {
      strength: 'strong',
      explanation: 'Check'
    };
  }
  if (move.san.includes('#')) {
    return {
      strength: 'strong',
      explanation: 'Checkmate'
    };
  }
  return {
    strength: 'neutral',
    explanation: 'Normal move'
  };
}

function getStrengthColor(strength: string): string {
  switch (strength) {
    case 'strong':
      return 'text-green-400';
    case 'weak':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}

export function MoveLog({ moves, isDarkMode }: MoveLogProps) {
  const pairs = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1]
    });
  }

  return (
    <div className={`h-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-4">
        <ScrollText className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Move History</h2>
      </div>
      <div className="h-[calc(100vh-24rem)] lg:h-[600px] overflow-y-auto">
        {pairs.map(({ number, white, black }) => {
          const whiteAnalysis = analyzeMoveStrength(white);
          const blackAnalysis = black ? analyzeMoveStrength(black) : null;

          return (
            <div key={number} className="flex flex-col gap-2 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <span className={`w-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`}>{number}.</span>
                <div className="flex-1">
                  <div className="flex flex-col">
                    <span className="font-medium text-blue-500">White: {getDescriptiveMove(white)}</span>
                    <span className={`text-xs ${getStrengthColor(whiteAnalysis.strength)}`}>
                      {whiteAnalysis.explanation}
                    </span>
                  </div>
                </div>
              </div>
              {black && (
                <div className="flex items-center gap-2">
                  <span className="w-8 flex-shrink-0"></span>
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Black: {getDescriptiveMove(black)}
                      </span>
                      <span className={`text-xs ${getStrengthColor(blackAnalysis!.strength)}`}>
                        {blackAnalysis!.explanation}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}