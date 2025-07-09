'use client'

import { t } from '@/lib/translations'
import { KEYS } from '@/constants/keys'
import { 
  TrophyIcon, 
  UserGroupIcon, 
  StarIcon, 
  ChartBarIcon,
  BoltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 font-gaming">
            How It Works
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Welcome to the ultimate competitive gaming platform. Here&apos;s everything you need to know about earning points, climbing ranks, and dominating tournaments.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {/* Points System */}
          <section className="bg-slate-800 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gaming-600 rounded-lg flex items-center justify-center mr-4">
                <StarIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Points System</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">How to Earn Points</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• <strong>Tournament Victories:</strong> 100-500 points based on tournament size</li>
                  <li>• <strong>Top 3 Finishes:</strong> 25-150 points for podium placements</li>
                  <li>• <strong>Participation:</strong> 5-10 points for completing tournaments</li>
                  <li>• <strong>Team Achievements:</strong> Bonus points for team-based victories</li>
                  <li>• <strong>Special Achievements:</strong> Unlock unique challenges for extra points</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Point Values</h3>
                <div className="space-y-3">
                  <div className="flex justify-between bg-slate-700 p-3 rounded">
                    <span className="text-slate-300">Solo Tournament Win</span>
                    <span className="text-gaming-400 font-bold">+150 pts</span>
                  </div>
                  <div className="flex justify-between bg-slate-700 p-3 rounded">
                    <span className="text-slate-300">Team Tournament Win</span>
                    <span className="text-gaming-400 font-bold">+300 pts</span>
                  </div>
                  <div className="flex justify-between bg-slate-700 p-3 rounded">
                    <span className="text-slate-300">Runner-up Finish</span>
                    <span className="text-gaming-400 font-bold">+75 pts</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Ranking System */}
          <section className="bg-slate-800 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gaming-600 rounded-lg flex items-center justify-center mr-4">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Ranking System</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Beginner Ranks</h3>
                <div className="space-y-2">
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="font-medium text-white">Bronze</div>
                    <div className="text-sm text-slate-400">0 - 500 points</div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="font-medium text-white">Silver</div>
                    <div className="text-sm text-slate-400">500 - 1,000 points</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Intermediate Ranks</h3>
                <div className="space-y-2">
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="font-medium text-white">Gold</div>
                    <div className="text-sm text-slate-400">1,000 - 2,000 points</div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="font-medium text-white">Platinum</div>
                    <div className="text-sm text-slate-400">2,000 - 3,500 points</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Elite Ranks</h3>
                <div className="space-y-2">
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="font-medium text-white">Diamond</div>
                    <div className="text-sm text-slate-400">3,500 - 5,000 points</div>
                  </div>
                  <div className="bg-slate-700 p-3 rounded">
                    <div className="font-medium text-gaming-400">Master</div>
                    <div className="text-sm text-slate-400">5,000+ points</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tournament Types */}
          <section className="bg-slate-800 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gaming-600 rounded-lg flex items-center justify-center mr-4">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Tournament Types</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Solo Tournaments</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Individual competition</li>
                  <li>• 1v1 brackets or battle royale format</li>
                  <li>• Skill-based matchmaking</li>
                  <li>• Quick registration and entry</li>
                </ul>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Team Tournaments</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• Team-based competition (2-5 players)</li>
                  <li>• Coordinate with your squad</li>
                  <li>• Higher point rewards</li>
                  <li>• Team rank progression</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Team System */}
          <section className="bg-slate-800 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gaming-600 rounded-lg flex items-center justify-center mr-4">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Team System</h2>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Creating a Team</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Form teams with 2-5 players</li>
                    <li>• Choose a unique team name and tag</li>
                    <li>• Invite players via username or email</li>
                    <li>• Set team privacy (public/private)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Team Benefits</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li>• Shared team ranking and achievements</li>
                    <li>• Team-exclusive tournaments</li>
                    <li>• Bonus points for team victories</li>
                    <li>• Team statistics and analytics</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Achievements */}
          <section className="bg-slate-800 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gaming-600 rounded-lg flex items-center justify-center mr-4">
                <ShieldCheckIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Achievements & Rewards</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🏆</div>
                <h4 className="font-semibold text-white">Tournament Master</h4>
                <p className="text-sm text-slate-400">Win 10 tournaments</p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="font-semibold text-white">Lightning Fast</h4>
                <p className="text-sm text-slate-400">Win a tournament in under 30 minutes</p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">👑</div>
                <h4 className="font-semibold text-white">Champion</h4>
                <p className="text-sm text-slate-400">Reach Master rank</p>
              </div>
            </div>
          </section>

          {/* Rules & Fair Play */}
          <section className="bg-slate-800 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gaming-600 rounded-lg flex items-center justify-center mr-4">
                <BoltIcon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Rules & Fair Play</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tournament Rules</h3>
                <ul className="space-y-2 text-slate-300">
                  <li>• <strong>No cheating or exploiting:</strong> Any form of cheating will result in immediate disqualification</li>
                  <li>• <strong>Respectful behavior:</strong> Maintain sportsmanship and respect towards other players</li>
                  <li>• <strong>Account linking required:</strong> Must link your game account to participate</li>
                  <li>• <strong>One account per person:</strong> Multiple accounts are not allowed</li>
                  <li>• <strong>Tournament specific rules:</strong> Each tournament may have additional specific rules</li>
                </ul>
              </div>
              <div className="bg-red-900/20 border border-red-800 p-4 rounded-lg">
                <h4 className="font-semibold text-red-400 mb-2">Consequences of Rule Violations</h4>
                <ul className="text-red-300 text-sm space-y-1">
                  <li>• First offense: Warning and point deduction</li>
                  <li>• Second offense: Temporary suspension (7 days)</li>
                  <li>• Third offense: Permanent ban from platform</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section className="bg-gradient-to-r from-gaming-600 to-gaming-700 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gaming-100 mb-6">
              Join thousands of players competing in epic tournaments and climbing the ranks!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth/register"
                className="bg-white text-gaming-600 hover:bg-gaming-50 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Create Account
              </a>
              <a
                href="/tournaments"
                className="bg-gaming-500 hover:bg-gaming-400 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Browse Tournaments
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
