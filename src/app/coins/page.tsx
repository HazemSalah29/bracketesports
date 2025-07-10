'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api-client'
import { COIN_PACKAGES } from '@/constants/creator-program'
import { loadStripe } from '@stripe/stripe-js'
import { 
  CurrencyDollarIcon, 
  StarIcon, 
  CheckIcon,
  SparklesIcon,
  GiftIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import toast from 'react-hot-toast'

// Only initialize Stripe if the publishable key is available
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null

export default function CoinsPage() {
  const { isAuthenticated, user } = useAuth()
  const [coinBalance, setCoinBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCoinBalance()
    }
  }, [isAuthenticated])

  const fetchCoinBalance = async () => {
    try {
      const data = await apiClient.getCoinBalance()
      setCoinBalance(data.balance)
    } catch (error) {
      console.error('Failed to fetch coin balance:', error)
    }
  }

  const handlePurchase = async (packageId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase coins')
      return
    }

    // Check if Stripe is configured
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      toast.error('Payment system is not configured. Please contact support.')
      return
    }

    setLoading(true)
    setSelectedPackage(packageId)

    try {
      const { clientSecret } = await apiClient.purchaseCoins({ packageId })
      
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error('Payment system failed to load. Please refresh and try again.')
      }

      const result = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/coins/success`,
        },
      })

      if (result.error) {
        toast.error(result.error.message || 'Payment failed')
      }
    } catch (error: any) {
      toast.error(error.message || 'Purchase failed')
    } finally {
      setLoading(false)
      setSelectedPackage(null)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Purchase Bracket Coins</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Please login to purchase coins and participate in creator tournaments
            </p>
          </div>
          <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">Login Required</h2>
            <p className="text-slate-300 mb-6">Please login to purchase coins and access creator tournaments</p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-4 rounded-full">
              <CurrencyDollarIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Purchase Bracket Coins</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Buy Bracket Coins to participate in exclusive creator tournaments and unlock premium experiences
          </p>
        </div>

        {/* Payment System Warning */}
        {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-300">
                  Payment System Configuration Required
                </h3>
                <div className="mt-2 text-sm text-yellow-200">
                  <p>
                    The payment system is currently not configured. Please contact the administrator to set up Stripe integration.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Current Balance */}
        <div className="bg-slate-800 rounded-xl p-6 mb-12 max-w-md mx-auto border border-slate-700">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Current Balance</h3>
            <div className="flex items-center justify-center space-x-2">
              <CurrencyDollarIcon className="w-8 h-8 text-yellow-500" />
              <span className="text-3xl font-bold text-white">
                {coinBalance.toLocaleString()}
              </span>
              <span className="text-lg text-slate-300">BC</span>
            </div>
          </div>
        </div>

        {/* Coin Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {COIN_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-slate-800 rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 ${
                pkg.popular
                  ? 'border-yellow-500 ring-2 ring-yellow-500 ring-opacity-50'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              {pkg.popular && (
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full mb-4 text-center">
                  🔥 Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500' 
                      : 'bg-slate-700'
                  }`}>
                    <CurrencyDollarIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                  {pkg.id.charAt(0).toUpperCase() + pkg.id.slice(1)} Package
                </h3>
                <div className="text-3xl font-bold text-white mb-1">
                  ${pkg.price}
                </div>
                <div className="text-lg text-slate-300 mb-2">
                  {pkg.coins.toLocaleString()} Coins
                </div>
                
                {pkg.bonus > 0 && (
                  <div className="flex items-center justify-center space-x-1 text-green-400 text-sm">
                    <GiftIcon className="w-4 h-4" />
                    <span>+{pkg.bonus.toLocaleString()} bonus coins!</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <p className="text-slate-300 text-sm text-center">
                  {pkg.description}
                </p>
              </div>

              <button
                onClick={() => handlePurchase(pkg.id)}
                disabled={
                  (loading && selectedPackage === pkg.id) || 
                  !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                }
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : pkg.popular
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
                  'Payment System Unavailable'
                ) : loading && selectedPackage === pkg.id ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Purchase ${pkg.coins.toLocaleString()} Coins`
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            What You Can Do With Bracket Coins
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Creator Tournaments
              </h3>
              <p className="text-slate-300 text-sm">
                Join exclusive tournaments hosted by your favorite gaming creators and streamers
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Premium Experiences
              </h3>
              <p className="text-slate-300 text-sm">
                Get 1-on-1 coaching, exclusive Discord access, and personalized content from creators
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Win Prizes
              </h3>
              <p className="text-slate-300 text-sm">
                Earn coin prizes, cash rewards, merchandise, and exclusive creator collaborations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
