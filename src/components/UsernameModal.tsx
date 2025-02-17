import { useState } from 'react';
import { User } from 'lucide-react';
import { Filter } from 'bad-words';
import { UsernameModalProps } from '../types';

const filter = new Filter();

export function UsernameModal({ onSubmit, isDarkMode }: UsernameModalProps) {
  const [tempUsername, setTempUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const handleSubmit = () => {
    if (!tempUsername.trim()) {
      setUsernameError('Username cannot be empty');
      return;
    }
    if (tempUsername.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return;
    }
    if (filter.isProfane(tempUsername)) {
      setUsernameError('Please choose an appropriate username');
      return;
    }
    onSubmit(tempUsername.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Welcome to Chess vs AI
          </h2>
          <User className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
          Please enter your username to start playing:
        </p>
        <input
          type="text"
          value={tempUsername}
          onChange={(e) => {
            setTempUsername(e.target.value);
            setUsernameError('');
          }}
          className={`w-full px-4 py-2 border ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          placeholder="Enter username"
        />
        {usernameError && (
          <p className="text-red-500 text-sm mt-2">{usernameError}</p>
        )}
        <button
          onClick={handleSubmit}
          className={`w-full mt-4 px-4 py-2 ${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white rounded-lg transition-colors`}
        >
          Start Playing
        </button>
      </div>
    </div>
  );
}