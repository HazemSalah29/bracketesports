'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  TrophyIcon,
  ChevronDownIcon,
  CogIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Tournaments', href: '/tournaments' },
  { name: 'Teams', href: '/teams' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Leaderboard', href: '/leaderboard' },
  { name: 'How It Works', href: '/how-it-works' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Mock user state - in a real app, this would come from your auth context
  const isAuthenticated = false; // Change to true to see authenticated state
  const user = {
    username: 'ProGamer2024',
    avatar: null,
    balance: 150.75
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center space-x-2">
            <TrophyIcon className="h-8 w-8 text-gaming-500" />
            <span className="font-gaming font-bold text-xl text-white">
              Bracket Esports
            </span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-300"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold leading-6 text-slate-300 hover:text-gaming-500 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center justify-center">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-300">
                Balance: <span className="font-semibold text-gaming-500">${user.balance.toFixed(2)}</span>
              </div>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-gaming-600 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">{user.username}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-lg shadow-xl border border-slate-700 py-1 z-50">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <UserIcon className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      href="/wallet"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <CreditCardIcon className="w-4 h-4" />
                      Wallet
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <TrophyIcon className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <CogIcon className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className="my-1 border-slate-700" />
                    <button
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 w-full text-left"
                      onClick={() => {
                        setUserMenuOpen(false);
                        // Handle logout
                      }}
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                className="bg-gaming-600 hover:bg-gaming-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors neon-glow"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-slate-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-slate-700">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="-m-1.5 p-1.5 flex items-center space-x-2"
              >
                <TrophyIcon className="h-8 w-8 text-gaming-500" />
                <span className="font-gaming font-bold text-xl text-white">
                  Bracket Esports
                </span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-slate-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-slate-700">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-slate-300 hover:bg-slate-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6 space-y-2">
                  <Link
                    href="/auth/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-slate-300 hover:bg-slate-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white bg-gaming-600 hover:bg-gaming-700 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
