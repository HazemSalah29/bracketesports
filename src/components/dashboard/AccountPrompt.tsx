'use client'

import { 
  XMarkIcon, 
  LinkIcon, 
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface AccountPromptProps {
  type: 'account'
  onClose: () => void
  onContinue: () => void
}

export default function AccountPrompt({ type, onClose, onContinue }: AccountPromptProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg max-w-md w-full p-6 border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gaming-600 rounded-lg flex items-center justify-center">
              <LinkIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white">Link Game Account</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-6">
          <div className="flex space-x-3">
            <ExclamationTriangleIcon className="w-5 h-5 text-gaming-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-slate-300">
                You need to link your game account to join tournaments. This helps us verify your identity and track your performance.
              </p>
            </div>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Supported Platforms:</h4>
            <div className="text-sm text-slate-300 space-y-1">
              <div>• Steam</div>
              <div>• Epic Games</div>
              <div>• Riot Games</div>
              <div>• Battle.net</div>
            </div>
          </div>
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
            className="flex-1 px-4 py-2 rounded-lg font-semibold transition-colors bg-gaming-600 hover:bg-gaming-700 text-white"
          >
            Link Account
          </button>
        </div>
      </div>
    </div>
  )
}
