'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { 
  ExclamationTriangleIcon,
  UserIcon,
  LinkIcon
} from '@heroicons/react/24/outline'

interface AuthPromptProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  actionType: 'login' | 'signup' | 'link-account'
}

export default function AuthPrompt({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  actionType 
}: AuthPromptProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  if (!isOpen) return null

  const handlePrimaryAction = () => {
    onClose()
    if (actionType === 'login') {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`)
    } else if (actionType === 'signup') {
      router.push(`/auth/register?redirect=${encodeURIComponent(window.location.pathname)}`)
    } else if (actionType === 'link-account') {
      router.push('/profile?tab=accounts')
    }
  }

  const getIcon = () => {
    switch (actionType) {
      case 'login':
      case 'signup':
        return <UserIcon className="w-8 h-8 text-gaming-500" />
      case 'link-account':
        return <LinkIcon className="w-8 h-8 text-gaming-500" />
      default:
        return <ExclamationTriangleIcon className="w-8 h-8 text-yellow-500" />
    }
  }

  const getPrimaryButtonText = () => {
    switch (actionType) {
      case 'login':
        return 'Sign In'
      case 'signup':
        return 'Create Account'
      case 'link-account':
        return 'Link Gaming Account'
      default:
        return 'Continue'
    }
  }

  const getSecondaryAction = () => {
    if (actionType === 'login') {
      return (
        <button
          onClick={() => {
            onClose()
            router.push(`/auth/register?redirect=${encodeURIComponent(window.location.pathname)}`)
          }}
          className="text-gaming-500 hover:text-gaming-400 text-sm font-medium"
        >
          Don&apos;t have an account? Sign up
        </button>
      )
    } else if (actionType === 'signup') {
      return (
        <button
          onClick={() => {
            onClose()
            router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`)
          }}
          className="text-gaming-500 hover:text-gaming-400 text-sm font-medium"
        >
          Already have an account? Sign in
        </button>
      )
    }
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-md w-full p-6 border border-slate-700">
        <div className="flex items-center mb-4">
          {getIcon()}
          <h3 className="text-lg font-semibold text-white ml-3">{title}</h3>
        </div>
        
        <p className="text-slate-300 mb-6 leading-relaxed">
          {message}
        </p>
        
        <div className="flex flex-col space-y-3">
          <button
            onClick={handlePrimaryAction}
            className="w-full bg-gaming-600 hover:bg-gaming-700 text-white px-4 py-3 rounded-md font-medium transition-colors"
          >
            {getPrimaryButtonText()}
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-3 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
          
          {getSecondaryAction() && (
            <div className="text-center pt-2">
              {getSecondaryAction()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
