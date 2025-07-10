'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  UserIcon,
  ShieldCheckIcon,
  BellIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  LinkIcon,
  CreditCardIcon,
  ChevronRightIcon,
  CogIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { useTranslation } from '@/lib/translations'
import { KEYS } from '@/constants/keys'

export default function SettingsPage() {
  const { t } = useTranslation()

  const settingsCategories = [
    {
      id: 'profile',
      name: t('settings.profile_settings'),
      description: 'Manage your public profile and personal information',
      icon: UserIcon,
      href: '/profile',
      color: 'text-gaming-500'
    },
    {
      id: 'account',
      name: t('settings.account_security'),
      description: 'Password, email, two-factor authentication',
      icon: ShieldCheckIcon,
      href: '/settings/account',
      color: 'text-red-500'
    },
    {
      id: 'notifications',
      name: t('settings.notifications'),
      description: 'Email alerts, push notifications, tournament updates',
      icon: BellIcon,
      href: '/settings/notifications',
      color: 'text-blue-500'
    },
    {
      id: 'gaming',
      name: t('profile.gaming_accounts'),
      description: 'Link and manage your gaming platform accounts',
      icon: LinkIcon,
      href: '/settings/gaming-accounts',
      color: 'text-purple-500'
    },
    {
      id: 'coins',
      name: 'Bracket Coins',
      description: 'Manage your coin balance, purchase history, and settings',
      icon: CurrencyDollarIcon,
      href: '/coins',
      color: 'text-yellow-500'
    },
    {
      id: 'preferences',
      name: t('settings.preferences'),
      description: 'Theme, language, and display settings',
      icon: PaintBrushIcon,
      href: '/settings/preferences',
      color: 'text-accent-500'
    },
    {
      id: 'privacy',
      name: t('settings.privacy_data'),
      description: 'Control your privacy settings and data usage',
      icon: GlobeAltIcon,
      href: '/settings/privacy',
      color: 'text-yellow-500'
    },
    {
      id: 'billing',
      name: t('settings.billing_subscriptions'),
      description: 'Manage premium features and team subscriptions',
      icon: CreditCardIcon,
      href: '/settings/billing',
      color: 'text-green-500'
    }
  ]
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <CogIcon className="w-8 h-8 text-gaming-500" />
            <h1 className="text-3xl font-bold text-white font-gaming">{t('settings.settings')}</h1>
          </div>
          <p className="text-slate-400">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Settings Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsCategories.map((category) => {
            const IconComponent = category.icon
            return (
              <Link
                key={category.id}
                href={category.href}
                className="bg-slate-800 rounded-xl p-6 hover:bg-slate-750 transition-colors group border border-slate-700 hover:border-slate-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-slate-700 group-hover:bg-slate-600 transition-colors`}>
                      <IconComponent className={`w-6 h-6 ${category.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gaming-400 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-slate-500 group-hover:text-slate-400 transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/profile"
              className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <UserIcon className="w-5 h-5 text-gaming-500" />
              <span className="text-white">Edit Profile</span>
            </Link>
            <Link
              href="/settings/account"
              className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <ShieldCheckIcon className="w-5 h-5 text-red-500" />
              <span className="text-white">Change Password</span>
            </Link>
            <Link
              href="/settings/gaming-accounts"
              className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <LinkIcon className="w-5 h-5 text-purple-500" />
              <span className="text-white">Link Game Account</span>
            </Link>
            <Link
              href="/coins"
              className="flex items-center space-x-3 p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              <CurrencyDollarIcon className="w-5 h-5 text-yellow-500" />
              <span className="text-white">Buy Bracket Coins</span>
            </Link>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-8 bg-gradient-to-r from-gaming-600/10 to-accent-600/10 border border-gaming-500/20 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Need Help?</h2>
          <p className="text-slate-400 mb-4">
            If you&apos;re having trouble with your account or need assistance, our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/support"
              className="bg-gaming-600 hover:bg-gaming-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              Contact Support
            </Link>
            <Link
              href="/help"
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
