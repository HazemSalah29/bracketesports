'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PlayIcon, TrophyIcon, UserGroupIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

const stats = [
  { id: 1, name: 'Active Players', value: '15K+', icon: UserGroupIcon },
  { id: 2, name: 'Tournaments Hosted', value: '2.5K+', icon: TrophyIcon },
  { id: 3, name: 'Prize Money Distributed', value: '$2.8M+', icon: CurrencyDollarIcon },
  { id: 4, name: 'Games Supported', value: '25+', icon: PlayIcon },
]

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden py-24 sm:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90" />
      
      {/* Hero content */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-gaming">
              Compete. Win. <span className="text-gaming-500">Earn.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Join the ultimate esports tournament platform. Connect your gaming accounts, 
              enter tournaments with real entry fees, and compete for massive prize pools. 
              Your skills, your rewards.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth/register"
                className="bg-gaming-600 hover:bg-gaming-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 neon-glow hover:scale-105"
              >
                Start Competing
              </Link>
              <Link
                href="/tournaments"
                className="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition-colors"
              >
                View Tournaments <span aria-hidden="true">→</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats section */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4 lg:gap-y-16">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-16"
              >
                <dt className="text-base font-semibold leading-7 text-slate-300">
                  <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-lg bg-gaming-600 gaming-card">
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {stat.name}
                </dt>
                <dd className="mt-2 text-3xl font-bold leading-9 tracking-tight text-white font-gaming">
                  {stat.value}
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-gaming-500 to-accent-500 opacity-20"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  )
}
