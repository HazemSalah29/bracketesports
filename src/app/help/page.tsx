import { QuestionMarkCircleIcon, ChatBubbleLeftRightIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline'

const helpCategories = [
  {
    name: 'Getting Started',
    description: 'Learn the basics of using Bracket Esports',
    icon: DocumentTextIcon,
    articles: [
      'How to create an account',
      'Connecting your gaming accounts',
      'Finding and joining tournaments',
      'Understanding the ranking system'
    ]
  },
  {
    name: 'Tournament Guide',
    description: 'Everything about participating in tournaments',
    icon: QuestionMarkCircleIcon,
    articles: [
      'Tournament formats and rules',
      'How to register for tournaments',
      'Match scheduling and reporting',
      'Prize distribution and payments'
    ]
  },
  {
    name: 'Account & Settings',
    description: 'Manage your profile and preferences',
    icon: UserGroupIcon,
    articles: [
      'Profile customization',
      'Privacy settings',
      'Notification preferences',
      'Account verification'
    ]
  },
  {
    name: 'Technical Support',
    description: 'Troubleshooting and technical issues',
    icon: ChatBubbleLeftRightIcon,
    articles: [
      'Common connection issues',
      'API integration problems',
      'Browser compatibility',
      'Performance optimization'
    ]
  }
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Help Center
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Find answers to common questions and get the help you need to make the most of Bracket Esports.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mt-16 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full rounded-lg border-0 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-gaming-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Help Categories */}
        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {helpCategories.map((category) => (
            <div key={category.name} className="rounded-2xl bg-slate-800 p-8">
              <div className="flex items-center gap-x-3">
                <category.icon className="h-8 w-8 text-gaming-500" />
                <h3 className="text-xl font-semibold text-white">{category.name}</h3>
              </div>
              <p className="mt-4 text-slate-300">{category.description}</p>
              <ul className="mt-6 space-y-3">
                {category.articles.map((article) => (
                  <li key={article}>
                    <a
                      href="#"
                      className="flex items-center text-sm text-slate-300 hover:text-gaming-500 transition-colors"
                    >
                      <span className="mr-2">•</span>
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mx-auto mt-20 max-w-2xl rounded-2xl bg-gradient-to-r from-gaming-600 to-gaming-700 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Still need help?</h3>
          <p className="mt-4 text-gaming-100">
            Our support team is here to help you with any questions or issues.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="/contact"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gaming-700 shadow-sm hover:bg-slate-100 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="https://discord.gg/bracketesports"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white hover:text-gaming-700 transition-colors"
            >
              Join Discord
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
