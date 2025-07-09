'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  TrophyIcon, 
  FireIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MapIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

interface GamingAccount {
  id: string
  platform: string
  username: string
  verified: boolean
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

interface Match {
  id: string
  gameMode: string
  map: string
  result: 'win' | 'loss' | 'draw'
  score: string
  kda: {
    kills: number
    deaths: number
    assists: number
  }
  agent?: string
  duration: number
  date: Date
}

interface GameDetailsProps {
  account: GamingAccount
}

const mockMatches: Match[] = [
  {
    id: '1',
    gameMode: 'Competitive',
    map: 'Ascent',
    result: 'win',
    score: '13-11',
    kda: { kills: 24, deaths: 18, assists: 7 },
    agent: 'Jett',
    duration: 45 * 60, // 45 minutes in seconds
    date: new Date('2024-12-15T20:30:00Z')
  },
  {
    id: '2',
    gameMode: 'Competitive',
    map: 'Haven',
    result: 'loss',
    score: '10-13',
    kda: { kills: 19, deaths: 21, assists: 5 },
    agent: 'Sage',
    duration: 42 * 60,
    date: new Date('2024-12-15T19:15:00Z')
  },
  {
    id: '3',
    gameMode: 'Unrated',
    map: 'Split',
    result: 'win',
    score: '13-8',
    kda: { kills: 22, deaths: 14, assists: 9 },
    agent: 'Phoenix',
    duration: 38 * 60,
    date: new Date('2024-12-14T21:45:00Z')
  },
  {
    id: '4',
    gameMode: 'Competitive',
    map: 'Bind',
    result: 'win',
    score: '13-6',
    kda: { kills: 26, deaths: 12, assists: 8 },
    agent: 'Reyna',
    duration: 35 * 60,
    date: new Date('2024-12-14T20:00:00Z')
  }
]

const getRankColor = (tier: string) => {
  const colors = {
    iron: 'text-gray-400',
    bronze: 'text-amber-600',
    silver: 'text-slate-400',
    gold: 'text-yellow-500',
    platinum: 'text-cyan-400',
    diamond: 'text-blue-400',
    immortal: 'text-purple-400',
    radiant: 'text-red-400'
  }
  return colors[tier?.toLowerCase() as keyof typeof colors] || 'text-slate-400'
}

const getRankIcon = (tier: string) => {
  const icons = {
    iron: '🔩',
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    platinum: '💎',
    diamond: '💠',
    immortal: '👑',
    radiant: '⭐'
  }
  return icons[tier?.toLowerCase() as keyof typeof icons] || '🏅'
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m`
}

const getResultColor = (result: string) => {
  switch (result) {
    case 'win':
      return 'text-green-400 bg-green-400/10 border-green-400/20'
    case 'loss':
      return 'text-red-400 bg-red-400/10 border-red-400/20'
    case 'draw':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    default:
      return 'text-slate-400 bg-slate-400/10 border-slate-400/20'
  }
}

export default function GameDetails({ account }: GameDetailsProps) {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMatchHistory()
  }, [account.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMatchHistory = async () => {
    if (!account.verified || account.platform !== 'valorant' && account.platform !== 'league') {
      // Use mock data for unverified accounts or non-Riot platforms
      setIsLoading(true)
      setTimeout(() => {
        setMatches(mockMatches)
        setIsLoading(false)
      }, 1000)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/user/gaming-accounts/${account.id}/matches`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch match history')
      }

      const data = await response.json()
      
