'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ClockIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

interface Creator {
  id: string
  handle: string
  tier: string
  followerCount: number
  user: {
    username: string
    avatar?: string
  }
}

interface Tournament {
  id: string
  name: string
  description: string
  game: string
  entryFeeCoin: number
  maxParticipants: number
  currentParticipants: number
  startDate: string
  status: string
  prizeType: string
  prizeDescription: string
  creator: Creator
  isCreatorTournament: boolean
}

export default function TournamentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGame, setSelectedGame] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [featuredCreators, setFeaturedCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTournaments()
    fetchFeaturedCreators()
  }, [])

  const fetchTournaments = async () => {
    try {
      // Mock data for now - replace with real API call
      const mockTournaments: Tournament[] = [
        {
          id: '1',
          name: 'Saturday Night Valorant',
          description: 'Join me for a fun evening of competitive Valorant! All skill levels welcome.',
          game: 'VALORANT',
          entryFeeCoin: 200,
          maxParticipants: 32,
          currentParticipants: 18,
          startDate: '2025-01-11T20:00:00Z',
          status: 'registering',
          prizeType: 'EXPERIENCE',
          prizeDescription: '1-on-1 coaching session + Discord VIP role',
          creator: {
            id: 'c1',
            handle: 'valorantpro',
            tier: 'PARTNER',
            followerCount: 450000,
            user: {
              username: 'ValorantPro',
              avatar: '/images/creators/valorantpro.jpg'
            }
          },
          isCreatorTournament: true
        },
        {
          id: '2',
          name: 'League Coaching Bootcamp',
          description: 'Learn from a Diamond player! Improve your gameplay with personalized coaching.',
          game: 'LEAGUE_OF_LEGENDS',
          entryFeeCoin: 500,
          maxParticipants: 16,
          currentParticipants: 12,
          startDate: '2025-01-13T18:00:00Z',
          status: 'registering',
          prizeType: 'HYBRID',
          prizeDescription: 'Winner gets $100 cash + 30min coaching session',
          creator: {
            id: 'c2',
            handle: 'leaguecoach',
            tier: 'RISING',
            followerCount: 125000,
            user: {
              username: 'LeagueCoach',
              avatar: '/images/creators/leaguecoach.jpg'
            }
          },
          isCreatorTournament: true
        },
        {
          id: '3',
          name: 'Bronze to Gold Challenge',
          description: 'Perfect for lower-ranked players looking to improve and have fun!',
          game: 'VALORANT',
          entryFeeCoin: 150,
          maxParticipants: 24,
          currentParticipants: 24,
          startDate: '2025-01-12T19:00:00Z',
          status: 'full',
          prizeType: 'COINS',
          prizeDescription: 'Winner: 1000 coins, Runner-up: 500 coins',
          creator: {
            id: 'c3',
            handle: 'skillbuilder',
            tier: 'EMERGING',
            followerCount: 35000,
            user: {
              username: 'SkillBuilder',
              avatar: '/images/creators/skillbuilder.jpg'
            }
          },
          isCreatorTournament: true
        }
      ]
      setTournaments(mockTournaments)
    } catch (error) {
      console.error('Failed to fetch tournaments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedCreators = async () => {
    try {
      // Mock data for featured creators
      const mockCreators: Creator[] = [
        {
          id: 'c1',
          handle: 'valorantpro',
          tier: 'PARTNER',
          followerCount: 450000,
          user: {
            username: 'ValorantPro',
            avatar: '/images/creators/valorantpro.jpg'
          }
        },
        {
          id: 'c2',
          handle: 'leaguecoach',
          tier: 'RISING',
          followerCount: 125000,
          user: {
            username: 'LeagueCoach',
            avatar: '/images/creators/leaguecoach.jpg'
          }
        }
      ]
      setFeaturedCreators(mockCreators)
    } catch (error) {
      console.error('Failed to fetch featured creators:', error)
    }
  }

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.creator.user.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGame = selectedGame === 'all' || tournament.game === selectedGame
    const matchesPrice = selectedPriceRange === 'all' || 
                        (selectedPriceRange === 'low' && tournament.entryFeeCoin <= 200) ||
                        (selectedPriceRange === 'medium' && tournament.entryFeeCoin > 200 && tournament.entryFeeCoin <= 500) ||
                        (selectedPriceRange === 'high' && tournament.entryFeeCoin > 500)
    
    return matchesSearch && matchesGame && matchesPrice
  })

  const joinTournament = async (tournamentId: string) => {
    try {
      // This would handle coin payment and tournament registration
      console.log('Joining tournament:', tournamentId)
      alert('Tournament join functionality will be implemented with payment processing')
    } catch (error) {
      console.error('Failed to join tournament:', error)
    }
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'ELITE': return 'bg-purple-900 text-purple-300 border border-purple-700'
      case 'PARTNER': return 'bg-blue-900 text-blue-300 border border-blue-700'
      case 'RISING': return 'bg-green-900 text-green-300 border border-green-700'
      case 'EMERGING': return 'bg-yellow-900 text-yellow-300 border border-yellow-700'
      default: return 'bg-slate-700 text-slate-300 border border-slate-600'
    }
  }

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Creator Tournaments</h1>
          <p className="text-slate-300 mt-1">
            Play with your favorite creators and win amazing prizes!
          </p>
        </div>

        {/* Featured Creators */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Featured Creators</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {featuredCreators.map((creator) => (
              <div key={creator.id} className="flex-shrink-0 bg-slate-800 rounded-lg border border-slate-700 p-4 min-w-[200px]">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {creator.user.username.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{creator.user.username}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierBadgeColor(creator.tier)}`}>
                        {creator.tier}
                      </span>
                      <span className="text-sm text-slate-400">
                        {formatFollowerCount(creator.followerCount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg mb-6 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tournaments or creators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all" className="bg-slate-700 text-white">All Games</option>
                <option value="VALORANT" className="bg-slate-700 text-white">Valorant</option>
                <option value="LEAGUE_OF_LEGENDS" className="bg-slate-700 text-white">League of Legends</option>
              </select>
              
              <select
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all" className="bg-slate-700 text-white">All Prices</option>
                <option value="low" className="bg-slate-700 text-white">Low (≤200 coins)</option>
                <option value="medium" className="bg-slate-700 text-white">Medium (201-500 coins)</option>
                <option value="high" className="bg-slate-700 text-white">High (&gt;500 coins)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tournament Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <div key={tournament.id} className="bg-slate-800 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors">
              {/* Tournament Header */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">
                    {tournament.name}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    tournament.status === 'registering' ? 'bg-green-900 text-green-300 border border-green-700' :
                    tournament.status === 'full' ? 'bg-red-900 text-red-300 border border-red-700' :
                    'bg-slate-700 text-slate-300 border border-slate-600'
                  }`}>
                    {tournament.status === 'registering' ? 'Open' :
                     tournament.status === 'full' ? 'Full' : tournament.status}
                  </span>
                </div>
                
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                  {tournament.description}
                </p>

                {/* Creator Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {tournament.creator.user.username.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {tournament.creator.user.username}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTierBadgeColor(tournament.creator.tier)}`}>
                        {tournament.creator.tier}
                      </span>
                      <span className="text-xs text-slate-400">
                        {formatFollowerCount(tournament.creator.followerCount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tournament Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <CurrencyDollarIcon className="h-4 w-4 text-yellow-500" />
                    <span className="text-slate-300">{tournament.entryFeeCoin} coins</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-slate-300">{tournament.currentParticipants}/{tournament.maxParticipants}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">{new Date(tournament.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrophyIcon className="h-4 w-4 text-slate-400" />
                    <span className="text-green-400">{tournament.prizeType}</span>
                  </div>
                </div>
              </div>

              {/* Prize Description */}
              <div className="p-4 bg-slate-700 border-t border-slate-600">
                <h4 className="text-sm font-medium text-white mb-1">Prize:</h4>
                <p className="text-sm text-slate-300">{tournament.prizeDescription}</p>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-4">
                <button
                  onClick={() => joinTournament(tournament.id)}
                  disabled={tournament.status === 'full'}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    tournament.status === 'full'
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  {tournament.status === 'full' ? 'Tournament Full' : 
                   `Join for ${tournament.entryFeeCoin} coins`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTournaments.length === 0 && (
          <div className="text-center py-12">
            <TrophyIcon className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No tournaments found</h3>
            <p className="text-slate-400">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
