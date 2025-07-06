'use client'

import { useState } from 'react'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  UsersIcon,
  StarIcon,
  ShieldCheckIcon,
  CalendarIcon,
  TrophyIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface Team {
  id: string
  name: string
  description: string
  logo?: string
  captainId: string
  captainName: string
  members: TeamMember[]
  maxMembers: number
  isPrivate: boolean
  isRecruiting: boolean
  rank: {
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster'
    division: 1 | 2 | 3 | 4 | 5
    points: number
  }
  achievements: number
  tournamentsWon: number
  games: string[]
  createdAt: Date
}

interface TeamMember {
  id: string
  username: string
  role: 'captain' | 'player' | 'substitute'
  joinedAt: Date
  isActive: boolean
}

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Cyber Wolves',
    description: 'Professional esports team focusing on FPS games. Looking for skilled players.',
    logo: '🐺',
    captainId: '1',
    captainName: 'WolfLeader',
    members: [
      { id: '1', username: 'WolfLeader', role: 'captain', joinedAt: new Date('2024-01-15'), isActive: true },
      { id: '2', username: 'SniperWolf', role: 'player', joinedAt: new Date('2024-02-01'), isActive: true },
      { id: '3', username: 'CyberPack', role: 'player', joinedAt: new Date('2024-02-15'), isActive: true },
    ],
    maxMembers: 6,
    isPrivate: false,
    isRecruiting: true,
    rank: {
      tier: 'gold',
      division: 2,
      points: 2847
    },
    achievements: 8,
    tournamentsWon: 3,
    games: ['Counter-Strike 2', 'Valorant'],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Digital Dragons',
    description: 'Elite team specializing in MOBA games. Serious players only.',
    logo: '🐉',
    captainId: '2',
    captainName: 'DragonMaster',
    members: [
      { id: '4', username: 'DragonMaster', role: 'captain', joinedAt: new Date('2024-01-10'), isActive: true },
      { id: '5', username: 'FireBreath', role: 'player', joinedAt: new Date('2024-01-20'), isActive: true },
      { id: '6', username: 'ScaleClaw', role: 'player', joinedAt: new Date('2024-02-10'), isActive: true },
      { id: '7', username: 'WingStrike', role: 'player', joinedAt: new Date('2024-02-20'), isActive: true },
      { id: '8', username: 'TailWhip', role: 'substitute', joinedAt: new Date('2024-03-01'), isActive: true },
    ],
    maxMembers: 6,
    isPrivate: true,
    isRecruiting: false,
    rank: {
      tier: 'platinum',
      division: 4,
      points: 3456
    },
    achievements: 12,
    tournamentsWon: 7,
    games: ['League of Legends', 'Dota 2'],
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    name: 'Rocket Raiders',
    description: 'Fun-loving team focused on Rocket League. All skill levels welcome!',
    logo: '🚀',
    captainId: '3',
    captainName: 'RocketCaptain',
    members: [
      { id: '9', username: 'RocketCaptain', role: 'captain', joinedAt: new Date('2024-03-01'), isActive: true },
      { id: '10', username: 'BoostMaster', role: 'player', joinedAt: new Date('2024-03-05'), isActive: true },
    ],
    maxMembers: 4,
    isPrivate: false,
    isRecruiting: true,
    rank: {
      tier: 'silver',
      division: 3,
      points: 1832
    },
    achievements: 3,
    tournamentsWon: 1,
    games: ['Rocket League'],
    createdAt: new Date('2024-03-01')
  },
]

