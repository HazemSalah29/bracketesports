'use client'

import { useState, useEffect } from 'react'
import { 
  PlayIcon, 
  ClipboardDocumentIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface TournamentLobbyProps {
  tournamentId: string
  gameMode: 'VALORANT' | 'LEAGUE_OF_LEGENDS'
  onMatchStart?: (matchData: any) => void
}

interface LobbyData {
  id: string
  lobbyId: string
  password: string
  gameMode: string
  mapId: string
  teamSize: number
  maxPlayers: number
  status: string
  createdAt: string
  startedAt?: string
}

export default function TournamentLobby({ tournamentId, gameMode, onMatchStart }: TournamentLobbyProps) {
  const [lobby, setLobby] = useState<LobbyData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)

  useEffect(() => {
    fetchLobby()
  }, [tournamentId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchLobby = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/tournaments/lobbies?tournamentId=${tournamentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setLobby(data.data.lobby)
      } else {
        console.error('Failed to fetch lobby:', data.message)
      }
    } catch (error) {
      console.error('Error fetching lobby:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createLobby = async () => {
    setIsCreating(true)
    try {
      const response = await fetch('/api/tournaments/lobbies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          tournamentId,
          gameMode,
          teamSize: 5,
          mapId: gameMode === 'VALORANT' ? 'Haven' : 'SR'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setLobby(data.data.lobby)
        toast.success('Custom game lobby created!')
        toast.success(data.data.instructions, { duration: 10000 })
      } else {
        toast.error(data.message || 'Failed to create lobby')
      }
    } catch (error) {
      toast.error('Network error occurred')
    } finally {
      setIsCreating(false)
    }
  }

  const copyPassword = async () => {
    if (lobby?.password) {
      try {
        await navigator.clipboard.writeText(lobby.password)
        setPasswordCopied(true)
        toast.success('Password copied to clipboard!')
        setTimeout(() => setPasswordCopied(false), 3000)
      } catch (error) {
        toast.error('Failed to copy password')
      }
    }
  }

  const startMatchTracking = async () => {
    if (!lobby) return

    try {
      const response = await fetch('/api/tournaments/matches/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          tournamentId,
          lobbyId: lobby.id,
          participants: [] // This would be populated with actual tournament participants
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Match tracking started!')
        onMatchStart?.(data.data.match)
      } else {
        toast.error(data.message || 'Failed to start match tracking')
      }
    } catch (error) {
      toast.error('Network error occurred')
    }
  }

  if (isLoading) {
    return (
      <div className="gaming-card rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded mb-4"></div>
          <div className="h-3 bg-slate-700 rounded mb-2"></div>
          <div className="h-3 bg-slate-700 rounded mb-4"></div>
          <div className="h-8 bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!lobby) {
    return (
      <div className="gaming-card rounded-xl p-6">
        <div className="text-center">
          <UserGroupIcon className="mx-auto h-12 w-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Active Lobby</h3>
          <p className="text-slate-400 mb-6">
            Create a custom game lobby for this tournament to get started.
          </p>
          <button
            onClick={createLobby}
            disabled={isCreating}
            className="px-6 py-2 bg-gaming-600 hover:bg-gaming-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating...' : `Create ${gameMode} Lobby`}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="gaming-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {gameMode} Custom Lobby
          </h3>
          <p className="text-sm text-slate-400">
            Status: <span className={`font-medium ${
              lobby.status === 'CREATED' ? 'text-green-400' :
              lobby.status === 'IN_PROGRESS' ? 'text-yellow-400' :
              'text-slate-400'
            }`}>
              {lobby.status.replace('_', ' ')}
            </span>
          </p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          lobby.status === 'CREATED' ? 'bg-green-500/20 text-green-400' :
          lobby.status === 'IN_PROGRESS' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-slate-500/20 text-slate-400'
        }`}>
          {lobby.status.replace('_', ' ')}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Map
            </label>
            <div className="text-white font-medium">{lobby.mapId}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">
              Team Size
            </label>
            <div className="text-white font-medium">{lobby.teamSize}v{lobby.teamSize}</div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Lobby Password
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-slate-800 rounded-lg p-3 font-mono text-lg text-gaming-400 text-center tracking-widest">
              {lobby.password}
            </div>
            <button
              onClick={copyPassword}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              {passwordCopied ? (
                <CheckIcon className="h-5 w-5 text-green-400" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {gameMode === 'VALORANT' && (
          <div className="bg-accent-500/10 border border-accent-500/20 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-accent-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-accent-400 font-medium mb-1">Valorant Instructions:</p>
                <ol className="text-slate-300 space-y-1 list-decimal list-inside">
                  <li>Open Valorant and go to Play → Custom Game</li>
                  <li>Click &quot;Enter Code&quot; and paste: <code className="bg-slate-800 px-1 rounded">{lobby.password}</code></li>
                  <li>Wait for all players to join</li>
                  <li>Start the match when ready</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {gameMode === 'LEAGUE_OF_LEGENDS' && (
          <div className="bg-accent-500/10 border border-accent-500/20 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="h-5 w-5 text-accent-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-accent-400 font-medium mb-1">League of Legends Instructions:</p>
                <ol className="text-slate-300 space-y-1 list-decimal list-inside">
                  <li>Create a custom lobby in League</li>
                  <li>Set the lobby password to: <code className="bg-slate-800 px-1 rounded">{lobby.password}</code></li>
                  <li>Share the lobby with your team</li>
                  <li>Start the match when ready</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {lobby.status === 'CREATED' && (
          <div className="flex space-x-3 pt-4">
            <button
              onClick={startMatchTracking}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-gaming-600 hover:bg-gaming-700 text-white rounded-lg transition-colors"
            >
              <PlayIcon className="h-5 w-5 mr-2" />
              Start Match Tracking
            </button>
            <button
              onClick={fetchLobby}
              className="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}

        {lobby.status === 'IN_PROGRESS' && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
            <p className="text-yellow-400 font-medium">Match in progress...</p>
            <p className="text-sm text-slate-400 mt-1">
              Match data will be automatically tracked and updated
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
