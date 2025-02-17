import { useState } from 'react';
import { User } from 'lucide-react';
import { Filter } from 'bad-words';
import { UsernameModalProps } from '../types';

const filter = new Filter();

export function UsernameModal({ onSubmit }: UsernameModalProps) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Welcome to Chess vs AI</h2>
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <p className="text-gray-600 mb-4">Please enter your username to start playing:</p>
        <input
          type="text"
          value={tempUsername}
          onChange={(e) => {
            setTempUsername(e.target.value);
            setUsernameError('');
          }}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter username"
        />
        {usernameError && (
          <p className="text-red-500 text-sm mt-2">{usernameError}</p>
        )}
        <button
          onClick={handleSubmit}
          className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Playing
        </button>
      </div>
    </div>
  );
}