'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FunnelIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  CogIcon,
  TrophyIcon,
  UserIcon,
  StarIcon,
  ClockIcon,
  LockClosedIcon,
  GlobeAltIcon,
  UsersIcon,
  ChartBarIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { GameIcon } from '@/components/ui/GameIcons';
import TournamentCard from '@/components/dashboard/TournamentCard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Tournament } from '@/types';
import { apiClient } from '@/lib/api-client';

// Simple account prompt component
const AccountPrompt = ({
  type,
  onClose,
  onContinue,
}: {
  type: string;
  onClose: () => void;
  onContinue: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full mx-4">
      <h3 className="text-lg font-semibold text-white mb-4">
        {type === 'account' ? 'Link Game Account' : 'Account Required'}
      </h3>
      <p className="text-slate-300 mb-6">
        {type === 'account'
          ? 'You need to link your game account to join tournaments.'
          : 'You need to complete your account setup to join tournaments.'}
      </p>
      <div className="flex space-x-4">
        <button
          onClick={onClose}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onContinue}
          className="flex-1 bg-gaming-600 hover:bg-gaming-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
);

// Link Account Modal component
const LinkAccountModal = ({
  onClose,
  onLink,
}: {
  onClose: () => void;
  onLink: (platform: string, username: string) => void;
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const platforms = [
    { id: 'steam', name: 'Steam', icon: '🎮' },
    { id: 'riot', name: 'Riot Games', icon: '⚡' },
    { id: 'epic', name: 'Epic Games', icon: '🏗️' },
    { id: 'psyonix', name: 'Psyonix (Rocket League)', icon: '🚗' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlatform || !username.trim()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onLink(selectedPlatform, username);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Link Game Account
        </h3>
        <p className="text-slate-300 mb-6">
          Link your gaming platform account to verify your identity and join
          tournaments.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Platform
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-gaming-500"
              required
            >
              <option value="">Select a platform</option>
              {platforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.icon} {platform.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-gaming-500"
              required
            />
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gaming-600 hover:bg-gaming-700 text-white py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              disabled={isLoading || !selectedPlatform || !username.trim()}
            >
              {isLoading ? 'Linking...' : 'Link Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const mockTournaments = [
  {
    id: '1',
    name: 'CS2 Winter Championship',
    description: 'Elite Counter-Strike 2 tournament',
    game: 'Counter-Strike 2',
    gameId: 'cs2',
    gameIcon: '🎯',
    pointsReward: 500,
    sponsoredBy: 'SteelSeries',
    maxParticipants: 128,
    currentParticipants: 64,
    startDate: new Date('2025-01-15T18:00:00Z'),
    endDate: new Date('2025-01-15T22:00:00Z'),
    registrationDeadline: new Date('2025-01-14T23:59:59Z'),
    status: 'registering' as const,
    rules: ['Standard CS2 rules'],
    skillRequirement: {
      minRank: {
        tier: 'bronze' as const,
        division: 1 as const,
        points: 0,
        pointsToNextRank: 1000,
        season: '2025-S1',
      },
      description: 'All Levels',
    },
    tournamentType: 'solo' as const,
    rewards: [
      {
        position: 1,
        points: 500,
        badges: [
          {
            id: 'cs2-champ',
            name: 'CS2 Champion',
            description: 'CS2 Winner',
            icon: '🏆',
            type: 'tournament' as const,
            rarity: 'legendary' as const,
            unlockedAt: new Date(),
          },
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Valorant Pro Series',
    description: 'Team-based Valorant tournament',
    game: 'Valorant',
    gameId: 'valorant',
    gameIcon: '⚡',
    pointsReward: 750,
    sponsoredBy: 'Riot Games',
    maxParticipants: 64,
    currentParticipants: 32,
    startDate: new Date('2025-01-12T20:00:00Z'),
    endDate: new Date('2025-01-13T02:00:00Z'),
    registrationDeadline: new Date('2025-01-11T23:59:59Z'),
    status: 'registering' as const,
    rules: ['Standard Valorant rules'],
    skillRequirement: {
      minRank: {
        tier: 'silver' as const,
        division: 1 as const,
        points: 1000,
        pointsToNextRank: 1000,
        season: '2025-S1',
      },
      description: 'Intermediate+',
    },
    tournamentType: 'team' as const,
    teamSize: 5,
    rewards: [
      {
        position: 1,
        points: 750,
        badges: [
          {
            id: 'val-champ',
            name: 'Valorant Champion',
            description: 'Valorant Winner',
            icon: '🏆',
            type: 'tournament' as const,
            rarity: 'legendary' as const,
            unlockedAt: new Date(),
          },
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Elite Rocket League Cup',
    description: 'Expert Rocket League tournament',
    game: 'Rocket League',
    gameId: 'rocket-league',
    gameIcon: '🚗',
    pointsReward: 1000,
    sponsoredBy: 'Psyonix',
    maxParticipants: 32,
    currentParticipants: 24,
    startDate: new Date('2025-01-10T19:00:00Z'),
    endDate: new Date('2025-01-11T01:00:00Z'),
    registrationDeadline: new Date('2025-01-09T23:59:59Z'),
    status: 'registering' as const,
    rules: ['Standard Rocket League rules'],
    skillRequirement: {
      minRank: {
        tier: 'gold' as const,
        division: 1 as const,
        points: 2000,
        pointsToNextRank: 1000,
        season: '2025-S1',
      },
      description: 'Expert',
    },
    tournamentType: 'team' as const,
    teamSize: 3,
    rewards: [
      {
        position: 1,
        points: 1000,
        badges: [
          {
            id: 'rl-champ',
            name: 'RL Champion',
            description: 'Rocket League Winner',
            icon: '🏆',
            type: 'tournament' as const,
            rarity: 'legendary' as const,
            unlockedAt: new Date(),
          },
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'League of Legends Clash',
    description: 'League of Legends team tournament',
    game: 'League of Legends',
    gameId: 'lol',
    gameIcon: '⚔️',
    pointsReward: 600,
    maxParticipants: 48,
    currentParticipants: 40,
    startDate: new Date('2025-01-08T17:00:00Z'),
    endDate: new Date('2025-01-08T22:00:00Z'),
    registrationDeadline: new Date('2025-01-07T23:59:59Z'),
    status: 'live' as const,
    rules: ['Standard LoL rules'],
    skillRequirement: {
      minRank: {
        tier: 'bronze' as const,
        division: 1 as const,
        points: 0,
        pointsToNextRank: 1000,
        season: '2025-S1',
      },
      description: 'All Levels',
    },
    tournamentType: 'team' as const,
    teamSize: 5,
    rewards: [
      {
        position: 1,
        points: 600,
        badges: [
          {
            id: 'lol-champ',
            name: 'LoL Champion',
            description: 'League Winner',
            icon: '🏆',
            type: 'tournament' as const,
            rarity: 'legendary' as const,
            unlockedAt: new Date(),
          },
        ],
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [showPrivateOnly, setShowPrivateOnly] = useState(false);
  const [showTeamOnly, setShowTeamOnly] = useState(false);
  const [showAccountPrompt, setShowAccountPrompt] = useState(false);
  const [showLinkAccountModal, setShowLinkAccountModal] = useState(false);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock user data with points-based system
  const user = {
    hasLinkedAccount: false,
    username: 'Player123',
    rank: {
      tier: 'silver',
      division: 3,
      points: 1247,
      pointsToNextRank: 353,
      season: 'Winter 2025',
    },
    totalPoints: 2847,
    tournamentsWon: 3,
    teamId: null,
    achievements: [
      { name: 'First Victory', icon: '🏆' },
      { name: 'Triple Kill', icon: '⚡' },
      { name: 'Team Player', icon: '👥' },
    ],
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getTournaments({ limit: 10 });
        if (
          response?.success &&
          response.data &&
          Array.isArray(response.data)
        ) {
          const transformedTournaments = response.data.map(
            (tournament: any) => ({
              ...tournament,
              startDate: new Date(tournament.startDate),
              endDate: new Date(tournament.endDate),
              registrationDeadline: new Date(tournament.registrationEnd),
              createdAt: new Date(tournament.createdAt),
              updatedAt: new Date(tournament.updatedAt),
            })
          );
          setTournaments(transformedTournaments);
        }
      } catch (err) {
        console.error('Failed to fetch tournaments:', err);
        // Use empty array as fallback
        setTournaments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch =
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGame =
      selectedGame === 'all' || tournament.game === selectedGame;
    const matchesSkill =
      selectedSkill === 'all' ||
      tournament.skillRequirement?.description === selectedSkill;
    const matchesPrivate = showPrivateOnly ? false : true; // No private tournaments in mock data
    const matchesTeam = showTeamOnly
      ? tournament.tournamentType === 'team'
      : true;

    return (
      matchesSearch &&
      matchesGame &&
      matchesSkill &&
      matchesPrivate &&
      matchesTeam
    );
  });

  const handleJoinTournament = async (tournamentId: string) => {
    if (!user.hasLinkedAccount) {
      setShowAccountPrompt(true);
      return;
    }

    const tournament = tournaments.find((t) => t.id === tournamentId);
    if (tournament?.tournamentType === 'team' && !user.teamId) {
      // Show team requirement prompt
      console.log('Team required for this tournament');
      return;
    }

    try {
      await apiClient.joinTournament(tournamentId);
      // Refresh tournaments
      const response = await apiClient.getTournaments({ limit: 10 });
      if (response?.success && response.data && Array.isArray(response.data)) {
        const transformedTournaments = response.data.map((tournament: any) => ({
          ...tournament,
          startDate: new Date(tournament.startDate),
          endDate: new Date(tournament.endDate),
          registrationDeadline: new Date(tournament.registrationEnd),
          createdAt: new Date(tournament.createdAt),
          updatedAt: new Date(tournament.updatedAt),
        }));
        setTournaments(transformedTournaments);
      }
    } catch (err) {
      console.error('Failed to join tournament:', err);
    }
  };

  const handleCreateTournament = () => {
    router.push('/tournaments/create');
  };

  const handleTeamAction = () => {
    if (user.teamId) {
      // Navigate to team management
      router.push(`/teams/${user.teamId}`);
    } else {
      // Navigate to teams page to create or join
      router.push('/teams');
    }
  };

  const handleLinkAccount = () => {
    setShowLinkAccountModal(true);
  };

  const handleViewAnalytics = () => {
    router.push('/analytics');
  };

  const handleAccountLink = (platform: string, username: string) => {
    // Mock API call to link account
    console.log('Linking account:', { platform, username });
    // Here you would call your API to link the account
    // For now, we'll just show a success message
    alert(`Successfully linked ${platform} account: ${username}`);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-900">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-80 bg-slate-900 border-r border-slate-800 min-h-screen">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gaming-600 rounded-lg flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">{user.username}</h2>
                  <p className="text-slate-400 text-sm capitalize">
                    {user.rank?.tier || 'Bronze'} {user.rank?.division || 1}
                  </p>
                </div>
              </div>

              {/* Player Stats */}
              <div className="bg-slate-800 rounded-lg p-4 mb-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Total Points</span>
                    <span className="text-gaming-400 font-semibold">
                      {user.totalPoints.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">
                      Tournaments Won
                    </span>
                    <span className="text-white font-semibold">
                      {user.tournamentsWon}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Current Rank</span>
                    <span className="text-white font-semibold capitalize">
                      {user.rank?.tier || 'Bronze'} {user.rank?.division || 1}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm text-slate-300 mb-1">
                      <span>Rank Progress</span>
                      <span>
                        {user.rank?.pointsToNextRank || 1000} to next rank
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gaming-500 h-2 rounded-full"
                        style={{
                          width: `${
                            user.rank
                              ? (user.rank.points /
                                  (user.rank.points +
                                    user.rank.pointsToNextRank)) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={handleCreateTournament}
                  className="w-full bg-gaming-600 hover:bg-gaming-700 text-white px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Create Tournament</span>
                </button>

                <button
                  onClick={handleTeamAction}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors"
                >
                  <UsersIcon className="w-5 h-5" />
                  <span>
                    {user.teamId ? 'Manage Team' : 'Create/Join Team'}
                  </span>
                </button>

                <button
                  onClick={handleLinkAccount}
                  className={`w-full px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${
                    user.hasLinkedAccount
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <LinkIcon className="w-5 h-5" />
                  <span>
                    {user.hasLinkedAccount
                      ? 'Account Linked ✓'
                      : 'Link Game Account'}
                  </span>
                </button>

                <button
                  onClick={handleViewAnalytics}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors"
                >
                  <ChartBarIcon className="w-5 h-5" />
                  <span>View Analytics</span>
                </button>
              </div>

              {/* Filters */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <FunnelIcon className="w-4 h-4 mr-2" />
                    Filters
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">
                        Game
                      </label>
                      <select
                        value={selectedGame}
                        onChange={(e) => setSelectedGame(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                      >
                        <option value="all">All Games</option>
                        <option value="Counter-Strike 2">
                          Counter-Strike 2
                        </option>
                        <option value="Valorant">Valorant</option>
                        <option value="Rocket League">Rocket League</option>
                        <option value="League of Legends">
                          League of Legends
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-slate-300 mb-2">
                        Skill Level
                      </label>
                      <select
                        value={selectedSkill}
                        onChange={(e) => setSelectedSkill(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                      >
                        <option value="all">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="private-only"
                          checked={showPrivateOnly}
                          onChange={(e) => setShowPrivateOnly(e.target.checked)}
                          className="w-4 h-4 text-gaming-600 bg-slate-800 border-slate-700 rounded focus:ring-gaming-500"
                        />
                        <label
                          htmlFor="private-only"
                          className="text-sm text-slate-300"
                        >
                          Private tournaments only
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="team-only"
                          checked={showTeamOnly}
                          onChange={(e) => setShowTeamOnly(e.target.checked)}
                          className="w-4 h-4 text-gaming-600 bg-slate-800 border-slate-700 rounded focus:ring-gaming-500"
                        />
                        <label
                          htmlFor="team-only"
                          className="text-sm text-slate-300"
                        >
                          Team tournaments only
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white font-gaming mb-2">
                  Active Tournaments
                </h1>
                <p className="text-slate-400">
                  Compete for points, ranks, and amazing rewards in your
                  favorite games
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-8">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tournaments or games..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  />
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
                  <TrophyIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
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
        </div>

        {/* Account Prompt Modal */}
        {showAccountPrompt && (
          <AccountPrompt
            type="account"
            onClose={() => setShowAccountPrompt(false)}
            onContinue={() => {
              setShowAccountPrompt(false);
              setShowLinkAccountModal(true);
            }}
          />
        )}

        {/* Link Account Modal */}
        {showLinkAccountModal && (
          <LinkAccountModal
            onClose={() => setShowLinkAccountModal(false)}
            onLink={handleAccountLink}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
