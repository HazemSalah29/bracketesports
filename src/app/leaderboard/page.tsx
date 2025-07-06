'use client';

import { useState } from 'react';
import { 
  TrophyIcon, 
  UserIcon, 
  ChartBarIcon,
  CalendarIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Mock leaderboard data
const mockLeaderboard = [
  {
    id: '1',
    rank: 1,
    username: 'ProGamer2024',
    avatar: null,
    gamesPlayed: 156,
    gamesWon: 124,
    tournamentsWon: 45,
    totalPoints: 15750,
    currentRank: { tier: 'grandmaster', division: 2 },
    winRate: 79.5,
    lastActive: new Date('2024-12-20'),
    favoriteGame: 'Counter-Strike 2',
    countryFlag: '🇺🇸',
    verified: true,
    achievements: 23,
    teamId: 'team-1',
    teamName: 'Cyber Wolves'
  },
  {
    id: '2',
    rank: 2,
    username: 'SniperKing',
    avatar: null,
    gamesPlayed: 142,
    gamesWon: 108,
    tournamentsWon: 38,
    totalPoints: 12450,
    currentRank: { tier: 'master', division: 4 },
    winRate: 76.1,
    lastActive: new Date('2024-12-19'),
    favoriteGame: 'Valorant',
    countryFlag: '🇨🇦',
    verified: true,
    achievements: 18,
    teamId: null,
    teamName: null
  },
  {
    id: '3',
    rank: 3,
    username: 'RocketMaster',
    avatar: null,
    gamesPlayed: 189,
    gamesWon: 132,
    tournamentsWon: 32,
    totalPoints: 9850,
    currentRank: { tier: 'master', division: 1 },
    winRate: 69.8,
    lastActive: new Date('2024-12-18'),
    favoriteGame: 'Rocket League',
    countryFlag: '🇬🇧',
    verified: true,
    achievements: 15,
    teamId: 'team-3',
    teamName: 'Rocket Raiders'
  },
  {
    id: '4',
    rank: 4,
    username: 'HeadshotHero',
    avatar: null,
    gamesPlayed: 98,
    gamesWon: 76,
    tournamentsWon: 28,
    totalPoints: 8200,
    currentRank: { tier: 'diamond', division: 5 },
    winRate: 77.6,
    lastActive: new Date('2024-12-17'),
    favoriteGame: 'Counter-Strike 2',
    countryFlag: '🇩🇪',
    verified: false,
    achievements: 12,
    teamId: null,
    teamName: null
  },
  {
    id: '5',
    rank: 5,
    username: 'ClutchKing',
    avatar: null,
    gamesPlayed: 134,
    gamesWon: 89,
    tournamentsWon: 25,
    totalPoints: 7650,
    currentRank: { tier: 'diamond', division: 3 },
    winRate: 66.4,
    lastActive: new Date('2024-12-16'),
    favoriteGame: 'Valorant',
    countryFlag: '🇸🇪',
    verified: true,
    achievements: 11,
    teamId: 'team-2',
    teamName: 'Digital Dragons'
  },
  {
    id: '6',
    rank: 6,
    username: 'ApexLegend',
    avatar: null,
    gamesPlayed: 112,
    gamesWon: 78,
    tournamentsWon: 22,
    totalPoints: 6800,
    currentRank: { tier: 'diamond', division: 1 },
    winRate: 69.6,
    lastActive: new Date('2024-12-15'),
    favoriteGame: 'Apex Legends',
    countryFlag: '🇦🇺',
    verified: false,
    achievements: 9,
    teamId: null,
    teamName: null
  },
  {
    id: '7',
    rank: 7,
    username: 'RifleGod',
    avatar: null,
    gamesPlayed: 87,
    gamesWon: 58,
    tournamentsWon: 19,
    totalPoints: 5950,
    currentRank: { tier: 'platinum', division: 5 },
    winRate: 66.7,
    lastActive: new Date('2024-12-14'),
    favoriteGame: 'Counter-Strike 2',
    countryFlag: '🇫🇷',
    verified: true,
    achievements: 8,
    teamId: null,
    teamName: null
  },
  {
    id: '8',
    rank: 8,
    username: 'StrategyMaster',
    avatar: null,
    gamesPlayed: 156,
    gamesWon: 98,
    tournamentsWon: 17,
    totalPoints: 5200,
    currentRank: { tier: 'platinum', division: 3 },
    winRate: 62.8,
    lastActive: new Date('2024-12-13'),
    favoriteGame: 'League of Legends',
    countryFlag: '🇰🇷',
    verified: false,
    achievements: 7,
    teamId: null,
    teamName: null
  },
  {
    id: '9',
    rank: 9,
    username: 'FastFingers',
    avatar: null,
    gamesPlayed: 93,
    gamesWon: 61,
    tournamentsWon: 16,
    totalPoints: 4750,
    currentRank: { tier: 'platinum', division: 1 },
    winRate: 65.6,
    lastActive: new Date('2024-12-12'),
    favoriteGame: 'Rocket League',
    countryFlag: '🇪🇸',
    verified: true,
    achievements: 6,
    teamId: 'team-3',
    teamName: 'Rocket Raiders'
  },
  {
    id: '10',
    rank: 10,
    username: 'EliteGamer',
    avatar: null,
    gamesPlayed: 78,
    gamesWon: 49,
    tournamentsWon: 14,
    totalPoints: 4100,
    currentRank: { tier: 'gold', division: 5 },
    winRate: 62.8,
    lastActive: new Date('2024-12-11'),
    favoriteGame: 'Valorant',
    countryFlag: '🇮🇹',
    verified: false,
    achievements: 5,
    teamId: null,
    teamName: null
  }
];

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [sortBy, setSortBy] = useState('earnings');

  const games = ['All Games', 'Counter-Strike 2', 'Valorant', 'Rocket League', 'Apex Legends', 'League of Legends'];
  const periods = ['All Time', 'This Month', 'This Week', 'Today'];

  const filteredLeaderboard = mockLeaderboard.filter(player => {
    const matchesSearch = player.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame = selectedGame === 'all' || player.favoriteGame === selectedGame;
    
    return matchesSearch && matchesGame;
  });

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400';
      case 2:
        return 'text-slate-300';
      case 3:
        return 'text-amber-600';
      default:
        return 'text-slate-400';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '👑';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="min-h-screen py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-gaming">
            Leaderboard
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            See who&apos;s dominating the competitive scene and track your progress.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gaming-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Players</p>
                <p className="text-2xl font-bold text-white">2,847</p>
              </div>
              <UserIcon className="w-8 h-8 text-gaming-500" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="gaming-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Prizes</p>
                <p className="text-2xl font-bold text-accent-500 prize-glow">$124,350</p>
              </div>
              <TrophyIcon className="w-8 h-8 text-accent-500" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="gaming-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Active Tournaments</p>
                <p className="text-2xl font-bold text-white">47</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-gaming-500" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="gaming-card rounded-xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FunnelIcon className="w-5 h-5 text-slate-400" />
            <span className="text-white font-semibold">Filters</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gaming-500"
              />
            </div>
            
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gaming-500"
            >
              {games.map(game => (
                <option key={game} value={game === 'All Games' ? 'all' : game}>
                  {game}
                </option>
              ))}
            </select>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gaming-500"
            >
              {periods.map(period => (
                <option key={period} value={period.toLowerCase().replace(' ', '-')}>
                  {period}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gaming-500"
            >
              <option value="earnings">Sort by Earnings</option>
              <option value="wins">Sort by Wins</option>
              <option value="winRate">Sort by Win Rate</option>
              <option value="tournaments">Sort by Tournaments</option>
            </select>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="gaming-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Top Players</h2>
          
          <div className="space-y-4">
            {filteredLeaderboard.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`text-2xl font-bold ${getRankColor(player.rank)} min-w-[60px]`}>
                    {getRankIcon(player.rank)}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gaming-500 to-gaming-700 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{player.username}</span>
                        <span className="text-lg">{player.countryFlag}</span>
                        {player.verified && (
                          <span className="text-green-500 text-sm">✓</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>{player.favoriteGame}</span>
                        <span>•</span>
                        <span>{player.winRate.toFixed(1)}% Win Rate</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-8 text-center">
                  <div>
                    <div className="text-sm text-slate-400">Points</div>
                    <div className="text-lg font-bold text-gaming-400 prize-glow">
                      {player.totalPoints.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Tournaments</div>
                    <div className="text-lg font-bold text-white">{player.tournamentsWon}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Games Won</div>
                    <div className="text-lg font-bold text-white">{player.gamesWon}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Last Active</div>
                    <div className="text-sm text-slate-300">
                      {player.lastActive.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Your Rank Section */}
        <div className="gaming-card rounded-xl p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Your Ranking</h2>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-gaming-500">#156</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gaming-500 to-gaming-700 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Your Account</div>
                    <div className="text-sm text-slate-400">67% Win Rate</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-sm text-slate-400">Earnings</div>
                  <div className="text-lg font-bold text-accent-500 prize-glow">$2,450.00</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Tournaments</div>
                  <div className="text-lg font-bold text-white">12</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Games Won</div>
                  <div className="text-lg font-bold text-white">30</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Games Played</div>
                  <div className="text-lg font-bold text-white">45</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
