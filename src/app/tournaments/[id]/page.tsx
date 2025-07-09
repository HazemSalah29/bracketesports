'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  TrophyIcon, 
  UserIcon, 
  ClockIcon, 
  CheckCircleIcon,
  PlayIcon,
  UsersIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import TournamentLobby from '@/components/tournaments/TournamentLobby';
import MatchStats from '@/components/tournaments/MatchStats';
import TournamentAdminControls from '@/components/tournaments/TournamentAdminControls';

// Mock tournament data
const mockTournament = {
  id: '1',
  name: 'CS2 Winter Championship',
  game: 'Counter-Strike 2',
  status: 'live',
  pointsReward: 2500,
  maxParticipants: 64,
  currentParticipants: 64,
  startDate: new Date('2024-12-15T18:00:00Z'),
  endDate: new Date('2024-12-15T22:00:00Z'),
  currentRound: 4,
  totalRounds: 6,
  sponsoredBy: 'SteelSeries',
  tournamentType: 'solo',
  skillRequirement: 'All Levels'
};

// Mock bracket data
const mockBracket = {
  rounds: [
    {
      roundNumber: 1,
      name: 'Round of 64',
      matches: [
        {
          id: '1',
          player1: { id: '1', username: 'ProGamer2024', avatar: null },
          player2: { id: '2', username: 'SniperKing', avatar: null },
          winner: { id: '1', username: 'ProGamer2024', avatar: null },
          player1Score: 16,
          player2Score: 14,
          status: 'completed',
          completedTime: new Date('2024-12-15T19:30:00Z')
        },
        {
          id: '2',
          player1: { id: '3', username: 'HeadshotMaster', avatar: null },
          player2: { id: '4', username: 'RifleGod', avatar: null },
          winner: { id: '4', username: 'RifleGod', avatar: null },
          player1Score: 12,
          player2Score: 16,
          status: 'completed',
          completedTime: new Date('2024-12-15T19:45:00Z')
        }
      ]
    },
    {
      roundNumber: 2,
      name: 'Round of 32',
      matches: [
        {
          id: '3',
          player1: { id: '1', username: 'ProGamer2024', avatar: null },
          player2: { id: '4', username: 'RifleGod', avatar: null },
          winner: { id: '1', username: 'ProGamer2024', avatar: null },
          player1Score: 16,
          player2Score: 8,
          status: 'completed',
          completedTime: new Date('2024-12-15T20:15:00Z')
        }
      ]
    },
    {
      roundNumber: 3,
      name: 'Round of 16',
      matches: [
        {
          id: '4',
          player1: { id: '1', username: 'ProGamer2024', avatar: null },
          player2: { id: '5', username: 'ClutchKing', avatar: null },
          winner: null,
          player1Score: 12,
          player2Score: 10,
          status: 'live',
          scheduledTime: new Date('2024-12-15T20:45:00Z')
        }
      ]
    },
    {
      roundNumber: 4,
      name: 'Quarter Finals',
      matches: [
        {
          id: '5',
          player1: null,
          player2: null,
          winner: null,
          player1Score: 0,
          player2Score: 0,
          status: 'pending',
          scheduledTime: new Date('2024-12-15T21:30:00Z')
        }
      ]
    },
    {
      roundNumber: 5,
      name: 'Semi Finals',
      matches: [
        {
          id: '6',
          player1: null,
          player2: null,
          winner: null,
          player1Score: 0,
          player2Score: 0,
          status: 'pending',
          scheduledTime: new Date('2024-12-15T22:00:00Z')
        }
      ]
    },
    {
      roundNumber: 6,
      name: 'Finals',
      matches: [
        {
          id: '7',
          player1: null,
          player2: null,
          winner: null,
          player1Score: 0,
          player2Score: 0,
          status: 'pending',
          scheduledTime: new Date('2024-12-15T22:30:00Z')
        }
      ]
    }
  ]
};

const mockLiveMatches = [
  {
    id: '4',
    player1: { id: '1', username: 'ProGamer2024', avatar: null },
    player2: { id: '5', username: 'ClutchKing', avatar: null },
    player1Score: 12,
    player2Score: 10,
    round: 'Round of 16',
    viewers: 1247,
    streamUrl: 'https://twitch.tv/bracket-esports'
  }
];

