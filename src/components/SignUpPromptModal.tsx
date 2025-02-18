import { useState } from 'react';
import { Trophy, LogIn, Medal, Save, Star } from 'lucide-react';
import { AuthModal } from './AuthModal';

interface SignUpPromptModalProps {
  isDarkMode: boolean;
  onClose: () => void;
}

export function SignUpPromptModal({ isDarkMode, onClose }: SignUpPromptModalProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md`}>
          <div className="flex justify-center mb-6">
            <Trophy className={`w-16 h-16 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
          </div>

          <h2 className={`text-xl sm:text-2xl font-bold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            You're Playing Great!
          </h2>
          
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-center mb-6`}>
            Don't lose your progress! Create an account now to:
          </p>

          <div className={`mb-6 space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="flex items-center gap-3">
              <Save className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} flex-shrink-0`} />
              <span>Save your game progress and history</span>
            </div>
            <div className="flex items-center gap-3">
              <Medal className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'} flex-shrink-0`} />
              <span>Compete on the global leaderboard</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className={`w-5 h-5 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'} flex-shrink-0`} />
              <span>Track your stats and achievements</span>
            </div>
          </div>

          <button
            onClick={() => setShowAuthModal(true)}
            className={`w-full px-4 py-3 ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white rounded-lg transition-colors flex items-center justify-center gap-2`}
          >
            <LogIn className="w-5 h-5" />
            <span>Sign Up Now</span>
          </button>

          <p className={`mt-4 text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            It only takes a few seconds!
          </p>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal 
          isDarkMode={isDarkMode} 
          onClose={() => {
            setShowAuthModal(false);
            onClose();
          }} 
        />
      )}
    </>
  );
}