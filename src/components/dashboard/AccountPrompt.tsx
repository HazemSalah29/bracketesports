'use client'

import { 
  XMarkIcon, 
  LinkIcon, 
  WalletIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface AccountPromptProps {
  type: 'account' | 'balance'
  onClose: () => void
  onContinue: () => void
}

export default function AccountPrompt({ type, onClose, onContinue }: AccountPromptProps) {
  const isAccountPrompt = type === 'account'

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl p-6 max-w-md w-full mx-4 border border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {isAccountPrompt ? (
              <div className="w-12 h-12 bg-gaming-600 rounded-lg flex items-center justify-center">
                <LinkIcon className="w-6 h-6 text-white" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-accent-600 rounded-lg flex items-center justify-center">
                <WalletIcon className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-white">
                {isAccountPrompt ? 'Link Your Gaming Account' : 'Add Balance'}
              </h3>
              <p className="text-sm text-slate-400">
                {isAccountPrompt ? 'Required to join tournaments' : 'Insufficient funds'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          {isAccountPrompt ? (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-300">
                    You need to link your gaming account before joining tournaments. 
                    This helps us verify your identity and track your performance.
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Supported Platforms:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                  <div>• Steam</div>
                  <div>• Epic Games</div>
                  <div>• Battle.net</div>
                  <div>• Origin</div>
                  <div>• Xbox Live</div>
                  <div>• PlayStation</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-slate-300">
                    You don&apos;t have enough balance to join this tournament. 
                    Please add funds to your account to participate.
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Current Balance:</h4>
                <div className="text-2xl font-bold text-white">$0.00</div>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Payment Methods:</h4>
                <div className="text-sm text-slate-300 space-y-1">
                  <div>• Credit/Debit Cards</div>
                  <div>• PayPal</div>
                  <div>• Bank Transfer</div>
                  <div>• Crypto (Bitcoin, Ethereum)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${
              isAccountPrompt
                ? 'bg-gaming-600 hover:bg-gaming-700 text-white'
                : 'bg-accent-600 hover:bg-accent-700 text-white'
            }`}
          >
            {isAccountPrompt ? 'Link Account' : 'Add Funds'}
          </button>
        </div>
      </div>
    </div>
  )
}