export default function TournamentBracketPage() {
  const params = useParams();
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [viewMode, setViewMode] = useState('bracket'); // 'bracket' or 'list'

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'live':
        return 'bg-red-600 animate-pulse';
      case 'pending':
        return 'bg-slate-600';
      default:
        return 'bg-slate-600';
    }
  };

  const getMatchStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'live':
        return <PlayIcon className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-slate-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-slate-500" />;
    }
  };

  const renderMatch = (match: any, roundIndex: number) => {
    const isWinner1 = match.winner?.id === match.player1?.id;
    const isWinner2 = match.winner?.id === match.player2?.id;

    return (
      <motion.div
        key={match.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: roundIndex * 0.1 }}
        className={`bg-slate-800 rounded-lg p-4 border-2 ${
          match.status === 'live' ? 'border-red-500' : 'border-slate-700'
        } hover:border-gaming-500 transition-colors cursor-pointer`}
        onClick={() => setSelectedMatch(match)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {getMatchStatusIcon(match.status)}
            <span className="text-xs text-slate-400 capitalize">{match.status}</span>
          </div>
          {match.status === 'live' && (
            <div className="flex items-center gap-1 text-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs">LIVE</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className={`flex items-center justify-between p-2 rounded ${
            isWinner1 ? 'bg-gaming-600/20 border border-gaming-600' : 'bg-slate-700/50'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-sm text-white">
                {match.player1?.username || 'TBD'}
              </span>
            </div>
            <span className="text-sm font-bold text-white">
              {match.player1Score || 0}
            </span>
          </div>
          
          <div className={`flex items-center justify-between p-2 rounded ${
            isWinner2 ? 'bg-gaming-600/20 border border-gaming-600' : 'bg-slate-700/50'
          }`}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-3 h-3 text-slate-400" />
              </div>
              <span className="text-sm text-white">
                {match.player2?.username || 'TBD'}
              </span>
            </div>
            <span className="text-sm font-bold text-white">
              {match.player2Score || 0}
            </span>
          </div>
        </div>
        
        {match.scheduledTime && (
          <div className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <CalendarIcon className="w-3 h-3" />
            {match.scheduledTime.toLocaleTimeString()}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Tournament Header */}
        <div className="gaming-card rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white font-gaming">
                {mockTournament.name}
              </h1>
              <p className="text-slate-300 mt-1">{mockTournament.game}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-sm text-slate-400">
                  <TrophyIcon className="w-4 h-4" />
                  Points Reward: {mockTournament.pointsReward.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-400">
                  <UsersIcon className="w-4 h-4" />
                  {mockTournament.currentParticipants} Players
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  mockTournament.status === 'live' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-green-600 text-white'
                }`}>
                  {mockTournament.status === 'live' ? 'LIVE' : 'COMPLETED'}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('bracket')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  viewMode === 'bracket' 
                    ? 'bg-gaming-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Bracket View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-gaming-600 text-white' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                List View
              </button>
            </div>
          </div>
        </div>

        {/* Live Matches */}
        {mockLiveMatches.length > 0 && (
          <div className="gaming-card rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              Live Matches
            </h2>
            <div className="space-y-4">
              {mockLiveMatches.map((match) => (
                <div key={match.id} className="bg-slate-800/50 rounded-lg p-4 border-2 border-red-500">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-red-500">{match.round}</span>
                      <div className="flex items-center gap-1 text-sm text-slate-400">
                        <EyeIcon className="w-4 h-4" />
                        {match.viewers.toLocaleString()} viewers
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors">
                      <PlayIcon className="w-4 h-4" />
                      Watch Live
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="font-medium text-white">{match.player1.username}</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{match.player1Score}</div>
                    </div>
                    
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="font-medium text-white">{match.player2.username}</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{match.player2Score}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tournament Bracket */}
        <div className="gaming-card rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Tournament Bracket</h2>
          
          {viewMode === 'bracket' ? (
            <div className="overflow-x-auto">
              <div className="min-w-max">
                <div className="grid grid-cols-6 gap-8">
                  {mockBracket.rounds.map((round, roundIndex) => (
                    <div key={round.roundNumber} className="space-y-4">
                      <h3 className="text-center font-semibold text-gaming-500 text-sm">
                        {round.name}
                      </h3>
                      <div className="space-y-4">
                        {round.matches.map((match) => renderMatch(match, roundIndex))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {mockBracket.rounds.map((round) => (
                <div key={round.roundNumber} className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {round.name}
                    <span className="text-sm text-slate-400">({round.matches.length} matches)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {round.matches.map((match) => renderMatch(match, 0))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tournament Progress */}
        <div className="gaming-card rounded-xl p-6 mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Tournament Progress</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gaming-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(mockTournament.currentRound / mockTournament.totalRounds) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm text-slate-400">
              Round {mockTournament.currentRound} of {mockTournament.totalRounds}
            </span>
          </div>
        </div>

        {/* Tournament Lobby (for organizers and participants) */}
        {(mockTournament.status === 'registration' || mockTournament.status === 'live') && (
          <div className="gaming-card rounded-xl p-6 mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Tournament Lobby</h2>
            <TournamentLobby tournamentId={mockTournament.id} gameMode="VALORANT" />
          </div>
        )}

        {/* Match Statistics */}
        {mockTournament.status === 'live' && (
          <div className="gaming-card rounded-xl p-6 mt-8">
            <h2 className="text-xl font-bold text-white mb-4">Live Match Statistics</h2>
            <MatchStats tournamentId={mockTournament.id} gameMode="VALORANT" />
          </div>
        )}

        {/* Tournament Admin Controls (for organizers) */}
        <div className="gaming-card rounded-xl p-6 mt-8">
          <TournamentAdminControls 
            tournamentId={mockTournament.id} 
            gameMode="VALORANT"
            isOrganizer={true} // In real implementation, check if current user is organizer
          />
        </div>
      </div>

      {/* Match Details Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-xl p-6 w-full max-w-md mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Match Details</h3>
              <button
                onClick={() => setSelectedMatch(null)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={`capitalize ${
                  selectedMatch.status === 'live' ? 'text-red-500' : 
                  selectedMatch.status === 'completed' ? 'text-green-500' : 'text-slate-400'
                }`}>
                  {selectedMatch.status}
                </span>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white">{selectedMatch.player1?.username || 'TBD'}</span>
                  <span className="text-xl font-bold text-white">{selectedMatch.player1Score || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white">{selectedMatch.player2?.username || 'TBD'}</span>
                  <span className="text-xl font-bold text-white">{selectedMatch.player2Score || 0}</span>
                </div>
              </div>
              
              {selectedMatch.scheduledTime && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Scheduled:</span>
                  <span className="text-white">
                    {selectedMatch.scheduledTime.toLocaleString()}
                  </span>
                </div>
              )}
              
              {selectedMatch.completedTime && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Completed:</span>
                  <span className="text-white">
                    {selectedMatch.completedTime.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
