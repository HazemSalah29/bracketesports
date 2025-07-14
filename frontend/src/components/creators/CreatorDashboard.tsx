'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  TrophyIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { CREATOR_TIERS } from '@/constants/creator-program'

interface User {
  id: string
  username: string
  email: string
  creator: {
    id: string
    tier: keyof typeof CREATOR_TIERS
    status: string
    totalEarnings: number
    revenueShare: number
  }
}

interface CreatorDashboardProps {
  user: User
}

interface Tournament {
  id: string
  name: string
  entryFeeCoin: number
  participants: number
  maxParticipants: number
  status: string
  startDate: string
  earnings: number
}

interface EarningsData {
  thisMonth: number
  lastMonth: number
  totalParticipants: number
  activeTournaments: number
}

export function CreatorDashboard({ user }: CreatorDashboardProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [earnings, setEarnings] = useState<EarningsData>({
    thisMonth: 0,
    lastMonth: 0,
    totalParticipants: 0,
    activeTournaments: 0
  })
  const [loading, setLoading] = useState(true)

  const tierInfo = CREATOR_TIERS[user.creator.tier]

  useEffect(() => {
    // Fetch creator data
    fetchCreatorData()
  }, [])

  const fetchCreatorData = async () => {
    try {
      // Mock data for now - replace with real API calls
      setEarnings({
        thisMonth: 1250.50,
        lastMonth: 980.25,
        totalParticipants: 124,
        activeTournaments: 3
      })

      setTournaments([
        {
          id: '1',
          name: 'Saturday Night Valorant',
          entryFeeCoin: 200,
          participants: 24,
          maxParticipants: 32,
          status: 'live',
          startDate: '2025-01-11T20:00:00Z',
          earnings: 336.00
        },
        {
          id: '2',
          name: 'League Coaching Session',
          entryFeeCoin: 500,
          participants: 8,
          maxParticipants: 16,
          status: 'registering',
          startDate: '2025-01-13T18:00:00Z',
          earnings: 280.00
        },
        {
          id: '3',
          name: 'Bronze to Gold Bootcamp',
          entryFeeCoin: 300,
          participants: 16,
          maxParticipants: 20,
          status: 'completed',
          startDate: '2025-01-08T19:00:00Z',
          earnings: 336.00
        }
      ])
    } catch (error) {
      console.error('Failed to fetch creator data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTournament = () => {
    // Navigate to tournament creation
    window.location.href = '/creator/tournaments/create'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Creator Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user.username}!</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-500">{tierInfo.name}</div>
              <div className="text-lg font-bold text-blue-600">{user.creator.revenueShare}% Revenue Share</div>
            </div>
            <button
              onClick={handleCreateTournament}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Create Tournament</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">${earnings.thisMonth.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Participants</p>
              <p className="text-2xl font-bold text-gray-900">{earnings.totalParticipants}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrophyIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Tournaments</p>
              <p className="text-2xl font-bold text-gray-900">{earnings.activeTournaments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">${user.creator.totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tournaments Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Your Tournaments</h2>
            <button
              onClick={handleCreateTournament}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All
            </button>
          </div>
        </div>

        <div className="p-6">
          {tournaments.length === 0 ? (
            <div className="text-center py-12">
              <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tournaments yet</h3>
              <p className="text-gray-500 mb-6">Create your first tournament to start engaging with your community!</p>
              <button
                onClick={handleCreateTournament}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Tournament
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tournaments.map((tournament) => (
                <div key={tournament.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900">{tournament.name}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          tournament.status === 'live' 
                            ? 'bg-green-100 text-green-800'
                            : tournament.status === 'registering'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {tournament.status === 'live' ? 'Live' : 
                           tournament.status === 'registering' ? 'Open' : 'Completed'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                        <span>Entry: {tournament.entryFeeCoin} coins</span>
                        <span>Players: {tournament.participants}/{tournament.maxParticipants}</span>
                        <span>Earnings: ${tournament.earnings.toFixed(2)}</span>
                        <span>
                          <CalendarIcon className="h-4 w-4 inline mr-1" />
                          {new Date(tournament.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
