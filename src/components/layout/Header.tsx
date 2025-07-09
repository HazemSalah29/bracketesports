'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { t } from '@/lib/translations'
import { KEYS } from '@/constants/keys'
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  // Navigation items for authenticated users
  const authenticatedNavItems = [
    { name: t(KEYS.NAV.DASHBOARD), href: '/dashboard' },
    { name: t(KEYS.NAV.TOURNAMENTS), href: '/tournaments' },
    { name: t(KEYS.NAV.LEADERBOARD), href: '/leaderboard' },
    { name: t(KEYS.NAV.TEAMS), href: '/teams' },
  ]

  // Navigation items for unauthenticated users
  const publicNavItems = [
    { name: 'How It Works', href: '/how-it-works' },
    { name: t(KEYS.NAV.TOURNAMENTS), href: '/tournaments' },
    { name: t(KEYS.NAV.LEADERBOARD), href: '/leaderboard' },
  ]

  const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems

  return (
    <header className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gaming-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">BE</span>
              </div>
              <span className="text-white font-bold text-xl font-gaming">
                Bracket Esports
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-slate-300 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                {/* User Points */}
                <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-lg">
                  <span className="text-gaming-400 text-sm font-medium">
                    {user.totalPoints} pts
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 text-sm">
                    {user.rank?.tier || 'Bronze'} {user.rank?.division || 1}
                  </span>
                </div>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-gaming-500 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <Image 
                          src={user.avatar} 
                          alt={user.username}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <UserIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{user.username}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg border border-slate-700 z-50">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {t(KEYS.NAV.PROFILE)}
                        </Link>
                        <Link
                          href="/settings"
                          className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {t(KEYS.NAV.SETTINGS)}
                        </Link>
                        <hr className="my-1 border-slate-700" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center space-x-2"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4" />
                          <span>{t(KEYS.AUTH.LOGOUT)}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Auth Buttons for unauthenticated users */
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="text-slate-300 hover:text-white transition-colors duration-200"
                >
                  {t(KEYS.AUTH.LOGIN)}
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gaming-600 hover:bg-gaming-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  {t(KEYS.AUTH.REGISTER)}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-slate-800">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && user ? (
                <>
                  <hr className="my-3 border-slate-700" />
                  <div className="px-3 py-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gaming-500 rounded-full flex items-center justify-center">
                        {user.avatar ? (
                          <Image 
                            src={user.avatar} 
                            alt={user.username}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <UserIcon className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{user.username}</div>
                        <div className="text-slate-400 text-sm">
                          {user.totalPoints} pts • {user.rank?.tier || 'Bronze'} {user.rank?.division || 1}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(KEYS.NAV.PROFILE)}
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(KEYS.NAV.SETTINGS)}
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md"
                  >
                    {t(KEYS.AUTH.LOGOUT)}
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-3 border-slate-700" />
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(KEYS.AUTH.LOGIN)}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 bg-gaming-600 hover:bg-gaming-700 text-white rounded-md font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t(KEYS.AUTH.REGISTER)}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Click outside to close dropdowns */}
        {userMenuOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setUserMenuOpen(false)}
          />
        )}
      </div>
    </header>
  )
}