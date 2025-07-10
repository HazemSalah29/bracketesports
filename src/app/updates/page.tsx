'use client'

import Link from 'next/link'
import { 
  CheckCircleIcon, 
  CurrencyDollarIcon, 
  StarIcon, 
  SparklesIcon,
  UserGroupIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'

export default function UpdatesPage() {
  return (
    <div className="min-h-screen bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
              <SparklesIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to the New Bracket Esports!
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            We&apos;ve transformed into a creator economy platform where you can play with your favorite gaming creators!
          </p>
        </div>

        {/* What's New */}
        <div className="bg-slate-800 rounded-xl p-8 mb-8 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            🎉 What&apos;s New
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold">Creator Tournaments</h3>
                  <p className="text-slate-300 text-sm">
                    Join exclusive tournaments hosted by verified gaming creators and streamers
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold">Bracket Coins System</h3>
                  <p className="text-slate-300 text-sm">
                    Purchase coins to enter premium tournaments and unlock exclusive experiences
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold">Premium Experiences</h3>
                  <p className="text-slate-300 text-sm">
                    Win 1-on-1 coaching, Discord access, and personalized content from creators
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold">Dark Theme</h3>
                  <p className="text-slate-300 text-sm">
                    Consistent dark gaming theme across all pages for better experience
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold">Updated Navigation</h3>
                  <p className="text-slate-300 text-sm">
                    Navigation now shows your coin balance and quick access to coin purchases
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold">Amazing Prizes</h3>
                  <p className="text-slate-300 text-sm">
                    Win coins, cash, merchandise, and exclusive creator collaborations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/coins"
            className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 rounded-xl p-6 transition-all duration-200 hover:scale-105"
          >
            <div className="text-center">
              <CurrencyDollarIcon className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Buy Coins</h3>
              <p className="text-yellow-100 text-sm">
                Purchase Bracket Coins to join creator tournaments
              </p>
            </div>
          </Link>
          
          <Link
            href="/tournaments"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl p-6 transition-all duration-200 hover:scale-105"
          >
            <div className="text-center">
              <TrophyIcon className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Browse Tournaments</h3>
              <p className="text-blue-100 text-sm">
                Discover tournaments hosted by your favorite creators
              </p>
            </div>
          </Link>
          
          <Link
            href="/creator/dashboard"
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl p-6 transition-all duration-200 hover:scale-105"
          >
            <div className="text-center">
              <UserGroupIcon className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Become a Creator</h3>
              <p className="text-purple-100 text-sm">
                Apply to host tournaments and monetize your community
              </p>
            </div>
          </Link>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Link
            href="/"
            className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center space-x-2"
          >
            <StarIcon className="w-5 h-5" />
            <span>Explore the Platform</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
