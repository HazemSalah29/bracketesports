'use client'

import { useState } from 'react'
import { 
  UserCircleIcon, 
  TrophyIcon, 
  FireIcon, 
  ChartBarIcon,
  CogIcon,
  StarIcon,
  CalendarIcon,
  PlayIcon,
  UsersIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const mockUser = {
  id: '1',
  username: 'ProGamer2024',
  email: 'progamer@example.com',
  avatar: null,
  rank: {
    tier: 'gold',
    division: 3,
    points: 2750,
    pointsToNextRank: 250,
    season: '2025-S1'
  },
  totalPoints: 12500,
  gamesPlayed: 156,
  tournamentsWon: 23,
  achievements: [
    {
      id: '1',
      name: 'First Victory',
      description: 'Win your first tournament',
      icon: '🏆',
      type: 'tournament',
      rarity: 'common',
      unlockedAt: new Date('2024-11-15T10:00:00Z')
    },
    {
      id: '2',
      name: 'Champion',
      description: 'Win 10 tournaments',
      icon: '👑',
      type: 'milestone',
      rarity: 'rare',
      unlockedAt: new Date('2024-12-01T14:30:00Z')
    },
    {
      id: '3',
      name: 'Elite Player',
      description: 'Reach Gold rank',
      icon: '🌟',
      type: 'milestone',
      rarity: 'epic',
      unlockedAt: new Date('2024-12-10T16:45:00Z')
    },
    {
      id: '4',
      name: 'CS2 Master',
      description: 'Win 5 CS2 tournaments',
      icon: '🎯',
      type: 'tournament',
      rarity: 'legendary',
      unlockedAt: new Date('2024-12-12T12:00:00Z')
    }
  ],
  favoriteGames: ['Counter-Strike 2', 'Valorant', 'Rocket League'],
  joinedAt: new Date('2024-09-01T00:00:00Z'),
  lastActive: new Date('2024-12-15T18:30:00Z')
}

const mockRecentActivity = [
  {
    id: '1',
    type: 'tournament_win',
    title: 'Won CS2 Winter Championship',
    description: 'Defeated 63 other players',
    points: 2500,
    date: new Date('2024-12-15T20:00:00Z')
  },
  {
    id: '2',
    type: 'achievement',
    title: 'Unlocked "CS2 Master" achievement',
    description: 'Won 5 CS2 tournaments',
    points: 500,
    date: new Date('2024-12-12T12:00:00Z')
  },
  {
    id: '3',
    type: 'rank_up',
    title: 'Promoted to Gold III',
    description: 'Reached 2750 points',
    points: 0,
    date: new Date('2024-12-10T16:45:00Z')
  },
  {
    id: '4',
    type: 'tournament_participate',
    title: 'Joined Valorant Pro Series',
    description: 'Finished 3rd place',
    points: 800,
    date: new Date('2024-12-08T21:00:00Z')
  }
]

const getRankColor = (tier: string) => {
  const colors = {
    bronze: 'text-amber-600',
    silver: 'text-slate-400',
    gold: 'text-yellow-500',
    platinum: 'text-cyan-400',
    diamond: 'text-blue-400',
    master: 'text-purple-400',
    grandmaster: 'text-red-400'
  }
  return colors[tier as keyof typeof colors] || 'text-slate-400'
}

const getRankIcon = (tier: string) => {
  const icons = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
    diamond: '💠',
    master: '👑',
    grandmaster: '🏆'
  }
  return icons[tier as keyof typeof icons] || '🏅'
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'tournament_win':
      return <TrophyIcon className="w-5 h-5 text-yellow-500" />
    case 'achievement':
      return <StarIcon className="w-5 h-5 text-purple-500" />
    case 'rank_up':
      return <ChartBarIcon className="w-5 h-5 text-green-500" />
    case 'tournament_participate':
      return <PlayIcon className="w-5 h-5 text-blue-500" />
    default:
      return <SparklesIcon className="w-5 h-5 text-slate-500" />
  }
}

