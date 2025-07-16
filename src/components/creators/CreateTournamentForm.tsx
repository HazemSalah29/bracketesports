'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import {
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import {
  CREATOR_TIERS,
  TOURNAMENT_ENTRY_EXAMPLES,
} from '@/constants/creator-program';

interface User {
  id: string;
  username: string;
  creator: {
    id: string;
    tier: keyof typeof CREATOR_TIERS;
    status: string;
    revenueShare: number;
  };
}

interface CreateTournamentFormProps {
  user: User;
}

interface TournamentFormData {
  name: string;
  description: string;
  game: string;
  entryFeeCoin: number;
  entryFeeUSD: number; // RIOT COMPLIANCE: Must display fiat equivalent
  maxParticipants: number;
  tournamentFormat: string; // RIOT COMPLIANCE: Traditional format required
  startDate: string;
  startTime: string;
  prizeType: 'FIAT_ONLY' | 'EXPERIENCE'; // RIOT COMPLIANCE: Limited prize types
  prizeDescription: string;
  fiatPrizePool: number; // RIOT COMPLIANCE: Prize pool in fiat currency
  experiencePrize?: string;
}

export function CreateTournamentForm({ user }: CreateTournamentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TournamentFormData>({
    name: '',
    description: '',
    game: 'VALORANT',
    entryFeeCoin: TOURNAMENT_ENTRY_EXAMPLES[user.creator.tier][1], // Default to middle option
    entryFeeUSD: 5.0, // RIOT COMPLIANCE: Default nominal fiat equivalent
    maxParticipants: 32, // RIOT COMPLIANCE: Will be validated to minimum 20
    tournamentFormat: 'elimination', // RIOT COMPLIANCE: Traditional format
    startDate: '',
    startTime: '',
    prizeType: 'EXPERIENCE', // RIOT COMPLIANCE: Non-monetary experience prizes allowed
    prizeDescription: '',
    fiatPrizePool: 0, // RIOT COMPLIANCE: Fiat prize pool required if any monetary prizes
    experiencePrize: '1-on-1 coaching session with me + Discord VIP role',
  });

  const tierInfo = CREATOR_TIERS[user.creator.tier];
  const suggestedEntryFees = TOURNAMENT_ENTRY_EXAMPLES[user.creator.tier];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tournamentData = {
        ...formData,
        creatorId: user.creator.id,
        startDate: new Date(
          `${formData.startDate}T${formData.startTime}`
        ).toISOString(),
        isCreatorTournament: true,
      };

      const response = await apiClient.tournament.create(tournamentData);

      if (response.success) {
        router.push('/creator/dashboard');
      } else {
        throw new Error('Failed to create tournament');
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
      alert('Failed to create tournament. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const estimatedEarnings =
    (formData.entryFeeCoin *
      formData.maxParticipants *
      user.creator.revenueShare) /
    100 /
    10; // Convert coins to dollars and apply revenue share

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* RIOT GAMES API COMPLIANCE NOTICE */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <InformationCircleIcon className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-blue-800 font-medium mb-3">Creator Tournament Compliance</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <div>
                <strong className="text-blue-800">✓ Compliant Approach:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Players pay with coins, but entry fee displayed in fiat currency (USD)</li>
                  <li>• Experience prizes (coaching, content features) are allowed</li>
                  <li>• Fiat currency prizes distributed based on tournament placements</li>
                  <li>• Minimum 20 participants required</li>
                  <li>• Traditional tournament formats only</li>
                </ul>
              </div>
              <div>
                <strong className="text-red-600">✗ Prohibited:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• No coin-only prizes (must have fiat equivalent or be experience-based)</li>
                  <li>• No gambling, betting, or wagering features</li>
                  <li>• No ladder systems using Tournaments API</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Tournament Details
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tournament Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Saturday Night Valorant"
              />
            </div>

            <div>
              <label
                htmlFor="game"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Game
              </label>
              <select
                id="game"
                value={formData.game}
                onChange={(e) =>
                  setFormData({ ...formData, game: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="VALORANT">Valorant</option>
                <option value="LEAGUE_OF_LEGENDS">League of Legends</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              required
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Join me for a fun evening of competitive Valorant! All skill levels welcome."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="entryFeeCoin"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Entry Fee (Bracket Coins)
              </label>
              <select
                id="entryFeeCoin"
                value={formData.entryFeeCoin}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    entryFeeCoin: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {suggestedEntryFees.map((fee) => (
                  <option key={fee} value={fee}>
                    {fee} coins (${(fee / 10).toFixed(2)})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Suggested for {tierInfo.name}
              </p>
            </div>

            <div>
              <label
                htmlFor="maxParticipants"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Max Participants
                <span className="text-xs text-red-600 ml-2">(Minimum 20 required by Riot Games API policy)</span>
              </label>
              <select
                id="maxParticipants"
                value={formData.maxParticipants}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxParticipants: parseInt(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={20}>20 players (Minimum)</option>
                <option value={24}>24 players</option>
                <option value={32}>32 players</option>
                {tierInfo.maxTournamentSize >= 64 && (
                  <option value={64}>64 players</option>
                )}
                {tierInfo.maxTournamentSize >= 128 && (
                  <option value={128}>128 players</option>
                )}
                {tierInfo.maxTournamentSize >= 256 && (
                  <option value={256}>256 players</option>
                )}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Max {tierInfo.maxTournamentSize} for your tier (minimum 20 for Riot API compliance)
              </p>
            </div>

            {/* RIOT COMPLIANCE: Tournament Format */}
            <div>
              <label
                htmlFor="tournamentFormat"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tournament Format
                <span className="text-xs text-blue-600 ml-2">(Traditional formats required by Riot Games API policy)</span>
              </label>
              <select
                id="tournamentFormat"
                value={formData.tournamentFormat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tournamentFormat: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="elimination">Single Elimination</option>
                <option value="double-elimination">Double Elimination</option>
                <option value="round-robin">Round Robin</option>
                <option value="swiss">Swiss System</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Only traditional tournament formats are allowed per Riot Games API policy
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Earnings
              </label>
              <div className="flex items-center h-10 px-3 bg-green-50 border border-green-200 rounded-lg">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-semibold text-green-700">
                  ${estimatedEarnings.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {user.creator.revenueShare}% of entry fees
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                required
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                required
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Prize Configuration */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <TrophyIcon className="h-5 w-5 text-yellow-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Prize Configuration
            </h2>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Prize Type
              <span className="text-xs text-blue-600 ml-2">(Riot Games API compliant options only)</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  value: 'EXPERIENCE',
                  label: 'Experience Prize',
                  desc: 'Coaching, content features, community perks',
                },
                { 
                  value: 'FIAT_ONLY', 
                  label: 'Fiat Currency', 
                  desc: 'Cash prizes distributed in USD/EUR/etc.' 
                },
              ].map((type) => (
                <label key={type.value} className="relative">
                  <input
                    type="radio"
                    name="prizeType"
                    value={type.value}
                    checked={formData.prizeType === type.value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prizeType: e.target.value as any,
                      })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                      formData.prizeType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-900">
                      {type.label}
                    </div>
                    <div className="text-xs text-gray-500">{type.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {formData.prizeType === 'EXPERIENCE' && (
            <div>
              <label
                htmlFor="experiencePrize"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Experience Description
              </label>
              <textarea
                id="experiencePrize"
                rows={3}
                value={formData.experiencePrize}
                onChange={(e) =>
                  setFormData({ ...formData, experiencePrize: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Winners get a 1-on-1 coaching session, Discord VIP role, and a custom shoutout in my next stream!"
              />
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">
                      Experience prizes are perfect for building community!
                    </p>
                    <p>
                      Examples: Coaching sessions, Discord perks, stream
                      features, signed merch, collaboration opportunities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RIOT COMPLIANCE: Fiat Prize Pool */}
          {formData.prizeType === 'FIAT_ONLY' && (
            <div>
              <label
                htmlFor="fiatPrizePool"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Fiat Currency Prize Pool ($)
                <span className="text-xs text-blue-600 ml-2">(Riot Games API compliant)</span>
              </label>
              <input
                type="number"
                id="fiatPrizePool"
                min="0"
                max="50"
                step="0.01"
                value={formData.fiatPrizePool || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fiatPrizePool: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="25.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                Prize pool will be distributed to winners in USD. Must be nominal amount (max $50 per Riot policy).
              </p>
            </div>
          )}

          {/* Entry Fee and Fiat Equivalent Display */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Entry Fee Configuration (Riot Games API Compliant)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-blue-700 mb-1">
                  Coin Entry Fee
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.entryFeeCoin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      entryFeeCoin: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-700 mb-1">
                  Fiat Equivalent (USD) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.01"
                  value={formData.entryFeeUSD}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      entryFeeUSD: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Entry fee must be displayed in fiat currency (USD) for Riot Games API compliance. 
              Players pay {formData.entryFeeCoin} coins (${formData.entryFeeUSD} USD equivalent).
            </p>
          </div>

          <div>
            <label
              htmlFor="prizeDescription"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Prize Description
            </label>
            <textarea
              id="prizeDescription"
              required
              rows={3}
              value={formData.prizeDescription}
              onChange={(e) =>
                setFormData({ ...formData, prizeDescription: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="What will winners receive? Be specific about what you're offering."
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Tournament'}
        </button>
      </div>
    </form>
  );
}
