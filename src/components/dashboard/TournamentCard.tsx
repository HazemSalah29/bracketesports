'use client'

import { 
  ClockIcon, 
  UserGroupIcon, 
  StarIcon,
  LockClosedIcon,
  GlobeAltIcon,
  CalendarIcon,
  UsersIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { Tournament } from '@/types'

interface TournamentCardProps {
  tournament: Tournament
  onJoin: () => void
}

export default function TournamentCard({ tournament, onJoin }: TournamentCardProps) {
  const spotsLeft = tournament.maxParticipants - tournament.currentParticipants
  const isTeamBased = tournament.tournamentType === 'team' || tournament.tournamentType === 'mixed'
  const skillLevel = tournament.skillRequirement.description
  const isAlmostFull = spotsLeft <= 5
  const isFull = spotsLeft === 0

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registering':
        return 'bg-gaming-500/20 text-gaming-400'
      case 'live':
        return 'bg-red-500/20 text-red-400'
      case 'completed':
        return 'bg-slate-500/20 text-slate-400'
      default:
        return 'bg-slate-500/20 text-slate-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'registering':
        return 'Open'
      case 'live':
        return 'Live'
      case 'completed':
        return 'Completed'
      default:
        return 'Unknown'
    }
  }

  const calculateDuration = () => {
    const hours = Math.floor((tournament.endDate.getTime() - tournament.startDate.getTime()) / (1000 * 60 * 60))
    return `${hours}h`
  }

  return (
    <div className="gaming-card rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{tournament.gameIcon}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{tournament.name}</h3>
            <p className="text-sm text-slate-400">{tournament.game}</p>
            {tournament.sponsoredBy && (
              <div className="flex items-center space-x-1 mt-1">
                <ShieldCheckIcon className="w-3 h-3 text-accent-400" />
                <span className="text-xs text-accent-400">Sponsored by {tournament.sponsoredBy}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isTeamBased && (
            <UsersIcon className="w-4 h-4 text-gaming-400" />
          )}
          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(tournament.status)}`}>
            {getStatusText(tournament.status)}
          </span>
        </div>
      </div>

      {/* Points Reward */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Points Reward</span>
          {isTeamBased && (
            <span className="text-sm text-slate-400">Team Size</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StarIcon className="w-5 h-5 text-gaming-400" />
            <span className="text-xl font-bold text-gaming-400 prize-glow">
              {tournament.pointsReward.toLocaleString()}
            </span>
          </div>
          {isTeamBased && tournament.teamSize && (
            <span className="text-lg font-semibold text-white">
              {tournament.teamSize}
            </span>
          )}
        </div>
      </div>

      {/* Tournament Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-slate-300">
            <UserGroupIcon className="w-4 h-4" />
            <span>{isTeamBased ? 'Teams' : 'Players'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`${isAlmostFull ? 'text-accent-400' : 'text-white'}`}>
              {tournament.currentParticipants}/{tournament.maxParticipants}
            </span>
            {isAlmostFull && !isFull && (
              <span className="text-xs bg-accent-500/20 text-accent-400 px-2 py-1 rounded">
                {spotsLeft} left
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-slate-300">
            <CalendarIcon className="w-4 h-4" />
            <span>Starts</span>
          </div>
          <span className="text-white">{formatDate(tournament.startDate)}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-slate-300">
            <ClockIcon className="w-4 h-4" />
            <span>Duration</span>
          </div>
          <span className="text-white">{calculateDuration()}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-300">Skill Level</span>
          <span className={`text-xs px-2 py-1 rounded ${
            skillLevel.includes('Expert') 
              ? 'bg-red-500/20 text-red-400'
              : skillLevel.includes('Intermediate') || skillLevel.includes('Advanced')
              ? 'bg-accent-500/20 text-accent-400'
              : 'bg-gaming-500/20 text-gaming-400'
          }`}>
            {skillLevel}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <div className="space-y-2">
        {isTeamBased && (
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <UsersIcon className="w-4 h-4" />
            <span>Team tournament - {tournament.teamSize} players per team</span>
          </div>
        )}
        
        <button
          onClick={onJoin}
          disabled={isFull || tournament.status !== 'registering'}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
            isFull || tournament.status !== 'registering'
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-gaming-600 hover:bg-gaming-700 text-white neon-glow'
          }`}
        >
          {isFull 
            ? 'Tournament Full' 
            : tournament.status === 'live'
            ? 'In Progress'
            : tournament.status === 'completed'
            ? 'Completed'
            : isTeamBased
            ? 'Join with Team'
            : 'Join Tournament'
          }
        </button>
      </div>
    </div>
  )
}
