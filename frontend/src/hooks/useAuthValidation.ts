'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export interface ValidationResult {
  isValid: boolean
  promptType?: 'login' | 'signup' | 'link-account'
  title?: string
  message?: string
}

export function useAuthValidation() {
  const { isAuthenticated, user } = useAuth()
  const [showPrompt, setShowPrompt] = useState(false)
  const [promptData, setPromptData] = useState<{
    title: string
    message: string
    actionType: 'login' | 'signup' | 'link-account'
  } | null>(null)

  const validateForAction = useCallback((action: string): ValidationResult => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      return {
        isValid: false,
        promptType: 'login',
        title: 'Authentication Required',
        message: `You need to be signed in to ${action}. Create an account or sign in to continue.`
      }
    }

    // Check if user has linked gaming accounts
    const hasLinkedAccounts = user.gamingAccounts && user.gamingAccounts.length > 0
    
    if (!hasLinkedAccounts) {
      return {
        isValid: false,
        promptType: 'link-account',
        title: 'Gaming Account Required',
        message: `To ${action}, you need to link at least one gaming account. This helps us verify your identity and match you with players of similar skill levels.`
      }
    }

    return { isValid: true }
  }, [isAuthenticated, user])

  const validateAndPrompt = useCallback((action: string): boolean => {
    const result = validateForAction(action)
    
    if (!result.isValid && result.promptType && result.title && result.message) {
      setPromptData({
        title: result.title,
        message: result.message,
        actionType: result.promptType
      })
      setShowPrompt(true)
      return false
    }
    
    return true
  }, [validateForAction])

  const closePrompt = useCallback(() => {
    setShowPrompt(false)
    setPromptData(null)
  }, [])

  return {
    validateAndPrompt,
    validateForAction,
    showPrompt,
    promptData,
    closePrompt,
    isAuthenticated,
    user
  }
}
