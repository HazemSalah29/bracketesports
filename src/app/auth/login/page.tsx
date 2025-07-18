'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { t } from '@/lib/translations'
import { KEYS } from '@/constants/keys'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  
  // Redirect to dashboard by default, but allow override for protected routes
  const redirectPath = searchParams.get('redirect') || '/dashboard'

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setErrors({}) // Clear any previous errors

    try {
      const success = await login(formData.email, formData.password)
      
      if (success) {
        // Clear form data for security
        setFormData({
          email: '',
          password: ''
        })
        
        // Redirect to intended page
        router.push(redirectPath)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setErrors({ general: error.message || 'Login failed. Please check your credentials.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white font-gaming">
            {t(KEYS.AUTH.LOGIN)}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-300">
            Or{' '}
            <a href="/auth/register" className="font-medium text-gaming-500 hover:text-gaming-400">
              {t(KEYS.AUTH.CREATE_ACCOUNT)}
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} autoComplete="off">
          {errors.general && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-md">
              {errors.general}
            </div>
          )}
          <input type="hidden" name="prevent-autofill" value="" />
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                {t(KEYS.AUTH.EMAIL)}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-600 placeholder-slate-400 text-white bg-slate-800 rounded-md focus:outline-none focus:ring-gaming-500 focus:border-gaming-500 sm:text-sm"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                {t(KEYS.AUTH.PASSWORD)}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-600 placeholder-slate-400 text-white bg-slate-800 rounded-md focus:outline-none focus:ring-gaming-500 focus:border-gaming-500 sm:text-sm"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gaming-600 hover:bg-gaming-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gaming-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t(KEYS.AUTH.SIGNING_IN) : t(KEYS.AUTH.LOGIN)}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
