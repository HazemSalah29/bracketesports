'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { apiClient } from '@/lib/api-client'

export default function CoinPurchaseSuccessPage() {
  const searchParams = useSearchParams()
  const [coinBalance, setCoinBalance] = useState(0)
  const paymentIntentId = searchParams.get('payment_intent')

  useEffect(() => {
    fetchCoinBalance()
  }, [])

  const fetchCoinBalance = async () => {
    try {
      const response = await apiClient.getCoinBalance()
      if (response.success && response.data) {
        setCoinBalance((response.data as any).balance || 0)
      }
    } catch (error) {
      console.error('Failed to fetch coin balance:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full">
              <CheckCircleIcon className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-white mb-4">
            Purchase Successful!
          </h1>
          <p className="text-lg text-slate-300 mb-8">
            Your Bracket Coins have been added to your account
          </p>

          {/* Current Balance */}
          <div className="bg-slate-700 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">
              Current Balance
            </h3>
            <div className="flex items-center justify-center space-x-2">
              <CurrencyDollarIcon className="w-8 h-8 text-yellow-500" />
              <span className="text-3xl font-bold text-white">
                {coinBalance.toLocaleString()}
              </span>
              <span className="text-lg text-slate-300">BC</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tournaments"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Tournaments
            </Link>
            <Link
              href="/coins"
              className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Buy More Coins
            </Link>
          </div>

          {/* Payment Details */}
          {paymentIntentId && (
            <div className="mt-8 pt-6 border-t border-slate-600">
              <p className="text-sm text-slate-400">
                Payment ID: {paymentIntentId}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
