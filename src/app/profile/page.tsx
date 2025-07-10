'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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
  SparklesIcon,
  PlayIcon as GamepadIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import GamingAccounts from '@/components/profile/GamingAccounts'
import GameDetails from '@/components/profile/GameDetails'
import type { UserActivity, Achievement } from '@/types'

interface GamingAccount {
  id: string
  platform: string
  username: string
  platformId: string
  verified: boolean
  createdAt: string
  riotData?: {
    gameName: string
    tagLine: string
    puuid: string
    level: number
    currentRank?: {
      tier: string
      division: string
      lp: number
    }
  }
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'activity' | 'accounts'>('accounts')
  const [selectedAccount, setSelectedAccount] = useState<GamingAccount | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [userActivity, setUserActivity] = useState<UserActivity[]>([])
  const [coinBalance, setCoinBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingActivity, setIsLoadingActivity] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserProfile()
      fetchCoinBalance()
    }
  }, [user])

  const fetchCoinBalance = async () => {
    try {
      const data = await apiClient.getCoinBalance()
      setCoinBalance(data.balance)
    } catch (error) {
      console.error('Failed to fetch coin balance:', error)
    }
  }

  useEffect(() => {
    if (user && activeTab === 'activity') {
      fetchUserActivity()
    }
  }, [user, activeTab])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      const profile = await apiClient.getProfile()
      setUserProfile(profile)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserActivity = async () => {
    try {
      setIsLoadingActivity(true)
      const activityData = await apiClient.getUserActivity(10)
      setUserActivity(activityData.activities || [])
    } catch (error) {
      console.error('Failed to fetch user activity:', error)
      setUserActivity([])
    } finally {
      setIsLoadingActivity(false)
    }
  }

  const displayUser = userProfile || user || {
    username: 'User',
    rank: { tier: 'bronze', division: 1, points: 0, pointsToNextRank: 1000 },
    totalPoints: 0,
    gamesPlayed: 0,
    tournamentsWon: 0,
    achievements: [],
    joinedAt: new Date(),
    lastActive: new Date()
  }
  const rankProgress = displayUser.rank ? 
    (displayUser.rank.points / (displayUser.rank.points + displayUser.rank.pointsToNextRank)) * 100 : 0

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="bg-slate-800 rounded-xl p-6 h-32"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-slate-800 rounded-xl p-6 h-24"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

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
                    {getRankIcon(displayUser.rank?.tier || 'bronze')}
                  </div>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-gaming mb-2">
                  {displayUser.username || 'User'}
                </h1>
                <div className="flex items-center space-x-4 text-slate-400">
                  <span>Member since {displayUser.joinedAt ? new Date(displayUser.joinedAt).toLocaleDateString() : 'Unknown'}</span>
                  <span>•</span>
                  <span>Last active {displayUser.lastActive ? new Date(displayUser.lastActive).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>
            </div>
            <Link 
              href="/settings"
              className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <CogIcon className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* Rank Progress */}
        <div className="bg-slate-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Current Rank</h2>
          <div className="flex items-center space-x-6">              <div className="text-center">
                <div className="text-4xl mb-2">{getRankIcon(displayUser.rank?.tier || 'bronze')}</div>
                <div className={`text-lg font-bold ${getRankColor(displayUser.rank?.tier || 'bronze')} capitalize`}>
                  {displayUser.rank?.tier || 'Unranked'} {displayUser.rank?.division || ''}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400">Rank Progress</span>
                  <span className="text-white font-semibold">
                    {displayUser.rank?.points?.toLocaleString() || '0'} / {((displayUser.rank?.points || 0) + (displayUser.rank?.pointsToNextRank || 1000)).toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-gaming-500 to-accent-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${rankProgress}%` }}
                  />
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  {displayUser.rank?.pointsToNextRank || 1000} points to next rank
                </div>
              </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-r from-yellow-600 to-amber-500 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Bracket Coins</p>
                <p className="text-2xl font-bold text-white coin-glow">
                  {coinBalance.toLocaleString()}
                </p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-white" />
            </div>
            <Link
              href="/coins"
              className="block mt-3 text-xs text-yellow-100 hover:text-white transition-colors"
            >
              Buy more coins →
            </Link>
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Points</p>
                <p className="text-2xl font-bold text-accent-400 points-glow">
                  {displayUser.totalPoints?.toLocaleString() || '0'}
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
                  {displayUser.gamesPlayed || 0}
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
                  {displayUser.tournamentsWon || 0}
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
                  {displayUser.achievements?.length || 0}
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
            <button
              onClick={() => setActiveTab('accounts')}
              className={`px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'accounts'
                  ? 'text-gaming-400 border-b-2 border-gaming-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gaming Accounts
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Favorite Games */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Favorite Games</h3>
                  <div className="flex flex-wrap gap-3">
                    {displayUser.favoriteGames && displayUser.favoriteGames.length > 0 ? (
                      displayUser.favoriteGames.map((game: string, index: number) => (
                        <div key={index} className="bg-slate-700 px-4 py-2 rounded-lg">
                          <span className="text-white">{game}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400">
                        No favorite games set. Update your profile to add favorite games.
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Achievements */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayUser.achievements && displayUser.achievements.length > 0 ? (
                      displayUser.achievements.slice(0, 4).map((achievement: Achievement) => (
                        <div key={achievement.id} className={`border-2 rounded-lg p-4 ${getRarityColor(achievement.rarity)}`}>
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div>
                              <h4 className="font-semibold text-white">{achievement.name}</h4>
                              <p className="text-sm text-slate-400">{achievement.description}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {new Date(achievement.unlockedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center text-slate-400 py-8">
                        No achievements unlocked yet. Participate in tournaments to start earning achievements!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">All Achievements</h3>
                  <span className="text-slate-400">
                    {displayUser.achievements?.length || 0} unlocked
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayUser.achievements && displayUser.achievements.length > 0 ? (
                    displayUser.achievements.map((achievement: Achievement) => (
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
                            {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center text-slate-400 py-12">
                      <SparklesIcon className="w-16 h-16 mx-auto opacity-50 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
                      <p>Participate in tournaments and complete challenges to earn achievements!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                {isLoadingActivity ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                          <div className="w-10 h-10 bg-slate-600 rounded-full"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                            <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : userActivity.length > 0 ? (
                  <div className="space-y-4">
                    {userActivity.map((activity: UserActivity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                        <div className="flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{activity.title}</h4>
                          <p className="text-sm text-slate-400">{activity.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs text-slate-500">
                              {new Date(activity.date).toLocaleDateString()}
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
                ) : (
                  <div className="text-center text-slate-400 py-12">
                    <CalendarIcon className="w-16 h-16 mx-auto opacity-50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
                    <p>Start participating in tournaments to see your activity here!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'accounts' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Gaming Accounts List */}
                <div className="lg:col-span-4">
                  <GamingAccounts 
                    onAccountSelect={setSelectedAccount}
                    selectedAccountId={selectedAccount?.id}
                  />
                </div>

                {/* Game Details */}
                <div className="lg:col-span-8">
                  {selectedAccount ? (
                    <GameDetails account={selectedAccount} />
                  ) : (
                    <div className="bg-slate-800 rounded-lg p-8 text-center">
                      <div className="text-slate-400 mb-4">
                        <GamepadIcon className="w-16 h-16 mx-auto opacity-50" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Select a Gaming Account
                      </h3>
                      <p className="text-slate-400">
                        Choose an account from the left to view your game stats and recent matches
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

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
    case 'tournament_place':
      return <TrophyIcon className="w-5 h-5 text-orange-500" />
    case 'achievement':
      return <StarIcon className="w-5 h-5 text-purple-500" />
    case 'rank_up':
      return <ChartBarIcon className="w-5 h-5 text-green-500" />
    case 'tournament_participate':
      return <PlayIcon className="w-5 h-5 text-blue-500" />
    case 'match_win':
      return <TrophyIcon className="w-5 h-5 text-green-500" />
    case 'match_loss':
      return <PlayIcon className="w-5 h-5 text-red-500" />
    case 'team_join':
      return <UsersIcon className="w-5 h-5 text-blue-500" />
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