export default function TeamsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGame, setSelectedGame] = useState('all')
  const [showRecruitingOnly, setShowRecruitingOnly] = useState(false)
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false)

  const filteredTeams = mockTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGame = selectedGame === 'all' || team.games.includes(selectedGame)
    const matchesRecruiting = showRecruitingOnly ? team.isRecruiting : true
    
    return matchesSearch && matchesGame && matchesRecruiting
  })

  const getRankColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'text-amber-600'
      case 'silver': return 'text-slate-400'
      case 'gold': return 'text-yellow-500'
      case 'platinum': return 'text-cyan-400'
      case 'diamond': return 'text-blue-400'
      case 'master': return 'text-purple-400'
      case 'grandmaster': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white font-gaming mb-2">Teams</h1>
            <p className="text-slate-400">Find your perfect team or create your own</p>
          </div>
          <button
            onClick={() => setShowCreateTeamModal(true)}
            className="bg-gaming-600 hover:bg-gaming-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Create Team</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
              />
            </div>
            
            <select 
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
            >
              <option value="all">All Games</option>
              <option value="Counter-Strike 2">Counter-Strike 2</option>
              <option value="Valorant">Valorant</option>
              <option value="League of Legends">League of Legends</option>
              <option value="Rocket League">Rocket League</option>
              <option value="Dota 2">Dota 2</option>
            </select>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="recruiting-only"
                checked={showRecruitingOnly}
                onChange={(e) => setShowRecruitingOnly(e.target.checked)}
                className="w-4 h-4 text-gaming-600 bg-slate-700 border-slate-600 rounded focus:ring-gaming-500"
              />
              <label htmlFor="recruiting-only" className="text-slate-300">
                Recruiting only
              </label>
            </div>
          </div>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div key={team.id} className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors">
              {/* Team Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{team.logo}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium capitalize ${getRankColor(team.rank.tier)}`}>
                        {team.rank.tier} {team.rank.division}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-sm text-slate-400">{team.rank.points.toLocaleString()} pts</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {team.isRecruiting && (
                    <span className="text-xs bg-gaming-500/20 text-gaming-400 px-2 py-1 rounded">
                      Recruiting
                    </span>
                  )}
                  {team.isPrivate && (
                    <span className="text-xs bg-slate-600/20 text-slate-400 px-2 py-1 rounded">
                      Private
                    </span>
                  )}
                </div>
              </div>

              {/* Team Description */}
              <p className="text-slate-300 text-sm mb-4 line-clamp-2">{team.description}</p>

              {/* Team Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">{team.members.length}/{team.maxMembers}</div>
                  <div className="text-xs text-slate-400">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gaming-400">{team.tournamentsWon}</div>
                  <div className="text-xs text-slate-400">Tournaments Won</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-accent-400">{team.achievements}</div>
                  <div className="text-xs text-slate-400">Achievements</div>
                </div>
              </div>

              {/* Games */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {team.games.map((game) => (
                    <span key={game} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                      {game}
                    </span>
                  ))}
                </div>
              </div>

              {/* Captain */}
              <div className="flex items-center space-x-2 mb-4">
                <StarIcon className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-slate-300">Captain: {team.captainName}</span>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  team.isRecruiting
                    ? 'bg-gaming-600 hover:bg-gaming-700 text-white'
                    : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                }`}
                disabled={!team.isRecruiting}
              >
                {team.isRecruiting ? 'Request to Join' : 'Not Recruiting'}
              </button>
            </div>
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <div className="text-center py-16">
            <UsersIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No teams found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Create Team Modal */}
        {showCreateTeamModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">Create New Team</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Team Name</label>
                  <input
                    type="text"
                    placeholder="Enter team name"
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Description</label>
                  <textarea
                    placeholder="Describe your team..."
                    rows={3}
                    className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Games</label>
                  <select className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent">
                    <option value="counter-strike-2">Counter-Strike 2</option>
                    <option value="valorant">Valorant</option>
                    <option value="league-of-legends">League of Legends</option>
                    <option value="rocket-league">Rocket League</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="private-team"
                    className="w-4 h-4 text-gaming-600 bg-slate-700 border-slate-600 rounded focus:ring-gaming-500"
                  />
                  <label htmlFor="private-team" className="text-sm text-slate-300">
                    Private team (invite only)
                  </label>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowCreateTeamModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowCreateTeamModal(false)}
                  className="flex-1 bg-gaming-600 hover:bg-gaming-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Create Team
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
