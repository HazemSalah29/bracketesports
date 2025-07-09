'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline'

interface MatchStatsProps {
  tournamentId: string
  gameMode: 'VALORANT' | 'LEAGUE_OF_LEGENDS'
}

interface PlayerStats {
  id: string
  userId: string
  puuid: string
  teamSide: string
  characterId?: string
  kills: number
  deaths: number
  assists: number
  score: number
  damageDealt: number
  damageReceived: number
  headshotPct?: number
  user: {
    id: string
    username: string
    avatar?: string
  }
}

interface RoundStats {
  id: string
  roundNumber: number
  winningTeam: string
  roundResult: string
  bombPlanter?: string
  bombDefuser?: string
  plantSite?: string
}

interface MatchData {
  id: string
  riotMatchId?: string
  gameMode: string
  mapId?: string
  mapName?: string
  status: string
  teamAScore: number
  teamBScore: number
  gameStartTime?: string
  gameEndTime?: string
  gameLengthMs?: number
  playerStats: PlayerStats[]
  rounds: RoundStats[]
}

export default function MatchStats({ tournamentId, gameMode }: MatchStatsProps) {
  const [matches, setMatches] = useState<MatchData[]>([])
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchMatchData()
  }, [tournamentId]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMatchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/tournaments/matches/track?tournamentId=${tournamentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        setMatches(data.data.matches)
        if (data.data.matches.length > 0 && !selectedMatch) {
          setSelectedMatch(data.data.matches[0])
        }
      } else {
        console.error('Failed to fetch match data:', data.message)
      }
    } catch (error) {
      console.error('Error fetching match data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDuration = (ms?: number) => {
    if (!ms) return 'N/A'
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getKDA = (player: PlayerStats) => {
    const kda = player.deaths > 0 ? (player.kills + player.assists) / player.deaths : player.kills + player.assists
    return kda.toFixed(2)
  }

  if (isLoading) {
    return (
      <div className="gaming-card rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-700 rounded w-1/3"></div>
          <div className="h-4 bg-slate-700 rounded"></div>
          <div className="h-4 bg-slate-700 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="gaming-card rounded-xl p-6 text-center">
        <ChartBarIcon className="mx-auto h-12 w-12 text-slate-500 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No Match Data</h3>
        <p className="text-slate-400">
          Match statistics will appear here once games are played and tracked.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Match Selection */}
      <div className="gaming-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Match History</h3>
        <div className="space-y-2">
          {matches.map((match) => (
            <button
              key={match.id}
              onClick={() => setSelectedMatch(match)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedMatch?.id === match.id
                  ? 'border-gaming-500 bg-gaming-500/10'
                  : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">
                    {match.mapName || match.mapId || 'Unknown Map'}
                  </div>
                  <div className="text-sm text-slate-400">
                    {match.gameStartTime ? new Date(match.gameStartTime).toLocaleString() : 'Not started'}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-medium ${
                    match.status === 'COMPLETED' ? 'text-green-400' :
                    match.status === 'IN_PROGRESS' ? 'text-yellow-400' :
                    'text-slate-400'
                  }`}>
                    {match.status.replace('_', ' ')}
                  </div>
                  {match.status === 'COMPLETED' && (
                    <div className="text-sm text-slate-400">
                      {match.teamAScore} - {match.teamBScore}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Match Details */}
      {selectedMatch && (
        <div className="gaming-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">
                {selectedMatch.mapName || selectedMatch.mapId || 'Match Details'}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {formatDuration(selectedMatch.gameLengthMs)}
                </span>
                <span>{selectedMatch.gameMode}</span>
                {selectedMatch.status === 'COMPLETED' && (
                  <span className="text-green-400 font-medium">Completed</span>
                )}
              </div>
            </div>
            {selectedMatch.status === 'COMPLETED' && (
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {selectedMatch.teamAScore} - {selectedMatch.teamBScore}
                </div>
                <div className="text-sm text-slate-400">Final Score</div>
              </div>
            )}
          </div>

          {/* Player Statistics */}
          {selectedMatch.playerStats.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Player Statistics</h4>
              
              {/* Team A */}
              <div className="mb-6">
                <h5 className="text-md font-medium text-gaming-400 mb-3">Team A</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-2 text-slate-400">Player</th>
                        <th className="text-center py-2 text-slate-400">K/D/A</th>
                        <th className="text-center py-2 text-slate-400">Score</th>
                        <th className="text-center py-2 text-slate-400">KDA</th>
                        {gameMode === 'VALORANT' && (
                          <>
                            <th className="text-center py-2 text-slate-400">HS%</th>
                            <th className="text-center py-2 text-slate-400">Damage</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMatch.playerStats
                        .filter(player => player.teamSide === 'TeamA')
                        .map((player) => (
                          <tr key={player.id} className="border-b border-slate-700/50">
                            <td className="py-2">
                              <div className="flex items-center">
                                <UserIcon className="h-4 w-4 mr-2 text-slate-500" />
                                <span className="text-white">{player.user.username}</span>
                              </div>
                            </td>
                            <td className="text-center py-2 text-white">
                              {player.kills}/{player.deaths}/{player.assists}
                            </td>
                            <td className="text-center py-2 text-white">{player.score}</td>
                            <td className="text-center py-2 text-gaming-400 font-medium">
                              {getKDA(player)}
                            </td>
                            {gameMode === 'VALORANT' && (
                              <>
                                <td className="text-center py-2 text-white">
                                  {player.headshotPct?.toFixed(1) || 'N/A'}%
                                </td>
                                <td className="text-center py-2 text-white">{player.damageDealt}</td>
                              </>
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Team B */}
              <div>
                <h5 className="text-md font-medium text-accent-400 mb-3">Team B</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left py-2 text-slate-400">Player</th>
                        <th className="text-center py-2 text-slate-400">K/D/A</th>
                        <th className="text-center py-2 text-slate-400">Score</th>
                        <th className="text-center py-2 text-slate-400">KDA</th>
                        {gameMode === 'VALORANT' && (
                          <>
                            <th className="text-center py-2 text-slate-400">HS%</th>
                            <th className="text-center py-2 text-slate-400">Damage</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedMatch.playerStats
                        .filter(player => player.teamSide === 'TeamB')
                        .map((player) => (
                          <tr key={player.id} className="border-b border-slate-700/50">
                            <td className="py-2">
                              <div className="flex items-center">
                                <UserIcon className="h-4 w-4 mr-2 text-slate-500" />
                                <span className="text-white">{player.user.username}</span>
                              </div>
                            </td>
                            <td className="text-center py-2 text-white">
                              {player.kills}/{player.deaths}/{player.assists}
                            </td>
                            <td className="text-center py-2 text-white">{player.score}</td>
                            <td className="text-center py-2 text-accent-400 font-medium">
                              {getKDA(player)}
                            </td>
                            {gameMode === 'VALORANT' && (
                              <>
                                <td className="text-center py-2 text-white">
                                  {player.headshotPct?.toFixed(1) || 'N/A'}%
                                </td>
                                <td className="text-center py-2 text-white">{player.damageDealt}</td>
                              </>
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Round by Round (Valorant) */}
          {gameMode === 'VALORANT' && selectedMatch.rounds.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">Round by Round</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {selectedMatch.rounds.map((round) => (
                  <div
                    key={round.id}
                    className={`p-3 rounded border text-center ${
                      round.winningTeam === 'TeamA'
                        ? 'border-gaming-500 bg-gaming-500/10'
                        : 'border-accent-500 bg-accent-500/10'
                    }`}
                  >
                    <div className="font-medium text-white">Round {round.roundNumber}</div>
                    <div className={`text-sm ${
                      round.winningTeam === 'TeamA' ? 'text-gaming-400' : 'text-accent-400'
                    }`}>
                      {round.winningTeam === 'TeamA' ? 'Team A' : 'Team B'}
                    </div>
                    <div className="text-xs text-slate-400">{round.roundResult}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
