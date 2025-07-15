'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { CREATOR_TIERS } from '@/constants/creator-program';

export default function CreatorApplication() {
  const [formData, setFormData] = useState({
    handle: '',
    twitchUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
    discordUrl: '',
    followerCount: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.creator.apply({
        organizationName: formData.handle,
        experience: `${formData.followerCount} followers`,
        references: `Twitch: ${formData.twitchUrl}, YouTube: ${formData.youtubeUrl}, TikTok: ${formData.tiktokUrl}`,
        motivation: `Discord: ${formData.discordUrl}`,
      });

      if (response.success) {
        setSubmitted(true);
        alert('Application submitted successfully!');
      } else {
        alert('Application failed: ' + response.error);
      }
    } catch (error) {
      console.error('Application error:', error);
      alert('Application failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getEstimatedTier = () => {
    const followers = parseInt(formData.followerCount);
    if (!followers) return null;

    if (followers >= 1000000) return 'ELITE';
    if (followers >= 250000) return 'PARTNER';
    if (followers >= 50000) return 'RISING';
    if (followers >= 10000) return 'EMERGING';
    return null;
  };

  const estimatedTier = getEstimatedTier();

  if (submitted) {
    return (
      <div className="bg-slate-900 min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-slate-800 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Application Submitted!
            </h1>
            <p className="text-slate-300 mb-6">
              Thank you for applying to the Bracket Esports Creator Program. We
              will review your application within 3-5 business days and get back
              to you via email.
            </p>
            <button
              onClick={() => (window.location.href = '/')}
              className="bg-gaming-600 hover:bg-gaming-500 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Creator Program Application
          </h1>
          <p className="text-xl text-slate-300">
            Join the Bracket Esports Creator Program and monetize your gaming
            community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Creator Handle */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Creator Handle *
                  </label>
                  <input
                    type="text"
                    name="handle"
                    value={formData.handle}
                    onChange={handleChange}
                    required
                    placeholder="Your unique creator handle (e.g., ProGamer2024)"
                    className="w-full rounded-lg border-0 bg-slate-700 px-4 py-3 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-gaming-500"
                  />
                </div>

                {/* Follower Count */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Total Follower Count *
                  </label>
                  <input
                    type="number"
                    name="followerCount"
                    value={formData.followerCount}
                    onChange={handleChange}
                    required
                    min="10000"
                    placeholder="Combined followers across all platforms"
                    className="w-full rounded-lg border-0 bg-slate-700 px-4 py-3 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-gaming-500"
                  />
                  {estimatedTier && (
                    <p className="mt-2 text-sm text-gaming-400">
                      Estimated Tier:{' '}
                      {
                        CREATOR_TIERS[
                          estimatedTier as keyof typeof CREATOR_TIERS
                        ].name
                      }
                      (
                      {
                        CREATOR_TIERS[
                          estimatedTier as keyof typeof CREATOR_TIERS
                        ].revenueShare
                      }
                      % revenue share)
                    </p>
                  )}
                </div>

                {/* Social Media Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Twitch URL
                    </label>
                    <input
                      type="url"
                      name="twitchUrl"
                      value={formData.twitchUrl}
                      onChange={handleChange}
                      placeholder="https://twitch.tv/yourname"
                      className="w-full rounded-lg border-0 bg-slate-700 px-4 py-3 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-gaming-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      YouTube URL
                    </label>
                    <input
                      type="url"
                      name="youtubeUrl"
                      value={formData.youtubeUrl}
                      onChange={handleChange}
                      placeholder="https://youtube.com/@yourname"
                      className="w-full rounded-lg border-0 bg-slate-700 px-4 py-3 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-gaming-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      TikTok URL
                    </label>
                    <input
                      type="url"
                      name="tiktokUrl"
                      value={formData.tiktokUrl}
                      onChange={handleChange}
                      placeholder="https://tiktok.com/@yourname"
                      className="w-full rounded-lg border-0 bg-slate-700 px-4 py-3 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-gaming-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Discord Server
                    </label>
                    <input
                      type="url"
                      name="discordUrl"
                      value={formData.discordUrl}
                      onChange={handleChange}
                      placeholder="https://discord.gg/yourserver"
                      className="w-full rounded-lg border-0 bg-slate-700 px-4 py-3 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-gaming-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gaming-600 hover:bg-gaming-500 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Creator Tiers Info */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                Creator Tiers
              </h3>
              <div className="space-y-4">
                {Object.entries(CREATOR_TIERS).map(([key, tier]) => (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border ${
                      estimatedTier === key
                        ? 'border-gaming-500 bg-gaming-900/20'
                        : 'border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-white">{tier.name}</div>
                    <div className="text-sm text-slate-300 mt-1">
                      {tier.minFollowers.toLocaleString()}+ followers
                    </div>
                    <div className="text-sm text-gaming-400 mt-1">
                      {tier.revenueShare}% revenue share
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      Max {tier.maxTournamentSize} players per tournament
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-slate-800 rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Requirements
              </h3>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• 10,000+ total followers across platforms</li>
                <li>• 70%+ gaming/esports content</li>
                <li>• Active content creation (2+ posts/week)</li>
                <li>• Clean record (no major violations)</li>
                <li>• Positive community engagement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