const getRarityColor = (rarity: string) => {
  const colors = {
    common: 'border-slate-500 bg-slate-500/10',
    rare: 'border-blue-500 bg-blue-500/10',
    epic: 'border-purple-500 bg-purple-500/10',
    legendary: 'border-yellow-500 bg-yellow-500/10'
  }
  return colors[rarity as keyof typeof colors] || 'border-slate-500 bg-slate-500/10'
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'activity'>('overview')

  const rankProgress = (mockUser.rank.points / (mockUser.rank.points + mockUser.rank.pointsToNextRank)) * 100

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-gaming-500 to-accent-500 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-slate-800 rounded-full p-1">
                  <div className={`text-2xl`}>
                    {getRankIcon(mockUser.rank.tier)}
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-gaming mb-2">
                  {mockUser.username}
                </h1>
                <div className="flex items-center space-x-4 text-slate-400">
                  <span>Member since {mockUser.joinedAt.toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Last active {mockUser.lastActive.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
              <CogIcon className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Rank Progress */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Current Rank</h2>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{getRankIcon(mockUser.rank.tier)}</div>
              <div className={`text-lg font-bold ${getRankColor(mockUser.rank.tier)} capitalize`}>
                {mockUser.rank.tier} {mockUser.rank.division}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-400">Rank Progress</span>
                <span className="text-white font-semibold">
                  {mockUser.rank.points.toLocaleString()} / {(mockUser.rank.points + mockUser.rank.pointsToNextRank).toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-gaming-500 to-accent-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${rankProgress}%` }}
                />
              </div>
              <div className="text-sm text-slate-400 mt-1">
                {mockUser.rank.pointsToNextRank} points to next rank
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Points</p>
                <p className="text-2xl font-bold text-accent-400 points-glow">
                  {mockUser.totalPoints.toLocaleString()}
                </p>
              </div>
              <StarIcon className="w-8 h-8 text-accent-500" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Games Played</p>
                <p className="text-2xl font-bold text-white">
                  {mockUser.gamesPlayed}
                </p>
              </div>
              <PlayIcon className="w-8 h-8 text-gaming-500" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Tournaments Won</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {mockUser.tournamentsWon}
                </p>
              </div>
              <TrophyIcon className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Achievements</p>
                <p className="text-2xl font-bold text-purple-500">
                  {mockUser.achievements.length}
                </p>
              </div>
              <SparklesIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-slate-800 rounded-xl">
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-gaming-400 border-b-2 border-gaming-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'achievements'
                  ? 'text-gaming-400 border-b-2 border-gaming-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Achievements
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'text-gaming-400 border-b-2 border-gaming-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Recent Activity
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Favorite Games */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Favorite Games</h3>
                  <div className="flex flex-wrap gap-3">
                    {mockUser.favoriteGames.map((game, index) => (
                      <div key={index} className="bg-slate-700 px-4 py-2 rounded-lg">
                        <span className="text-white">{game}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Achievements */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockUser.achievements.slice(0, 4).map((achievement) => (
                      <div key={achievement.id} className={`border-2 rounded-lg p-4 ${getRarityColor(achievement.rarity)}`}>
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{achievement.icon}</div>
                          <div>
                            <h4 className="font-semibold text-white">{achievement.name}</h4>
                            <p className="text-sm text-slate-400">{achievement.description}</p>
                            <p className="text-xs text-slate-500 mt-1">
                              {achievement.unlockedAt.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">All Achievements</h3>
                  <span className="text-slate-400">{mockUser.achievements.length} unlocked</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockUser.achievements.map((achievement) => (
                    <div key={achievement.id} className={`border-2 rounded-lg p-4 ${getRarityColor(achievement.rarity)}`}>
                      <div className="text-center">
                        <div className="text-3xl mb-2">{achievement.icon}</div>
                        <h4 className="font-semibold text-white mb-1">{achievement.name}</h4>
                        <p className="text-sm text-slate-400 mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded uppercase font-medium ${
                            achievement.rarity === 'legendary' 
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : achievement.rarity === 'epic'
                              ? 'bg-purple-500/20 text-purple-400'
                              : achievement.rarity === 'rare'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-slate-500/20 text-slate-400'
                          }`}>
                            {achievement.rarity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          {achievement.unlockedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <div className="space-y-4">
                  {mockRecentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{activity.title}</h4>
                        <p className="text-sm text-slate-400">{activity.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-slate-500">
                            {activity.date.toLocaleDateString()}
                          </span>
                          {activity.points > 0 && (
                            <span className="text-xs bg-accent-500/20 text-accent-400 px-2 py-1 rounded">
                              +{activity.points} points
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
