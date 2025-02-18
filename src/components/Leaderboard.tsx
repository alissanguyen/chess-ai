import { useState, useEffect } from 'react';
import { Trophy, Target, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { UserAvatar } from './UserAvatar';

interface LeaderboardProps {
  isDarkMode: boolean;
  onClose: () => void;
}

interface LeaderboardEntry {
  username: string;
  avatar_color: string;
  win_rate: number;
  longest_win_streak: number;
  total_matches: number;
}

export function Leaderboard({ isDarkMode, onClose }: LeaderboardProps) {
  const [loading, setLoading] = useState(true);
  const [byWinRate, setByWinRate] = useState<LeaderboardEntry[]>([]);
  const [byStreak, setByStreak] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function fetchLeaderboards() {
      try {
        // Fetch top 10 by win rate (minimum 5 games)
        const { data: winRateData } = await supabase
          .from('profiles')
          .select('username, avatar_color, win_rate, longest_win_streak, total_matches')
          .gte('total_matches', 5)
          .order('win_rate', { ascending: false })
          .limit(10);

        // Fetch top 10 by streak
        const { data: streakData } = await supabase
          .from('profiles')
          .select('username, avatar_color, win_rate, longest_win_streak, total_matches')
          .order('longest_win_streak', { ascending: false })
          .limit(10);

        if (winRateData) setByWinRate(winRateData);
        if (streakData) setByStreak(streakData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboards();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Leaderboard
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-opacity-80 transition-colors ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <X className={`w-6 h-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 overflow-y-auto">
            {/* Win Rate Leaders */}
            <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 rounded-lg`}>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  By Win Rate
                </h3>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  (min. 5 games)
                </span>
              </div>
              <div className="space-y-3">
                {byWinRate.map((player, index) => (
                  <div
                    key={player.username}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <span className={`w-6 text-center font-bold ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-amber-600' :
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      #{index + 1}
                    </span>
                    <UserAvatar
                      username={player.username}
                      color={player.avatar_color}
                      size="sm"
                    />
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {player.username}
                    </span>
                    <span className={`ml-auto font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {player.win_rate}%
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({player.total_matches} games)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak Leaders */}
            <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-4 rounded-lg`}>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-blue-500" />
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  By Win Streak
                </h3>
              </div>
              <div className="space-y-3">
                {byStreak.map((player, index) => (
                  <div
                    key={player.username}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      isDarkMode ? 'bg-gray-800' : 'bg-white'
                    }`}
                  >
                    <span className={`w-6 text-center font-bold ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-amber-600' :
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      #{index + 1}
                    </span>
                    <UserAvatar
                      username={player.username}
                      color={player.avatar_color}
                      size="sm"
                    />
                    <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {player.username}
                    </span>
                    <span className={`ml-auto font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {player.longest_win_streak}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      wins
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}