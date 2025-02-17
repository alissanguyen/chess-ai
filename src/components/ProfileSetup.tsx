import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { UserCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserAvatar } from './UserAvatar';

interface ProfileSetupProps {
  user: User;
  isDarkMode: boolean;
  onComplete: () => void;
}

export function ProfileSetup({ user, isDarkMode, onComplete }: ProfileSetupProps) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarColor] = useState('#4ECDC4');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const checkUsername = async () => {
      if (username.length < 3) {
        setIsAvailable(false);
        return;
      }

      setIsChecking(true);
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('username', { count: 'exact', head: true })
          .eq('username', username);

        if (error) throw error;
        setIsAvailable(count === 0);
      } catch (err) {
        console.error('Error checking username:', err);
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    };

    if (username) {
      timeout = setTimeout(checkUsername, 500);
    }

    return () => clearTimeout(timeout);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAvailable || username.length < 3) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            username,
            avatar_color: avatarColor
          }
        ]);

      if (error) throw error;
      onComplete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Complete Your Profile
          </h2>
          <UserCircle className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>

        <div className="flex justify-center mb-6">
          <UserAvatar 
            username={username || 'You'} 
            color={avatarColor} 
            size="lg" 
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Choose a username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className={`w-full px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                required
                minLength={3}
                maxLength={20}
                pattern="[a-zA-Z0-9_-]+"
                title="Only letters, numbers, underscores, and hyphens are allowed"
              />
              {username.length >= 3 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isChecking ? (
                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                  ) : isAvailable ? (
                    <span className="text-green-500 text-sm">Available</span>
                  ) : (
                    <span className="text-red-500 text-sm">Taken</span>
                  )}
                </div>
              )}
            </div>
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              3-20 characters, letters, numbers, and - _ only
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !isAvailable || username.length < 3}
            className={`w-full px-4 py-2 ${
              isDarkMode 
                ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700' 
                : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300'
            } text-white rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>Complete Profile</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}