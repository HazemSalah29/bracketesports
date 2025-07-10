import { UserGroupIcon, ChatBubbleLeftRightIcon, GlobeAltIcon, TrophyIcon } from '@heroicons/react/24/outline'

const communityFeatures = [
  {
    name: 'Discord Server',
    description: 'Join our active Discord community with over 10,000 members',
    icon: ChatBubbleLeftRightIcon,
    href: 'https://discord.gg/bracketesports',
    stats: '10K+ Members',
    color: 'from-purple-600 to-purple-700'
  },
  {
    name: 'Forums',
    description: 'Discuss strategies, find teammates, and share gaming tips',
    icon: UserGroupIcon,
    href: '#forums',
    stats: '5K+ Posts',
    color: 'from-blue-600 to-blue-700'
  },
  {
    name: 'Global Leaderboards',
    description: 'See how you rank against players worldwide',
    icon: GlobeAltIcon,
    href: '/leaderboard',
    stats: '50+ Countries',
    color: 'from-green-600 to-green-700'
  },
  {
    name: 'Community Tournaments',
    description: 'Player-organized tournaments and events',
    icon: TrophyIcon,
    href: '/tournaments',
    stats: '100+ Events',
    color: 'from-gaming-600 to-gaming-700'
  }
]

const communityRules = [
  'Respect all community members',
  'No harassment, hate speech, or toxic behavior',
  'Keep discussions relevant to gaming and esports',
  'No spam, self-promotion without permission',
  'Follow platform-specific rules (Discord, forum guidelines)',
  'Report violations to moderators',
  'Have fun and help create a positive environment'
]

const featuredMembers = [
  {
    name: 'ProGamer_2024',
    title: 'Tournament Champion',
    game: 'League of Legends',
    achievements: '15 Tournament Wins'
  },
  {
    name: 'ValorantAce',
    title: 'Community Moderator',
    game: 'Valorant',
    achievements: '2,500+ Forum Posts'
  },
  {
    name: 'EsportsCoach',
    title: 'Strategy Expert',
    game: 'Multiple Games',
    achievements: '50+ Students Coached'
  }
]

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Gaming Community
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Connect with fellow gamers, share strategies, and be part of a thriving esports community.
          </p>
        </div>

        {/* Community Features */}
        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {communityFeatures.map((feature) => (
            <div key={feature.name} className="group relative overflow-hidden rounded-2xl bg-slate-800 p-8 hover:bg-slate-750 transition-colors">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
              <div className="relative">
                <div className="flex items-center gap-x-3">
                  <feature.icon className="h-8 w-8 text-gaming-500" />
                  <h3 className="text-xl font-semibold text-white">{feature.name}</h3>
                </div>
                <p className="mt-4 text-slate-300">{feature.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-medium text-gaming-400">{feature.stats}</span>
                  <a
                    href={feature.href}
                    className="rounded-md bg-gaming-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gaming-500 transition-colors"
                    {...(feature.href.startsWith('http') && {
                      target: '_blank',
                      rel: 'noopener noreferrer'
                    })}
                  >
                    Join Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Rules */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Community Guidelines</h2>
          <div className="rounded-2xl bg-slate-800 p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {communityRules.map((rule, index) => (
                <div key={index} className="flex items-start gap-x-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gaming-600 text-xs font-bold text-white">
                      {index + 1}
                    </div>
                  </div>
                  <p className="text-slate-300">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Community Members */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Featured Community Members</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredMembers.map((member) => (
              <div key={member.name} className="rounded-2xl bg-slate-800 p-6 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gaming-600 flex items-center justify-center mb-4">
                  <UserGroupIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                <p className="text-gaming-400 text-sm mt-1">{member.title}</p>
                <p className="text-slate-300 text-sm mt-2">{member.game}</p>
                <p className="text-slate-400 text-xs mt-3">{member.achievements}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mx-auto mt-20 max-w-2xl rounded-2xl bg-gradient-to-r from-gaming-600 to-gaming-700 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Ready to Join Our Community?</h3>
          <p className="mt-4 text-gaming-100">
            Connect with thousands of gamers, participate in discussions, and stay updated on the latest tournaments.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="https://discord.gg/bracketesports"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gaming-700 shadow-sm hover:bg-slate-100 transition-colors"
            >
              Join Discord
            </a>
            <a
              href="/auth/register"
              className="rounded-md border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white hover:text-gaming-700 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
