'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useCallback } from 'react';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import ActiveTournaments from '@/components/sections/ActiveTournaments';
import Stats from '@/components/sections/Stats';
import { apiClient } from '@/lib/api-client';
import { Tournament } from '@/types';
import { TournamentResponse } from '@/types/api';
import TournamentCard from '@/components/dashboard/TournamentCard';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export default function Home() {
  const { isAuthenticated, loading, user } = useAuth();
  const [tournaments, setTournaments] = useState<TournamentResponse[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<
    TournamentResponse[]
  >([]);
  const [loadingTournaments, setLoadingTournaments] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [coinBalance, setCoinBalance] = useState(0);

  const filterTournaments = useCallback(() => {
    // Ensure tournaments is an array before filtering
    if (!Array.isArray(tournaments)) {
      setFilteredTournaments([]);
      return;
    }
    
    let filtered = tournaments;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (tournament) =>
          tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tournament.game.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(
        (tournament) => tournament.status === selectedStatus
      );
    }

    // Filter by game
    if (selectedGame !== 'all') {
      filtered = filtered.filter(
        (tournament) => tournament.game === selectedGame
      );
    }

    setFilteredTournaments(filtered);
  }, [tournaments, searchTerm, selectedStatus, selectedGame]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTournaments();
      fetchCoinBalance();
    }
  }, [isAuthenticated]);

  const fetchCoinBalance = async () => {
    try {
      const response = await apiClient.getCoinBalance();
      if (response.success && response.data) {
        setCoinBalance((response.data as any).balance || 0);
      } else {
        setCoinBalance(0);
      }
    } catch (error) {
      console.error('Failed to fetch coin balance:', error);
      setCoinBalance(0);
    }
  };

  useEffect(() => {
    filterTournaments();
  }, [filterTournaments]);

  const fetchTournaments = async () => {
    setLoadingTournaments(true);
    try {
      const response = await apiClient.getTournaments();
      if (response.success && response.data) {
        // Ensure we always set an array
        const tournamentsData = Array.isArray(response.data) ? response.data : [];
        setTournaments(tournamentsData);
      } else {
        // Set empty array if response fails
        setTournaments([]);
      }
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
      // Set empty array on error
      setTournaments([]);
    } finally {
      setLoadingTournaments(false);
    }
  };

  const getUniqueGames = () => {
    // Ensure tournaments is an array before mapping
    if (!Array.isArray(tournaments)) {
      return [];
    }
    const games = tournaments.map((t) => t.game);
    return Array.from(new Set(games));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gaming-500"></div>
      </div>
    );
  }

  // Show tournaments page for authenticated users
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white font-gaming mb-4">
                Welcome back, {user?.username}! 🎮
              </h1>
              <p className="text-xl text-slate-300 mb-6">
                Discover tournaments, compete for points, and climb the ranks
              </p>

              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-yellow-600 to-amber-500 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <CurrencyDollarIcon className="w-5 h-5 text-white" />
                    <div className="text-2xl font-bold text-white">
                      {coinBalance.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-sm text-yellow-100">Bracket Coins</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gaming-400">
                    {user?.totalPoints || 0}
                  </div>
                  <div className="text-sm text-slate-400">Total Points</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-accent-400">
                    {user?.rank?.tier || 'Bronze'}
                  </div>
                  <div className="text-sm text-slate-400">Current Rank</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">
                    {user?.tournamentsWon || 0}
                  </div>
                  <div className="text-sm text-slate-400">Tournaments Won</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tournaments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                {/* Status Filter */}
                <div className="relative">
                  <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="pl-10 pr-8 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-500 focus:border-transparent appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Game Filter */}
                <select
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
                >
                  <option value="all">All Games</option>
                  {getUniqueGames().map((game) => (
                    <option key={game} value={game}>
                      {game}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tournament Grid */}
          {loadingTournaments ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="gaming-card rounded-xl p-6 animate-pulse"
                >
                  <div className="h-4 bg-slate-700 rounded mb-4"></div>
                  <div className="h-3 bg-slate-700 rounded mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded mb-4"></div>
                  <div className="h-8 bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : Array.isArray(filteredTournaments) && filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No tournaments found
              </h3>
              <p className="text-slate-400 mb-6">
                {searchTerm ||
                selectedStatus !== 'all' ||
                selectedGame !== 'all'
                  ? 'Try adjusting your filters to see more tournaments.'
                  : 'No tournaments are available at the moment.'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('all');
                  setSelectedGame('all');
                }}
                className="bg-gaming-600 hover:bg-gaming-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <HowItWorks />
      <ActiveTournaments />
      <Stats />
    </div>
  );
}
