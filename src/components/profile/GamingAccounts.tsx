'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { apiClient } from '@/lib/api-client'
import { GameIcon } from '@/components/ui/GameIcons'
import toast from 'react-hot-toast'

interface GamingAccount {
  id: string
  platform: string
  username: string
  platformId: string
  verified: boolean
  createdAt: string
  riotData?: {
    gameName: string
    tagLine: string
    puuid: string
    level: number
    currentRank?: {
      tier: string
      division: string
      lp: number
    }
  }
}

interface GamePlatform {
  id: string
  name: string
  icon: string
  color: string
  fields: {
    name: string
    placeholder: string
    type: 'text' | 'email'
    required: boolean
  }[]
}

const GAME_PLATFORMS: GamePlatform[] = [
  {
    id: 'valorant',
    name: 'Valorant',
    icon: '',
    color: 'from-red-500 to-pink-500',
    fields: [
      { name: 'gameName', placeholder: 'Riot ID (e.g., PlayerName)', type: 'text', required: true },
      { name: 'tagLine', placeholder: 'Tag (e.g., #1234)', type: 'text', required: true }
    ]
  },
  {
    id: 'league',
    name: 'League of Legends',
    icon: '',
    color: 'from-blue-500 to-cyan-500',
    fields: [
      { name: 'gameName', placeholder: 'Riot ID (e.g., PlayerName)', type: 'text', required: true },
      { name: 'tagLine', placeholder: 'Tag (e.g., #1234)', type: 'text', required: true }
    ]
  },
  {
    id: 'steam',
    name: 'Steam',
    icon: '🎮',
    color: 'from-slate-600 to-slate-800',
    fields: [
      { name: 'username', placeholder: 'Steam Username', type: 'text', required: true }
    ]
  },
  {
    id: 'epic',
    name: 'Epic Games',
    icon: '🚀',
    color: 'from-purple-500 to-indigo-500',
    fields: [
      { name: 'username', placeholder: 'Epic Games Username', type: 'text', required: true }
    ]
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: '💬',
    color: 'from-indigo-500 to-purple-600',
    fields: [
      { name: 'username', placeholder: 'Discord Username', type: 'text', required: true }
    ]
  }
]

interface GamingAccountsProps {
  onAccountSelect?: (account: GamingAccount) => void
  selectedAccountId?: string
}

interface VerificationState {
  account: GamingAccount | null
  step: 'start' | 'waiting' | 'complete'
  verificationCode?: string
  instructions?: string
  error?: string
}

interface ConfirmDialogState {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function GamingAccounts({ onAccountSelect, selectedAccountId }: GamingAccountsProps) {
  const [accounts, setAccounts] = useState<GamingAccount[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<GamePlatform | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {}
  })

