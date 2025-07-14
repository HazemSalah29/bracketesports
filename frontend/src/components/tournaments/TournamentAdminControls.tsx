'use client';

import { useState, useEffect } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  StopIcon,
  UsersIcon,
  ClockIcon,
  EyeIcon,
  KeyIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface TournamentAdminControlsProps {
  tournamentId: string;
  gameMode: 'VALORANT' | 'LEAGUE_OF_LEGENDS';
  isOrganizer?: boolean;
}

interface TournamentMatch {
  id: string;
  player1Id: string;
  player2Id: string;
  player1Name: string;
  player2Name: string;
  status: 'pending' | 'lobby_created' | 'in_progress' | 'completed';
  lobbyCode?: string;
  lobbyPassword?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export default function TournamentAdminControls({ 
  tournamentId, 
  gameMode, 
  isOrganizer = false 
}: TournamentAdminControlsProps) {
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  useEffect(() => {
    // Mock data for demonstration - in real implementation, fetch from API
    const mockMatches: TournamentMatch[] = [
      {
        id: '1',
        player1Id: 'user1',
        player2Id: 'user2',
        player1Name: 'ProGamer2024',
        player2Name: 'SniperKing',
        status: 'pending'
      },
      {
        id: '2',
        player1Id: 'user3',
        player2Id: 'user4',
        player1Name: 'ClutchMaster',
        player2Name: 'RifleGod',
        status: 'lobby_created',
        lobbyCode: 'BRACE123',
        lobbyPassword: 'tourney456'
      },
      {
        id: '3',
        player1Id: 'user5',
        player2Id: 'user6',
        player1Name: 'AimBot',
        player2Name: 'FlashBang',
        status: 'in_progress',
        lobbyCode: 'GAME789',
        startedAt: new Date()
      }
    ];
    
    setMatches(mockMatches);
  }, [tournamentId]);

  const createLobby = async (matchId: string) => {
    setIsLoading(true);
    try {
      // Call API to create lobby
      const response = await fetch('/api/tournaments/lobbies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId,
          matchId,
          gameMode
        })
      });

      if (response.ok) {
        const lobby = await response.json();
        // Update match with lobby info
        setMatches(prev => prev.map(match => 
          match.id === matchId 
            ? { 
                ...match, 
                status: 'lobby_created',
                lobbyCode: lobby.data.lobbyCode,
                lobbyPassword: lobby.data.password
              }
            : match
        ));
      }
    } catch (error) {
      console.error('Failed to create lobby:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startMatch = async (matchId: string) => {
    setIsLoading(true);
    try {
      // Call API to start match tracking
      const response = await fetch('/api/tournaments/matches/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournamentId,
          matchId,
          gameMode
        })
      });

      if (response.ok) {
        setMatches(prev => prev.map(match => 
          match.id === matchId 
            ? { ...match, status: 'in_progress', startedAt: new Date() }
            : match
        ));
      }
    } catch (error) {
      console.error('Failed to start match:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'lobby_created': return 'text-blue-500';
      case 'in_progress': return 'text-green-500';
      case 'completed': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon className="w-4 h-4" />;
      case 'lobby_created': return <KeyIcon className="w-4 h-4" />;
      case 'in_progress': return <PlayIcon className="w-4 h-4" />;
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  if (!isOrganizer) {
    return (
      <div className="bg-slate-700 rounded-lg p-4 text-center">
        <p className="text-slate-400">Only tournament organizers can access admin controls.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Tournament Admin Controls</h3>
        <div className="text-sm text-slate-400">
          {matches.length} matches • {matches.filter(m => m.status === 'in_progress').length} active
        </div>
      </div>

      <div className="space-y-4">
        {matches.map((match) => (
          <div 
            key={match.id} 
            className="bg-slate-700 rounded-lg p-4 border border-slate-600"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 ${getStatusColor(match.status)}`}>
                  {getStatusIcon(match.status)}
                  <span className="text-sm font-medium capitalize">
                    {match.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-white">
                  <span className="font-semibold">{match.player1Name}</span>
                  <span className="text-slate-400 mx-2">vs</span>
                  <span className="font-semibold">{match.player2Name}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {match.status === 'pending' && (
                  <button
                    onClick={() => createLobby(match.id)}
                    disabled={isLoading}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                  >
                    Create Lobby
                  </button>
                )}
                
                {match.status === 'lobby_created' && (
                  <button
                    onClick={() => startMatch(match.id)}
                    disabled={isLoading}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                  >
                    Start Match
                  </button>
                )}
                
                {match.status === 'in_progress' && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-green-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                      <span className="text-xs">LIVE</span>
                    </div>
                    <button className="px-3 py-1 bg-gaming-600 hover:bg-gaming-700 text-white text-sm rounded-lg transition-colors">
                      <EyeIcon className="w-4 h-4 inline mr-1" />
                      Monitor
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Lobby Information */}
            {match.lobbyCode && (
              <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Lobby Code:</span>
                    <div className="font-mono text-white bg-slate-700 px-2 py-1 rounded mt-1">
                      {match.lobbyCode}
                    </div>
                  </div>
                  {match.lobbyPassword && (
                    <div>
                      <span className="text-slate-400">Password:</span>
                      <div className="font-mono text-white bg-slate-700 px-2 py-1 rounded mt-1">
                        {match.lobbyPassword}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {gameMode === 'VALORANT' ? 'Custom Game' : 'Tournament Draft'} • {match.lobbyCode}
                  </span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(`Code: ${match.lobbyCode}${match.lobbyPassword ? ` | Password: ${match.lobbyPassword}` : ''}`)}
                    className="text-xs text-gaming-400 hover:text-gaming-300 transition-colors"
                  >
                    Copy Details
                  </button>
                </div>
              </div>
            )}

            {/* Match Timeline */}
            {match.startedAt && (
              <div className="mt-3 text-xs text-slate-400">
                Started {new Date(match.startedAt).toLocaleTimeString()}
                {match.completedAt && (
                  <span> • Completed {new Date(match.completedAt).toLocaleTimeString()}</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-8">
          <UsersIcon className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400">No matches found for this tournament.</p>
        </div>
      )}
    </div>
  );
}
