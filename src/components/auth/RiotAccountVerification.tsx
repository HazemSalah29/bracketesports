'use client'

import { useState } from 'react'
import { ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'

interface RiotAccountVerificationProps {
  onVerified: (account: any) => void
}

export default function RiotAccountVerification({ onVerified }: RiotAccountVerificationProps) {
  const [step, setStep] = useState<'input' | 'verify' | 'verified'>('input')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    gameName: '',
    tagLine: '',
    game: 'VALORANT' as 'VALORANT' | 'LEAGUE_OF_LEGENDS'
  })
  const [verificationData, setVerificationData] = useState<{
    code: string
    instructions: string
  } | null>(null)
  const [verificationCode, setVerificationCode] = useState('')

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.gameName.trim() || !formData.tagLine.trim()) {
      toast.error('Please enter your Riot ID and tag')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/user/gaming-accounts/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          platform: 'riot',
          gameName: formData.gameName.trim(),
          tagLine: formData.tagLine.trim(),
          game: formData.game
        })
      })

      const data = await response.json()

      if (response.ok) {
        setVerificationData({
          code: data.data.verificationCode,
          instructions: data.data.instructions
        })
        setStep('verify')
        toast.success('Verification code generated!')
      } else {
        toast.error(data.message || 'Failed to verify account')
      }
    } catch (error) {
      toast.error('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/user/gaming-accounts/verify', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          platform: 'riot',
          gameName: formData.gameName.trim(),
          tagLine: formData.tagLine.trim(),
          game: formData.game,
          verificationCode: verificationCode.trim()
        })
      })

      const data = await response.json()

      if (response.ok) {
        setStep('verified')
        toast.success('Riot account verified successfully!')
        onVerified(data.data.account)
      } else {
        toast.error(data.message || 'Verification failed')
      }
    } catch (error) {
      toast.error('Network error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'verified') {
    return (
      <div className="text-center py-8">
        <ShieldCheckIcon className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Account Verified!</h3>
        <p className="text-slate-400">
          Your Riot account has been successfully linked and verified.
        </p>
      </div>
    )
  }

  if (step === 'verify') {
    return (
      <div className="space-y-6">
        <div className="bg-accent-500/10 border border-accent-500/20 rounded-lg p-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-accent-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-accent-400 font-medium mb-2">Verification Required</h4>
              <p className="text-sm text-slate-300 mb-4">
                {verificationData?.instructions}
              </p>
              <div className="bg-slate-800 rounded p-3 font-mono text-gaming-400 text-center">
                {verificationData?.code}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleVerificationSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Enter the verification code from above
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
              placeholder="Enter verification code"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono tracking-wider text-center focus:outline-none focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
              maxLength={8}
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setStep('input')}
              className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gaming-600 hover:bg-gaming-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Account'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <form onSubmit={handleInitialSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Link Your Riot Account</h3>
        <p className="text-slate-400 text-sm mb-6">
          Link your Riot Games account to participate in tournaments and track your performance.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Select Game
        </label>
        <select
          value={formData.game}
          onChange={(e) => setFormData({ ...formData, game: e.target.value as 'VALORANT' | 'LEAGUE_OF_LEGENDS' })}
          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
        >
          <option value="VALORANT">Valorant</option>
          <option value="LEAGUE_OF_LEGENDS">League of Legends</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Riot ID
          </label>
          <input
            type="text"
            value={formData.gameName}
            onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
            placeholder="Your game name"
            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Tag
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-400">#</span>
            <input
              type="text"
              value={formData.tagLine}
              onChange={(e) => setFormData({ ...formData, tagLine: e.target.value })}
              placeholder="TAG"
              className="w-full pl-8 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gaming-500 focus:border-transparent"
              maxLength={5}
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4 text-sm text-slate-400">
        <p className="mb-2">
          <strong className="text-slate-300">Example:</strong> If your Riot ID is &quot;PlayerName#NA1&quot;, enter:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Riot ID: PlayerName</li>
          <li>Tag: NA1</li>
        </ul>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-gaming-600 hover:bg-gaming-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Verifying...' : 'Start Verification'}
      </button>
    </form>
  )
}
