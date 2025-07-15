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
  maxParticipants: number;
  startDate: string;
  startTime: string;
  prizeType: 'EXPERIENCE' | 'COINS' | 'CASH' | 'MERCHANDISE' | 'HYBRID';
  prizeDescription: string;
  cashPrizePool?: number;
  coinPrizePool?: number;
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
    maxParticipants: 32,
    startDate: '',
    startTime: '',
    prizeType: 'EXPERIENCE',
    prizeDescription: '',
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
                <option value={8}>8 players</option>
                <option value={16}>16 players</option>
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
                Max {tierInfo.maxTournamentSize} for your tier
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
            </label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[
                {
                  value: 'EXPERIENCE',
                  label: 'Experience',
                  desc: 'Coaching, content features',
                },
                { value: 'COINS', label: 'Coins', desc: 'Platform currency' },
                { value: 'CASH', label: 'Cash', desc: 'Direct payment' },
                {
                  value: 'MERCHANDISE',
                  label: 'Merch',
                  desc: 'Physical items',
                },
                { value: 'HYBRID', label: 'Mixed', desc: 'Combination' },
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

          {(formData.prizeType === 'COINS' ||
            formData.prizeType === 'HYBRID') && (
            <div>
              <label
                htmlFor="coinPrizePool"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Coin Prize Pool
              </label>
              <input
                type="number"
                id="coinPrizePool"
                min="0"
                value={formData.coinPrizePool || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coinPrizePool: parseInt(e.target.value) || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Coins you&apos;ll award to winners (comes from your earnings)
              </p>
            </div>
          )}

          {(formData.prizeType === 'CASH' ||
            formData.prizeType === 'HYBRID') && (
            <div>
              <label
                htmlFor="cashPrizePool"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Cash Prize Pool ($)
              </label>
              <input
                type="number"
                id="cashPrizePool"
                min="0"
                step="0.01"
                value={formData.cashPrizePool || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cashPrizePool: parseFloat(e.target.value) || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="100.00"
              />
              <p className="text-xs text-gray-500 mt-1">
                Cash you&apos;ll pay winners (your responsibility)
              </p>
            </div>
          )}

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
