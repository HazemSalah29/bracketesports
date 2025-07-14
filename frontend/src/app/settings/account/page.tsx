'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  ShieldCheckIcon,
  KeyIcon,
  EnvelopeIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

const mockUser = {
  email: 'progamer@example.com',
  phone: '+1 (555) 123-4567',
  twoFactorEnabled: true,
  emailVerified: true,
  phoneVerified: false,
  lastPasswordChange: new Date('2024-11-15T10:00:00Z'),
  loginSessions: [
    {
      id: '1',
      device: 'Chrome on Windows',
      location: 'New York, NY',
      lastActive: new Date('2024-12-15T18:30:00Z'),
      current: true
    },
    {
      id: '2',
      device: 'Mobile App on iPhone',
      location: 'New York, NY',
      lastActive: new Date('2024-12-14T22:15:00Z'),
      current: false
    }
  ]
}

export default function AccountSettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeSection, setActiveSection] = useState<'overview' | 'password' | 'email' | 'phone' | 'sessions'>('overview')

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password change
    console.log('Changing password...')
  }

  const handleRevokeSession = (sessionId: string) => {
    console.log('Revoking session:', sessionId)
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/settings"
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Settings</span>
          </Link>
          <div className="flex items-center space-x-3 mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-white font-gaming">Account & Security</h1>
          </div>
          <p className="text-slate-400">
            Manage your account security and authentication settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection('overview')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'overview'
                    ? 'bg-gaming-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveSection('password')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'password'
                    ? 'bg-gaming-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Password
              </button>
              <button
                onClick={() => setActiveSection('email')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'email'
                    ? 'bg-gaming-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setActiveSection('phone')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'phone'
                    ? 'bg-gaming-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Phone
              </button>
              <button
                onClick={() => setActiveSection('sessions')}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'sessions'
                    ? 'bg-gaming-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Active Sessions
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Security Overview</h2>
                  
                  {/* Security Status Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                          <p className="text-sm text-slate-400">Add an extra layer of security</p>
                        </div>
                        <div className="flex items-center">
                          {mockUser.twoFactorEnabled ? (
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                          ) : (
                            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-white">Email Verification</h3>
                          <p className="text-sm text-slate-400">Verify your email address</p>
                        </div>
                        <div className="flex items-center">
                          {mockUser.emailVerified ? (
                            <CheckCircleIcon className="w-6 h-6 text-green-500" />
                          ) : (
                            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveSection('password')}
                      className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <KeyIcon className="w-5 h-5 text-gaming-500" />
                        <div className="text-left">
                          <div className="font-medium text-white">Change Password</div>
                          <div className="text-sm text-slate-400">
                            Last changed {mockUser.lastPasswordChange.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <ArrowLeftIcon className="w-5 h-5 text-slate-400 rotate-180" />
                    </button>

                    <button
                      onClick={() => setActiveSection('email')}
                      className="w-full flex items-center justify-between p-4 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <EnvelopeIcon className="w-5 h-5 text-blue-500" />
                        <div className="text-left">
                          <div className="font-medium text-white">Update Email</div>
                          <div className="text-sm text-slate-400">{mockUser.email}</div>
                        </div>
                      </div>
                      <ArrowLeftIcon className="w-5 h-5 text-slate-400 rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'password' && (
              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Change Password</h2>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showCurrentPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showNewPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                      Password must be at least 8 characters with a mix of letters, numbers, and symbols
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-gaming-500 focus:border-transparent pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-gaming-600 hover:bg-gaming-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Update Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('overview')}
                      className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'sessions' && (
              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Active Sessions</h2>
                
                <div className="space-y-4">
                  {mockUser.loginSessions.map((session) => (
                    <div key={session.id} className="bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-white">{session.device}</h3>
                            {session.current && (
                              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                                Current Session
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400">{session.location}</p>
                          <p className="text-xs text-slate-500">
                            Last active: {session.lastActive.toLocaleString()}
                          </p>
                        </div>
                        {!session.current && (
                          <button
                            onClick={() => handleRevokeSession(session.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-700">
                  <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Revoke All Other Sessions
                  </button>
                </div>
              </div>
            )}

            {/* Other sections can be implemented similarly */}
            {(activeSection === 'email' || activeSection === 'phone') && (
              <div className="bg-slate-800 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {activeSection === 'email' ? 'Email Settings' : 'Phone Settings'}
                </h2>
                <p className="text-slate-400">
                  This section is coming soon. You can manage your {activeSection} settings here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