  // Fetch gaming accounts
  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      setIsLoadingAccounts(true)
      const response = await apiClient.getGamingAccounts()
      const formattedAccounts = (response || []).map((account: any) => ({
        ...account,
        createdAt: typeof account.createdAt === 'string' ? account.createdAt : account.createdAt.toISOString()
      }))
      setAccounts(formattedAccounts)
    } catch (error) {
      console.error('Failed to fetch gaming accounts:', error)
      toast.error('Failed to load gaming accounts')
      setAccounts([])
    } finally {
      setIsLoadingAccounts(false)
    }
  }

  const handlePlatformSelect = (platform: GamePlatform) => {
    setSelectedPlatform(platform)
    setFormData({})
  }

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🔧 Starting handleAddAccount')
    console.log('🔧 selectedPlatform:', selectedPlatform)
    console.log('🔧 formData:', formData)
    
    if (!selectedPlatform) return

    // Validate required fields
    const missingFields = selectedPlatform.fields
      .filter(field => field.required && !formData[field.name]?.trim())
      .map(field => field.placeholder)

    if (missingFields.length > 0) {
      console.log('🔧 Missing fields:', missingFields)
      toast.error(`Please fill in: ${missingFields.join(', ')}`)
      return
    }

    setIsLoading(true)

    try {
      let requestData: any = {
        platform: selectedPlatform.id
      }

      // Handle Riot games specially (gameName + tagLine)
      if (selectedPlatform.id === 'valorant' || selectedPlatform.id === 'league') {
        if (!formData.gameName || !formData.tagLine) {
          console.log('🔧 Missing Riot credentials')
          toast.error('Both Riot ID and Tag are required')
          setIsLoading(false)
          return
        }

        requestData.gameName = formData.gameName.trim()
        requestData.tagLine = formData.tagLine.replace('#', '').trim()
        requestData.username = `${formData.gameName}#${formData.tagLine?.replace('#', '')}`
        requestData.game = selectedPlatform.id === 'valorant' ? 'VALORANT' : 'LEAGUE_OF_LEGENDS'
      } else {
        requestData.username = formData.username?.trim()
      }

      console.log('🔧 Final requestData:', requestData)
      
      const response = await apiClient.addGamingAccount(requestData)
      console.log('🔧 API Response:', response)
      
      if (response?.success) {
        const message = response.data.autoVerified 
          ? '✅ Account linked and automatically verified!' 
          : response.message || 'Gaming account added successfully!'
        
        toast.success(message)
        await fetchAccounts()
        setShowAddModal(false)
        setSelectedPlatform(null)
        setFormData({})
      } else {
        toast.error(response?.message || 'Failed to add gaming account')
      }
    } catch (error: any) {
      console.error('🔧 Add account error details:', {
        error,
        message: error?.message,
        response: error?.response,
        status: error?.status
      })
      
      // Parse specific error messages
      let errorMessage = 'Failed to add gaming account'
      
      // Handle different error types
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error?.message) {
        if (error.message.includes('Authentication required')) {
          errorMessage = '🔐 Please log in to add gaming accounts.'
          // Optionally redirect to login page
          // window.location.href = '/auth/login'
        } else if (error.message.includes('not found')) {
          errorMessage = '❌ Riot account not found. Please check your Riot ID and tag.'
        } else if (error.message.includes('already linked to another user')) {
          errorMessage = '❌ This account is already linked to another user.'
        } else if (error.message.includes('already have')) {
          errorMessage = '❌ You already have an account linked for this platform.'
        } else if (error.message.includes('Too many requests')) {
          errorMessage = '⏳ Too many requests. Please wait a moment and try again.'
        } else if (error.message.includes('403') || error.message.includes('Access denied')) {
          errorMessage = '❌ Unable to verify account. Riot API access limited.'
        } else if (error.message.includes('429')) {
          errorMessage = '⏳ Rate limit exceeded. Please try again in a few seconds.'
        } else {
          errorMessage = error.message
        }
      }
      
      console.log('🔧 Final error message:', errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async (accountId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Gaming Account',
      message: 'Are you sure you want to remove this gaming account? This action cannot be undone.',
      onConfirm: async () => {
        try {
          const response = await apiClient.deleteGamingAccount(accountId)
          if (response?.success) {
            toast.success('Gaming account removed')
            await fetchAccounts()
          } else {
            toast.error('Failed to remove gaming account')
          }
        } catch (error) {
          toast.error('Failed to remove gaming account')
        }
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
      },
      onCancel: () => {
        setConfirmDialog(prev => ({ ...prev, isOpen: false }))
      }
    })
  }

  const getPlatformInfo = (platformId: string) => {
    return GAME_PLATFORMS.find(p => p.id === platformId) || {
      id: platformId,
      name: platformId.charAt(0).toUpperCase() + platformId.slice(1),
      icon: '🎮',
      color: 'from-slate-500 to-slate-700',
      fields: []
    }
  }

  const formatUsername = (account: GamingAccount) => {
    if (account.platform === 'valorant' || account.platform === 'league') {
      if (account.riotData) {
        return `${account.riotData.gameName}#${account.riotData.tagLine}`
      }
    }
    return account.username
  }

  const getRankDisplay = (account: GamingAccount) => {
    if (account.riotData?.currentRank) {
      const { tier, division, lp } = account.riotData.currentRank
      return `${tier} ${division} (${lp} LP)`
    }
    return null
  }

  if (isLoadingAccounts) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-slate-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Gaming Accounts</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gaming-600 hover:bg-gaming-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Link Account</span>
        </button>
      </div>

      {/* Accounts List */}
      <div className="grid gap-4">
        {accounts.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center">
            <div className="text-slate-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Gaming Accounts</h3>
            <p className="text-slate-400 mb-4">Link your gaming accounts to track your progress and stats</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gaming-600 hover:bg-gaming-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Link Your First Account
            </button>
          </div>
        ) : (
          accounts.map((account) => {
            const platformInfo = getPlatformInfo(account.platform)
            const isSelected = selectedAccountId === account.id
            
            return (
              <div
                key={account.id}
                className={`bg-slate-800 rounded-lg p-4 border-2 transition-all ${
                  isSelected 
                    ? 'border-gaming-500 bg-gaming-500/10' 
                    : 'border-transparent hover:border-slate-600'
                } ${onAccountSelect ? 'cursor-pointer' : ''}`}
                onClick={() => onAccountSelect?.(account)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${platformInfo.color} rounded-lg flex items-center justify-center text-2xl`}>
                      <GameIcon gameId={account.platform} size={32} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white">{platformInfo.name}</h3>
                        {account.verified ? (
                          <CheckCircleIcon className="w-5 h-5 text-green-500" />
                        ) : (
                          <ExclamationCircleIcon className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-slate-300 font-mono">{formatUsername(account)}</p>
                      {getRankDisplay(account) && (
                        <p className="text-sm text-gaming-400">{getRankDisplay(account)}</p>
                      )}
                      {account.riotData?.level && (
                        <p className="text-sm text-slate-400">Level {account.riotData.level}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!account.verified && (account.platform === 'valorant' || account.platform === 'league' || account.platform === 'riot') && (
                      <span className="px-3 py-1 text-xs bg-yellow-600 text-white rounded">
                        Unverified
                      </span>
                    )}
                    {onAccountSelect && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onAccountSelect(account)
                        }}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteAccount(account.id)
                      }}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                      title="Remove Account"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddModal(false)
              setSelectedPlatform(null)
              setFormData({})
            }
          }}
        >
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => {
                setShowAddModal(false)
                setSelectedPlatform(null)
                setFormData({})
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white mb-6">Link Gaming Account</h3>
            
            {!selectedPlatform ? (
              <div className="space-y-3">
                <p className="text-slate-400 mb-4">Choose a platform to link:</p>
                {GAME_PLATFORMS.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => handlePlatformSelect(platform)}
                    className="w-full flex items-center space-x-4 p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${platform.color} rounded-lg flex items-center justify-center text-xl`}>
                      <GameIcon gameId={platform.id} size={24} />
                    </div>
                    <span className="text-white font-medium">{platform.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handleAddAccount} className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${selectedPlatform.color} rounded-lg flex items-center justify-center text-xl`}>
                    <GameIcon gameId={selectedPlatform.id} size={24} />
                  </div>
                  <span className="text-white font-medium">{selectedPlatform.name}</span>
                </div>

                {selectedPlatform.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      {field.placeholder}
                      {field.required && <span className="text-red-400 ml-1">*</span>}
                    </label>
                    <input
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-gaming-500"
                      required={field.required}
                    />
                  </div>
                ))}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlatform(null)
                      setFormData({})
                    }}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-gaming-600 hover:bg-gaming-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {isLoading ? 'Adding...' : 'Add Account'}
                  </button>
                </div>
              </form>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setSelectedPlatform(null)
                  setFormData({})
                }}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">{confirmDialog.title}</h3>
            <p className="text-slate-300 mb-6">{confirmDialog.message}</p>
            <div className="flex space-x-3">
              <button
                onClick={confirmDialog.onCancel}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
