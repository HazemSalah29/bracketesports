'use client'

import { useState } from 'react'
import { COIN_PACKAGES } from '@/constants/creator-program'
import { CreditCardIcon, StarIcon } from '@heroicons/react/24/outline'

interface CoinPurchaseProps {
  currentBalance?: number
}

export default function CoinPurchase({ currentBalance = 0 }: CoinPurchaseProps) {
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  const handlePurchase = async (packageId: string) => {
    setLoading(true)
    setSelectedPackage(packageId)

    try {
      const response = await fetch('/api/coins/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ packageId }),
      })

      const data = await response.json()

      if (data.success) {
        // In a real app, you'd redirect to Stripe Checkout or handle the client secret
        alert('Purchase initiated! In a real app, this would redirect to Stripe Checkout.')
        console.log('Client Secret:', data.clientSecret)
      } else {
        alert('Purchase failed: ' + data.error)
      }
    } catch (error) {
      console.error('Purchase error:', error)
      alert('Purchase failed. Please try again.')
    } finally {
      setLoading(false)
      setSelectedPackage(null)
    }
  }

  return (
    <div className="bg-slate-900 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Buy Bracket Coins
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Get coins to join exclusive creator tournaments and experiences
          </p>
          <div className="inline-flex items-center bg-slate-800 rounded-lg px-6 py-3">
            <div className="text-2xl font-bold text-gaming-500 mr-2">
              {currentBalance}
            </div>
            <div className="text-slate-300">Current Balance</div>
          </div>
        </div>

        {/* Coin Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {COIN_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-2xl p-6 border-2 transition-all ${
                pkg.popular
                  ? 'border-gaming-500 bg-gradient-to-b from-gaming-900/20 to-slate-800'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-600'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gaming-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <StarIcon className="w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center">
                {/* Coin Amount */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white">
                    {(pkg.coins + pkg.bonus).toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400">Bracket Coins</div>
                  {pkg.bonus > 0 && (
                    <div className="text-xs text-gaming-400 mt-1">
                      +{pkg.bonus} bonus coins!
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gaming-500">
                    ${pkg.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-400">
                    ${(pkg.price / (pkg.coins + pkg.bonus) * 100).toFixed(1)} per 100 coins
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 mb-6">
                  {pkg.description}
                </p>

                {/* Purchase Button */}
                <button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={loading}
                  className={`w-full rounded-lg px-4 py-3 font-semibold transition-colors flex items-center justify-center ${
                    pkg.popular
                      ? 'bg-gaming-600 hover:bg-gaming-500 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  } ${
                    loading && selectedPackage === pkg.id
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {loading && selectedPackage === pkg.id ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  ) : (
                    <CreditCardIcon className="w-5 h-5 mr-2" />
                  )}
                  {loading && selectedPackage === pkg.id ? 'Processing...' : 'Buy Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">
            What can you do with Bracket Coins?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Creator Tournaments
              </h3>
              <p className="text-slate-300">
                Join exclusive tournaments hosted by your favorite streamers and content creators
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Win Prizes
              </h3>
              <p className="text-slate-300">
                Earn coaching sessions, merchandise, and even more coins from tournament wins
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-6">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                VIP Access
              </h3>
              <p className="text-slate-300">
                Get early access to tournaments and exclusive content from creators
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
