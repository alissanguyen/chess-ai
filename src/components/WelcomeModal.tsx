import { useState } from 'react';
import { LogIn, User, Ghost } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface WelcomeModalProps {
  isDarkMode: boolean;
  onPlayAsGuest: () => void;
}

export function WelcomeModal({ isDarkMode, onPlayAsGuest }: WelcomeModalProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome to Chess vs AI
            </h2>
            <User className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            Challenge yourself against our AI opponent! Sign in to track your progress and compete on the leaderboard.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => setShowAuthModal(true)}
              className={`w-full px-4 py-3 ${
                isDarkMode 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white rounded-lg transition-colors flex items-center justify-center gap-2`}
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In / Sign Up</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                  or
                </span>
              </div>
            </div>

            <button
              onClick={onPlayAsGuest}
              className={`w-full px-4 py-3 ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              } rounded-lg transition-colors flex items-center justify-center gap-2`}
            >
              <Ghost className="w-5 h-5" />
              <span>Play as Guest</span>
            </button>
          </div>

          <p className={`mt-4 text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Guest progress is saved locally
          </p>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal 
          isDarkMode={isDarkMode} 
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </>
  );
}