'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { t } from '@/lib/translations'
import { KEYS } from '@/constants/keys'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { register } = useAuth()
  
  // Always redirect to home page after successful signup
  const redirectPath = '/'

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (formData.username.length > 30) {
      newErrors.username = 'Username must be 30 characters or less'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (formData.password.length > 128) {
      newErrors.password = 'Password must be 128 characters or less'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setErrors({}) // Clear any previous errors

    try {
      const success = await register(formData)
      
      if (success) {
        // Clear form data for security
        setFormData({
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        })
        
        // Redirect to home page
        router.push('/')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      
      // Check if the error indicates user already exists
      const errorMessage = error.message || 'Registration failed. Please try again.'
      const isUserExists = errorMessage.toLowerCase().includes('user already exists') || 
                          errorMessage.toLowerCase().includes('email already exists') ||
                          errorMessage.toLowerCase().includes('username already exists') ||
                          errorMessage.toLowerCase().includes('already registered')
      
      if (isUserExists) {
        setErrors({ 
          general: `This ${errorMessage.toLowerCase().includes('email') ? 'email' : 'username'} is already registered.`,
          userExists: 'true' // Special flag for UI
        })
      } else {
        setErrors({ general: errorMessage })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-3 text-center text-3xl font-bold text-white font-gaming">
            {t(KEYS.AUTH.CREATE_ACCOUNT)}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-300">
            Or{' '}
            <a
              href="/auth/login"
              className="font-medium text-gaming-500 hover:text-gaming-400"
            >
              {t(KEYS.AUTH.SIGN_IN_EXISTING)}
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="off">
          {errors.general && (
            <div className={`border px-4 py-3 rounded-md ${
              errors.userExists 
                ? 'bg-yellow-900/50 border-yellow-500 text-yellow-200' 
                : 'bg-red-900/50 border-red-500 text-red-200'
            }`}>
              <p>{errors.general}</p>
              {errors.userExists && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => router.push('/auth/login')}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-900 bg-yellow-200 hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Sign In Instead
                  </button>
                </div>
              )}
            </div>
          )}
          <input type="hidden" name="prevent-autofill" value="" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-slate-300"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-600 placeholder-slate-400 text-white bg-slate-800 rounded-md focus:outline-none focus:ring-gaming-500 focus:border-gaming-500 sm:text-sm"
                  placeholder="First name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-slate-300"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-600 placeholder-slate-400 text-white bg-slate-800 rounded-md focus:outline-none focus:ring-gaming-500 focus:border-gaming-500 sm:text-sm"
                  placeholder="Last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-300"
              >
                {t(KEYS.AUTH.USERNAME)}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-600 placeholder-slate-400 text-white bg-slate-800 rounded-md focus:outline-none focus:ring-gaming-500 focus:border-gaming-500 sm:text-sm"
                placeholder="Username (letters, numbers, underscore only)"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-300"
              >
                {t(KEYS.AUTH.EMAIL)}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-600 placeholder-slate-400 text-white bg-slate-800 rounded-md focus:outline-none focus:ring-gaming-500 focus:border-gaming-500 sm:text-sm"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-300"
              >
                {t(KEYS.AUTH.PASSWORD)}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-600 placeholder-slate-400 text-white bg-slate-800 rounded-md focus:outline-none focus:ring-gaming-500 focus:border-gaming-500 sm:text-sm"
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-300"
              >
                {t(KEYS.AUTH.CONFIRM_PASSWORD)}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-600 placeholder-slate-400 text-white bg-slate-800 rounded-md focus:outline-none focus:ring-gaming-500 focus:border-gaming-500 sm:text-sm"
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gaming-600 hover:bg-gaming-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gaming-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t(KEYS.AUTH.CREATING_ACCOUNT) : t(KEYS.AUTH.CREATE_ACCOUNT)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
