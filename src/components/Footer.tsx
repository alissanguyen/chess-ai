import { Github } from 'lucide-react';
import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface FooterProps {
  isDarkMode: boolean;
  user: User | null;
}

const REPO_URL = 'https://github.com/alissanguyen/chess-ai';

export function Footer({ isDarkMode, user }: FooterProps) {
  const [isStarring, setIsStarring] = useState(false);

  const handleGithubAction = useCallback(async () => {
    if (!user) {
      window.open(REPO_URL, '_blank');
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    const provider = session?.user?.app_metadata?.provider;
    
    if (provider !== 'github') {
      window.open(REPO_URL, '_blank');
      return;
    }

    try {
      setIsStarring(true);
      const accessToken = session?.provider_token;
      
      // Check if already starred
      const checkResponse = await fetch(`https://api.github.com/user/starred/alissanguyen/chess-ai`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const isStarred = checkResponse.status === 204;

      // Toggle star status
      await fetch(`https://api.github.com/user/starred/alissanguyen/chess-ai`, {
        method: isStarred ? 'DELETE' : 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Length': '0',
        },
      });
    } catch (error) {
      console.error('Error interacting with GitHub:', error);
      window.open(REPO_URL, '_blank');
    } finally {
      setIsStarring(false);
    }
  }, [user]);

  return (
    <footer className={`mt-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      <button
        onClick={handleGithubAction}
        disabled={isStarring}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 text-purple-400 hover:bg-gray-700' 
            : 'bg-gray-200 text-purple-600 hover:bg-gray-300'
        }`}
      >
        <Github className={`w-5 h-5 ${isStarring ? 'animate-spin' : ''}`} />
        <span>Love this game? {user?.app_metadata?.provider === 'github' ? 'Give me a ★ on GitHub' : 'View on GitHub'}</span>
      </button>
      <p className="mt-2 text-sm opacity-75">
        Made with ♥︎ by{' '}
        <a 
          href="https://github.com/alissanguyen" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Alissa Nguyen
        </a>
      </p>
    </footer>
  );
}