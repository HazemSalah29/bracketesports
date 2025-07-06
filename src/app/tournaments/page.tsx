'use client'

import { useState } from 'react'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import TournamentCard from '@/components/dashboard/TournamentCard'

const mockTournaments = [
  {
    id: '1',
    name: 'CS2 Winter Championship',
    description: 'Elite Counter-Strike 2 tournament featuring top players',
    game: 'Counter-Strike 2',
    gameIcon: '🎯',
    pointsReward: 2500,
    sponsoredBy: 'SteelSeries',
    maxParticipants: 128,
    currentParticipants: 64,
    startDate: new Date('2025-01-15T18:00:00Z'),
    endDate: new Date('2025-01-15T22:00:00Z'),
    registrationDeadline: new Date('2025-01-14T23:59:59Z'),
    status: 'registering' as const,
    rules: ['Standard CS2 competitive rules', 'Best of 3 format', 'No cheating or exploits'],
    skillRequirement: {
      minRank: { tier: 'bronze' as const, division: 1 as const, points: 0, pointsToNextRank: 1000, season: '2025-S1' },
      description: 'All skill levels welcome'
    },
    tournamentType: 'solo' as const,
    rewards: [
      { position: 1, points: 2500, badges: [{ id: 'champion-cs2-winter', name: 'CS2 Winter Champion', description: 'Champion of CS2 Winter Championship', icon: '🏆', type: 'tournament' as const, rarity: 'legendary' as const, unlockedAt: new Date() }] },
      { position: 2, points: 1500, badges: [{ id: 'runnerup-cs2-winter', name: 'Runner-up', description: 'Second place in CS2 Winter Championship', icon: '🥈', type: 'tournament' as const, rarity: 'epic' as const, unlockedAt: new Date() }] },
      { position: 3, points: 1000, badges: [{ id: 'third-cs2-winter', name: 'Third Place', description: 'Third place in CS2 Winter Championship', icon: '🥉', type: 'tournament' as const, rarity: 'rare' as const, unlockedAt: new Date() }] },
    ],
    createdAt: new Date('2024-12-01T10:00:00Z'),
    updatedAt: new Date('2024-12-01T10:00:00Z'),
  },
  {
    id: '2',
    name: 'Valorant Pro Series',
    description: 'Team-based Valorant tournament for skilled players',
    game: 'Valorant',
    gameIcon: '⚡',
    pointsReward: 1800,
    sponsoredBy: 'Riot Games',
    maxParticipants: 64,
    currentParticipants: 32,
    startDate: new Date('2025-01-12T20:00:00Z'),
    endDate: new Date('2025-01-13T02:00:00Z'),
    registrationDeadline: new Date('2025-01-11T23:59:59Z'),
    status: 'registering' as const,
    rules: ['Standard Valorant competitive rules', 'Best of 3 format', 'Team communication required'],
    skillRequirement: {
      minRank: { tier: 'silver' as const, division: 1 as const, points: 1000, pointsToNextRank: 1000, season: '2025-S1' },
      description: 'Intermediate+ players only'
    },
    tournamentType: 'team' as const,
    teamSize: 5,
    rewards: [
      { position: 1, points: 1800, badges: [{ id: 'champion-valorant-pro', name: 'Valorant Pro Champion', description: 'Champion of Valorant Pro Series', icon: '🏆', type: 'tournament' as const, rarity: 'legendary' as const, unlockedAt: new Date() }] },
      { position: 2, points: 1200, badges: [{ id: 'runnerup-valorant-pro', name: 'Runner-up', description: 'Second place in Valorant Pro Series', icon: '🥈', type: 'tournament' as const, rarity: 'epic' as const, unlockedAt: new Date() }] },
      { position: 3, points: 800, badges: [{ id: 'third-valorant-pro', name: 'Third Place', description: 'Third place in Valorant Pro Series', icon: '🥉', type: 'tournament' as const, rarity: 'rare' as const, unlockedAt: new Date() }] },
    ],
    createdAt: new Date('2024-12-01T10:00:00Z'),
    updatedAt: new Date('2024-12-01T10:00:00Z'),
  },
  {
    id: '3',
    name: 'Elite Rocket League Cup',
    description: 'Exclusive Rocket League tournament for expert players',
    game: 'Rocket League',
    gameIcon: '🚗',
    pointsReward: 3200,
    sponsoredBy: 'Red Bull',
    maxParticipants: 32,
    currentParticipants: 24,
    startDate: new Date('2025-01-10T19:00:00Z'),
    endDate: new Date('2025-01-11T01:00:00Z'),
    registrationDeadline: new Date('2025-01-09T23:59:59Z'),
    status: 'registering' as const,
    rules: ['Standard Rocket League competitive rules', 'Best of 5 format', 'Team coordination essential'],
    skillRequirement: {
      minRank: { tier: 'gold' as const, division: 1 as const, points: 2000, pointsToNextRank: 1000, season: '2025-S1' },
      description: 'Expert players only'
    },
    tournamentType: 'team' as const,
    teamSize: 3,
    rewards: [
      { position: 1, points: 3200, badges: [{ id: 'champion-rl-elite', name: 'Rocket League Elite Champion', description: 'Champion of Elite Rocket League Cup', icon: '🏆', type: 'tournament' as const, rarity: 'legendary' as const, unlockedAt: new Date() }] },
      { position: 2, points: 2000, badges: [{ id: 'runnerup-rl-elite', name: 'Runner-up', description: 'Second place in Elite Rocket League Cup', icon: '🥈', type: 'tournament' as const, rarity: 'epic' as const, unlockedAt: new Date() }] },
      { position: 3, points: 1200, badges: [{ id: 'third-rl-elite', name: 'Third Place', description: 'Third place in Elite Rocket League Cup', icon: '🥉', type: 'tournament' as const, rarity: 'rare' as const, unlockedAt: new Date() }] },
    ],
    createdAt: new Date('2024-12-01T10:00:00Z'),
    updatedAt: new Date('2024-12-01T10:00:00Z'),
  },
]

export default function TournamentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGame, setSelectedGame] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const filteredTournaments = mockTournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.game.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGame = selectedGame === 'all' || tournament.game === selectedGame
    const matchesStatus = selectedStatus === 'all' || tournament.status === selectedStatus
    
    return matchesSearch && matchesGame && matchesStatus
  })

  const handleJoinTournament = (tournamentId: string) => {
    console.log('Joining tournament:', tournamentId)
  }

  return (
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
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <TournamentCard 
              key={tournament.id}
              tournament={tournament}
              onJoin={() => handleJoinTournament(tournament.id)}
            />
          ))}
        </div>

        {filteredTournaments.length === 0 && (
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
  )
}
