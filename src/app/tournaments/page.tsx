'use client'

import { useState, useEffect } from 'react'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import TournamentCard from '@/components/dashboard/TournamentCard'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Tournament } from '@/types'
import { apiClient } from '@/lib/api-client'

export default function TournamentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGame, setSelectedGame] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getTournaments()
        if (response?.data) {
          // Transform the data to match the Tournament interface
          const transformedTournaments = response.data.map((tournament: any) => ({
            ...tournament,
            startDate: new Date(tournament.startDate),
            endDate: new Date(tournament.endDate),
            registrationDeadline: new Date(tournament.registrationEnd),
            createdAt: new Date(tournament.createdAt),
            updatedAt: new Date(tournament.updatedAt)
          }))
          setTournaments(transformedTournaments)
        }
      } catch (err) {
        console.error('Failed to fetch tournaments:', err)
        setError('Failed to load tournaments')
        // Fallback to empty array
        setTournaments([])
      } finally {
        setLoading(false)
      }
    }

    fetchTournaments()
  }, [])

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.game.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGame = selectedGame === 'all' || tournament.game === selectedGame
    const matchesStatus = selectedStatus === 'all' || tournament.status === selectedStatus
    
    return matchesSearch && matchesGame && matchesStatus
  })

  const handleJoinTournament = async (tournamentId: string) => {
    try {
      await apiClient.joinTournament(tournamentId)
      // Refresh tournaments to show updated participant count
      const response = await apiClient.getTournaments()
      if (response?.data) {
        const transformedTournaments = response.data.map((tournament: any) => ({
          ...tournament,
          startDate: new Date(tournament.startDate),
          endDate: new Date(tournament.endDate),
          registrationDeadline: new Date(tournament.registrationEnd),
          createdAt: new Date(tournament.createdAt),
          updatedAt: new Date(tournament.updatedAt)
        }))
        setTournaments(transformedTournaments)
      }
    } catch (err) {
      console.error('Failed to join tournament:', err)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-gaming mb-2">
                All Tournaments
              </h1>
              <p className="text-slate-400">
                Browse and join tournaments across all games
              </p>
            </div>
            <button className="bg-gaming-600 hover:bg-gaming-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
              <PlusIcon className="w-5 h-5" />
              <span>Create Tournament</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-slate-800 rounded-xl p-6">
          <div className="flex items-center space-x-4 mb-4">
            <FunnelIcon className="w-5 h-5 text-slate-400" />
            <span className="text-white font-semibold">Filters</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Search</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2">Game</label>
              <select 
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
              >
                <option value="all">All Games</option>
                <option value="Counter-Strike 2">Counter-Strike 2</option>
                <option value="Valorant">Valorant</option>
                <option value="Rocket League">Rocket League</option>
                <option value="League of Legends">League of Legends</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-slate-300 mb-2">Status</label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="registering">Open for Registration</option>
                <option value="live">Live</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tournament Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gaming-500"></div>
            <span className="ml-3 text-slate-400">Loading tournaments...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-red-400 mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gaming-600 hover:bg-gaming-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <TournamentCard 
                key={tournament.id}
                tournament={tournament}
                onJoin={() => handleJoinTournament(tournament.id)}
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredTournaments.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-slate-400 mb-2">
              No tournaments found
            </h3>
            <p className="text-slate-500">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  )
}
