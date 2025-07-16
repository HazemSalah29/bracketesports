'use client';

import { useState, useEffect } from 'react';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import AuthPrompt from '@/components/auth/AuthPrompt';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  UsersIcon,
  StarIcon,
  ShieldCheckIcon,
  CalendarIcon,
  TrophyIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import CreateTeamModal from '@/components/teams/CreateTeamModal';
import { Team } from '@/types';
import { apiClient } from '@/lib/api-client';

export default function TeamsPage() {
  const { validateAndPrompt, showPrompt, promptData, closePrompt } =
    useAuthValidation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');
  const [showRecruitingOnly, setShowRecruitingOnly] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getTeams();
        if (
          response?.success &&
          response.data &&
          Array.isArray(response.data)
        ) {
          const transformedTeams = response.data.map((team: any) => ({
            ...team,
            createdAt: new Date(team.createdAt),
          }));
          setTeams(transformedTeams);
        }
      } catch (err) {
        console.error('Failed to fetch teams:', err);
        setError('Failed to load teams');
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((team: Team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.description.toLowerCase().includes(searchTerm.toLowerCase());
    // For now, skip game filtering since games property doesn't exist in Team interface
    const matchesGame = selectedGame === 'all'; // || team.games?.includes(selectedGame)
    const matchesRecruiting =
      !showRecruitingOnly || (team.members?.length || 0) < team.maxMembers;

    return matchesSearch && matchesGame && matchesRecruiting;
  });

  const getRankColor = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return 'text-amber-600';
      case 'silver':
        return 'text-slate-400';
      case 'gold':
        return 'text-yellow-500';
      case 'platinum':
        return 'text-cyan-400';
      case 'diamond':
        return 'text-blue-400';
      case 'master':
        return 'text-purple-400';
      case 'grandmaster':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const handleCreateTeam = () => {
    if (validateAndPrompt('create a team')) {
      setShowCreateTeamModal(true);
    }
  };

  const handleJoinTeam = (teamId: string) => {
    if (validateAndPrompt('join this team')) {
      console.log('Joining team:', teamId);
      // Add actual join logic here
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white font-gaming mb-2">
                Teams
              </h1>
              <p className="text-slate-400">
                Find your perfect team or create your own
              </p>
            </div>
            <button
              onClick={handleCreateTeam}
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
              <div
                key={team.id}
                className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition-colors"
              >
                {/* Team Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{team.logo}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {team.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium capitalize ${getRankColor(
                            team.teamRank?.tier || 'bronze'
                          )}`}
                        >
                          {team.teamRank?.tier || 'Bronze'}{' '}
                          {team.teamRank?.division || 1}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-sm text-slate-400">
                          {team.teamRank?.points?.toLocaleString() || 0} pts
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Remove recruiting badge for now since isRecruiting doesn't exist in Team interface */}
                    {false && (
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
                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                  {team.description}
                </p>

                {/* Team Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-white">
                      {team.members.length}/{team.maxMembers}
                    </div>
                    <div className="text-xs text-slate-400">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gaming-400">
                      {0}
                    </div>
                    <div className="text-xs text-slate-400">
                      Tournaments Won
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent-400">
                      {team.achievements.length}
                    </div>
                    <div className="text-xs text-slate-400">Achievements</div>
                  </div>
                </div>

                {/* Games - temporarily removed since games property doesn't exist in Team interface */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                      Various Games
                    </span>
                  </div>
                </div>

                {/* Captain */}
                <div className="flex items-center space-x-2 mb-4">
                  <StarIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-slate-300">
                    Captain:{' '}
                    {team.members?.find((member) => member.role === 'captain')
                      ?.user?.username || 'Unknown'}
                  </span>
                </div>

                {/* Action Button */}
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    (team.members?.length || 0) < team.maxMembers
                      ? 'bg-gaming-600 hover:bg-gaming-700 text-white'
                      : 'bg-slate-600 hover:bg-slate-500 text-slate-300'
                  }`}
                  disabled={(team.members?.length || 0) >= team.maxMembers}
                  onClick={() => handleJoinTeam(team.id)}
                >
                  {(team.members?.length || 0) < team.maxMembers
                    ? 'Request to Join'
                    : 'Team Full'}
                </button>
              </div>
            ))}
          </div>

          {filteredTeams.length === 0 && (
            <div className="text-center py-16">
              <UsersIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-400 mb-2">
                No teams found
              </h3>
              <p className="text-slate-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {/* Enhanced Create Team Modal */}
          {showCreateTeamModal && (
            <CreateTeamModal
              isOpen={showCreateTeamModal}
              onClose={() => setShowCreateTeamModal(false)}
              onTeamCreated={(newTeam) => {
                setTeams(prev => [newTeam, ...prev]);
                setShowCreateTeamModal(false);
              }}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