      if (data.success) {
        // Transform API data to match our interface
        const transformedMatches = data.data.map((match: any) => ({
          id: match.matchId,
          gameMode: match.queueId || 'Competitive',
          map: match.mapId || 'Unknown',
          result: match.result || 'draw',
          score: match.score || 'N/A',
          kda: {
            kills: match.stats?.kills || 0,
            deaths: match.stats?.deaths || 0,
            assists: match.stats?.assists || 0
          },
          agent: match.agent || 'Unknown',
          duration: match.gameDuration || 0,
          date: new Date(match.gameCreation || Date.now())
        }))
        
        setMatches(transformedMatches)
      } else {
        throw new Error(data.message || 'Failed to fetch match history')
      }
    } catch (error: any) {
      console.error('Error fetching match history:', error)
      setError(error.message)
      // Fallback to mock data
      setMatches(mockMatches)
    } finally {
      setIsLoading(false)
    }
  }

  const winRate = matches.length > 0 
    ? (matches.filter(m => m.result === 'win').length / matches.length * 100).toFixed(1)
    : '0'

  const avgKDA = matches.length > 0
    ? {
        kills: (matches.reduce((sum, m) => sum + m.kda.kills, 0) / matches.length).toFixed(1),
        deaths: (matches.reduce((sum, m) => sum + m.kda.deaths, 0) / matches.length).toFixed(1),
        assists: (matches.reduce((sum, m) => sum + m.kda.assists, 0) / matches.length).toFixed(1)
      }
    : { kills: '0', deaths: '0', assists: '0' }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-800 rounded-lg p-4">
                <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-slate-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-slate-800 rounded-lg p-4">
                <div className="h-4 bg-slate-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error && matches.length === 0) {
    return (
      <div className="space-y-6">
        {/* Error Message */}
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
          <div className="text-red-400 mb-2">⚠️ Failed to Load Match History</div>
          <p className="text-slate-300 mb-4">{error}</p>
          <button
            onClick={fetchMatchHistory}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Account Header */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-white">
                {account.riotData?.gameName ? 
                  `${account.riotData.gameName}#${account.riotData.tagLine}` : 
                  account.username
                }
              </h2>
              {account.verified ? (
                <CheckCircleIcon className="w-6 h-6 text-green-500" />
              ) : (
                <ExclamationCircleIcon className="w-6 h-6 text-yellow-500" />
              )}
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              {account.riotData?.level && (
                <>
                  <span>Level {account.riotData.level}</span>
                  <span>•</span>
                </>
              )}
              <span className="capitalize">{account.platform}</span>
              <span>•</span>
              <span className={account.verified ? 'text-green-400' : 'text-yellow-400'}>
                {account.verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
          
          {account.riotData?.currentRank && (
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">{getRankIcon(account.riotData.currentRank.tier)}</span>
                <span className={`text-xl font-bold ${getRankColor(account.riotData.currentRank.tier)}`}>
                  {account.riotData.currentRank.tier} {account.riotData.currentRank.division}
                </span>
              </div>
              <div className="text-slate-400 text-sm">
                {account.riotData.currentRank.lp} LP
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrophyIcon className="w-5 h-5 text-yellow-500" />
            <span className="text-slate-400 text-sm">Win Rate</span>
          </div>
          <div className="text-2xl font-bold text-white">{winRate}%</div>
          <div className="text-xs text-slate-500">{matches.filter(m => m.result === 'win').length} wins</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FireIcon className="w-5 h-5 text-red-500" />
            <span className="text-slate-400 text-sm">Avg K/D/A</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {avgKDA.kills}/{avgKDA.deaths}/{avgKDA.assists}
          </div>
          <div className="text-xs text-slate-500">
            {((parseFloat(avgKDA.kills) + parseFloat(avgKDA.assists)) / parseFloat(avgKDA.deaths)).toFixed(2)} KDA
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ChartBarIcon className="w-5 h-5 text-blue-500" />
            <span className="text-slate-400 text-sm">Games Played</span>
          </div>
          <div className="text-2xl font-bold text-white">{matches.length}</div>
          <div className="text-xs text-slate-500">Last 30 days</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ClockIcon className="w-5 h-5 text-purple-500" />
            <span className="text-slate-400 text-sm">Avg Duration</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatDuration(matches.reduce((sum, m) => sum + m.duration, 0) / matches.length || 0)}
          </div>
          <div className="text-xs text-slate-500">Per match</div>
        </div>
      </div>

      {/* Error Banner (if there were issues loading some data) */}
      {error && matches.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <ExclamationCircleIcon className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-300 text-sm">
              Some match data may be incomplete: {error}
            </span>
          </div>
        </div>
      )}

      {/* Recent Matches */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-4">Recent Matches</h3>
        
        {matches.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-4">
              <ChartBarIcon className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <p className="text-slate-400">No recent matches found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matches.map((match) => (
              <div key={match.id} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getResultColor(match.result)}`}>
                      {match.result.toUpperCase()}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-slate-300">
                      <MapIcon className="w-4 h-4" />
                      <span>{match.map}</span>
                    </div>
                    
                    <div className="text-slate-400 text-sm">
                      {match.gameMode}
                    </div>
                    
                    {match.agent && (
                      <div className="flex items-center space-x-2 text-slate-300">
                        <UserIcon className="w-4 h-4" />
                        <span>{match.agent}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-right">
                    <div className="text-slate-300">
                      <div className="font-semibold">{match.score}</div>
                      <div className="text-xs text-slate-500">{formatDuration(match.duration)}</div>
                    </div>
                    
                    <div className="text-slate-300">
                      <div className="font-semibold">
                        {match.kda.kills}/{match.kda.deaths}/{match.kda.assists}
                      </div>
                      <div className="text-xs text-slate-500">
                        {((match.kda.kills + match.kda.assists) / match.kda.deaths).toFixed(2)} KDA
                      </div>
                    </div>
                    
                    <div className="text-slate-400 text-sm min-w-[80px]">
                      <div>{match.date.toLocaleDateString()}</div>
                      <div>{match.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
