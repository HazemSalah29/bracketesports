'use client'

import { useState } from 'react'
import {
  ChartBarIcon,
  TrophyIcon,
  StarIcon,
  UsersIcon,
  CalendarIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

const mockAnalytics = {
  overview: {
    totalPoints: 12500,
    pointsThisMonth: 2300,
    pointsChange: 15.2,
    tournamentsPlayed: 45,
    tournamentsWon: 23,
    winRate: 51.1,
    currentStreak: 5,
    longestStreak: 12,
    averagePosition: 3.2
  },
  monthlyPoints: [
    { month: 'Jul', points: 1800 },
    { month: 'Aug', points: 2100 },
    { month: 'Sep', points: 1950 },
    { month: 'Oct', points: 2400 },
    { month: 'Nov', points: 2800 },
    { month: 'Dec', points: 2300 }
  ],
  gamePerformance: [
    {
      game: 'Counter-Strike 2',
      tournamentsPlayed: 18,
      tournamentsWon: 9,
      winRate: 50.0,
      averagePosition: 3.1,
      pointsEarned: 4500
    },
    {
      game: 'Valorant',
      tournamentsPlayed: 12,
      tournamentsWon: 8,
      winRate: 66.7,
      averagePosition: 2.3,
      pointsEarned: 3200
    },
    {
      game: 'Rocket League',
      tournamentsPlayed: 8,
      tournamentsWon: 4,
      winRate: 50.0,
      averagePosition: 3.5,
      pointsEarned: 2400
    },
    {
      game: 'League of Legends',
      tournamentsPlayed: 7,
      tournamentsWon: 2,
      winRate: 28.6,
      averagePosition: 4.2,
      pointsEarned: 2400
    }
  ],
  recentTournaments: [
    {
      id: '1',
      name: 'CS2 Winter Championship',
      game: 'Counter-Strike 2',
      date: new Date('2024-12-15T20:00:00Z'),
      position: 1,
      participants: 64,
      pointsEarned: 500
    },
    {
      id: '2',
      name: 'Valorant Pro Series',
      game: 'Valorant',
      date: new Date('2024-12-12T18:00:00Z'),
      position: 2,
      participants: 32,
      pointsEarned: 300
    },
    {
      id: '3',
      name: 'RL Championship',
      game: 'Rocket League',
      date: new Date('2024-12-08T19:00:00Z'),
      position: 3,
      participants: 48,
      pointsEarned: 200
    }
  ]
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

  const getPositionColor = (position: number) => {
    if (position === 1) return 'text-yellow-500'
    if (position === 2) return 'text-slate-400'
    if (position === 3) return 'text-amber-600'
    return 'text-slate-500'
  }

  const getPositionIcon = (position: number) => {
    if (position === 1) return '🥇'
    if (position === 2) return '🥈'
    if (position === 3) return '🥉'
    return `#${position}`
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <ChartBarIcon className="w-8 h-8 text-gaming-500" />
                <h1 className="text-3xl font-bold text-white font-gaming">Analytics</h1>
              </div>
              <p className="text-slate-400">
                Track your performance and progress across tournaments
              </p>
            </div>
            
            {/* Time Range Selector */}
            <div className="flex bg-slate-800 rounded-lg p-1">
              {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                    timeRange === range
                      ? 'bg-gaming-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Points</p>
                <p className="text-2xl font-bold text-accent-400">
                  {mockAnalytics.overview.totalPoints.toLocaleString()}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-500">+{mockAnalytics.overview.pointsChange}%</span>
                </div>
              </div>
              <StarIcon className="w-8 h-8 text-accent-500" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-white">
                  {mockAnalytics.overview.winRate}%
                </p>
                <p className="text-sm text-slate-400">
                  {mockAnalytics.overview.tournamentsWon}/{mockAnalytics.overview.tournamentsPlayed} tournaments
                </p>
              </div>
              <TrophyIcon className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-white">
                  {mockAnalytics.overview.currentStreak}
                </p>
                <p className="text-sm text-slate-400">
                  Best: {mockAnalytics.overview.longestStreak}
                </p>
              </div>
              <FireIcon className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Avg. Position</p>
                <p className="text-2xl font-bold text-white">
                  {mockAnalytics.overview.averagePosition}
                </p>
                <p className="text-sm text-slate-400">
                  Last 10 tournaments
                </p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Points Chart */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Points Over Time</h2>
            <div className="space-y-4">
              {mockAnalytics.monthlyPoints.map((data, index) => (
                <div key={data.month} className="flex items-center justify-between">
                  <span className="text-slate-400">{data.month}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-gaming-500 to-accent-500 h-2 rounded-full"
                        style={{ width: `${(data.points / 3000) * 100}%` }}
                      />
                    </div>
                    <span className="text-white font-medium w-16 text-right">
                      {data.points.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Performance */}
          <div className="bg-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Performance by Game</h2>
            <div className="space-y-4">
              {mockAnalytics.gamePerformance.map((game) => (
                <div key={game.game} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{game.game}</h3>
                    <span className="text-accent-400 font-semibold">
                      {game.pointsEarned.toLocaleString()} pts
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Win Rate</span>
                      <div className="text-white font-medium">{game.winRate}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Avg. Position</span>
                      <div className="text-white font-medium">{game.averagePosition}</div>
                    </div>
                    <div>
                      <span className="text-slate-400">Tournaments</span>
                      <div className="text-white font-medium">{game.tournamentsPlayed}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Tournaments */}
        <div className="mt-8 bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Tournament Results</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 font-medium py-3">Tournament</th>
                  <th className="text-left text-slate-400 font-medium py-3">Game</th>
                  <th className="text-left text-slate-400 font-medium py-3">Date</th>
                  <th className="text-left text-slate-400 font-medium py-3">Position</th>
                  <th className="text-left text-slate-400 font-medium py-3">Participants</th>
                  <th className="text-left text-slate-400 font-medium py-3">Points</th>
                </tr>
              </thead>
              <tbody>
                {mockAnalytics.recentTournaments.map((tournament) => (
                  <tr key={tournament.id} className="border-b border-slate-700/50">
                    <td className="py-4">
                      <div className="font-medium text-white">{tournament.name}</div>
                    </td>
                    <td className="py-4 text-slate-400">{tournament.game}</td>
                    <td className="py-4 text-slate-400">
                      {tournament.date.toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span className={`font-semibold ${getPositionColor(tournament.position)}`}>
                        {getPositionIcon(tournament.position)}
                      </span>
                    </td>
                    <td className="py-4 text-slate-400">{tournament.participants}</td>
                    <td className="py-4">
                      <span className="text-accent-400 font-semibold">
                        +{tournament.pointsEarned}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 bg-gradient-to-r from-gaming-600/10 to-accent-600/10 border border-gaming-500/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Performance Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-white mb-2">🎯 Strengths</h3>
              <ul className="text-slate-300 space-y-1">
                <li>• Excellent performance in Valorant (66.7% win rate)</li>
                <li>• Consistent top-3 finishes in team tournaments</li>
                <li>• Strong recent form with 5-game win streak</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">📈 Areas for Improvement</h3>
              <ul className="text-slate-300 space-y-1">
                <li>• Focus on League of Legends performance</li>
                <li>• Participate in more solo tournaments</li>
                <li>• Improve consistency in Rocket League</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
