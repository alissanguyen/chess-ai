import { Github } from 'lucide-react';

interface FooterProps {
  isDarkMode: boolean;
}

const REPO_URL = 'https://github.com/alissanguyen/chess-ai';

export function Footer({ isDarkMode }: FooterProps) {
  return (
    <footer className={`mt-8 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
          isDarkMode 
            ? 'bg-gray-800 text-purple-400 hover:bg-gray-700' 
            : 'bg-gray-200 text-purple-600 hover:bg-gray-300'
        }`}
      >
        <Github className="w-5 h-5" />
        <span>Love this game? Give us a ★ on GitHub</span>
      </a>
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