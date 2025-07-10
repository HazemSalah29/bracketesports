import { NewspaperIcon, DocumentTextIcon, CameraIcon, MicrophoneIcon } from '@heroicons/react/24/outline'

const pressReleases = [
  {
    date: 'January 15, 2025',
    title: 'Bracket Esports Launches Revolutionary Tournament Platform',
    summary: 'New platform integrates directly with Riot Games API for seamless tournament management and player verification.',
    category: 'Product Launch'
  },
  {
    date: 'December 10, 2024',
    title: 'Bracket Esports Secures Series A Funding',
    summary: 'Leading gaming VCs invest $10M to accelerate platform development and global expansion.',
    category: 'Funding'
  },
  {
    date: 'November 5, 2024',
    title: 'Partnership with Major Esports Organizations',
    summary: 'Strategic partnerships announced with top esports teams and tournament organizers.',
    category: 'Partnership'
  },
  {
    date: 'October 20, 2024',
    title: 'Beta Platform Reaches 10,000 Active Users',
    summary: 'Rapid user growth demonstrates strong demand for competitive gaming platform.',
    category: 'Milestone'
  }
]

const mediaKit = [
  {
    title: 'Company Logos',
    description: 'High-resolution logos in various formats',
    icon: CameraIcon,
    downloadLink: '#'
  },
  {
    title: 'Press Kit',
    description: 'Complete press materials and fact sheet',
    icon: DocumentTextIcon,
    downloadLink: '#'
  },
  {
    title: 'Leadership Photos',
    description: 'Executive team headshots and bios',
    icon: CameraIcon,
    downloadLink: '#'
  },
  {
    title: 'Product Screenshots',
    description: 'Platform interface and feature highlights',
    icon: CameraIcon,
    downloadLink: '#'
  }
]

const leadership = [
  {
    name: 'Alex Chen',
    title: 'CEO & Co-Founder',
    bio: 'Former professional esports player with 10+ years in competitive gaming. Previously led product at major gaming platform.',
    image: '/api/placeholder/150/150'
  },
  {
    name: 'Sarah Rodriguez',
    title: 'CTO & Co-Founder',
    bio: 'Ex-Google engineer with expertise in real-time systems and gaming infrastructure. Built scalable platforms for millions of users.',
    image: '/api/placeholder/150/150'
  },
  {
    name: 'Michael Park',
    title: 'Head of Esports',
    bio: 'Tournament organizer with experience managing major esports events. Deep connections in the competitive gaming community.',
    image: '/api/placeholder/150/150'
  }
]

const companyFacts = [
  { label: 'Founded', value: '2024' },
  { label: 'Headquarters', value: 'San Francisco, CA' },
  { label: 'Employees', value: '25+' },
  { label: 'Active Users', value: '10,000+' },
  { label: 'Tournaments Hosted', value: '500+' },
  { label: 'Games Supported', value: 'League of Legends, Valorant' }
]

export default function PressPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Press & Media
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            News, updates, and resources for journalists and media professionals covering Bracket Esports.
          </p>
        </div>

        {/* Contact Information */}
        <div className="mx-auto mt-16 max-w-2xl rounded-2xl bg-slate-800 p-8 text-center">
          <h2 className="text-xl font-semibold text-white mb-4">Media Inquiries</h2>
          <p className="text-slate-300 mb-6">For press inquiries, interview requests, or media resources:</p>
          <div className="space-y-2">
            <p className="text-gaming-400">
              <strong>Email:</strong> press@bracketesports.com
            </p>
            <p className="text-gaming-400">
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p className="text-gaming-400">
              <strong>Response Time:</strong> Within 24 hours
            </p>
          </div>
        </div>

        {/* Recent Press Releases */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Recent News</h2>
          <div className="space-y-6">
            {pressReleases.map((release, index) => (
              <div key={index} className="rounded-2xl bg-slate-800 p-6 hover:bg-slate-750 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-x-3 mb-3">
                      <span className="inline-flex items-center rounded-full bg-gaming-600 px-2 py-1 text-xs font-medium text-white">
                        {release.category}
                      </span>
                      <span className="text-sm text-slate-400">{release.date}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{release.title}</h3>
                    <p className="text-slate-300">{release.summary}</p>
                  </div>
                  <button className="ml-6 rounded-md bg-gaming-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gaming-500 transition-colors">
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Kit */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Media Kit</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {mediaKit.map((item) => (
              <div key={item.title} className="rounded-2xl bg-slate-800 p-6">
                <div className="flex items-center gap-x-3 mb-4">
                  <item.icon className="h-8 w-8 text-gaming-500" />
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                </div>
                <p className="text-slate-300 mb-6">{item.description}</p>
                <a
                  href={item.downloadLink}
                  className="inline-flex items-center rounded-md bg-gaming-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gaming-500 transition-colors"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Company Facts */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Company Facts</h2>
          <div className="rounded-2xl bg-slate-800 p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {companyFacts.map((fact) => (
                <div key={fact.label} className="text-center">
                  <div className="text-2xl font-bold text-gaming-500 mb-2">{fact.value}</div>
                  <div className="text-slate-300">{fact.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Leadership Team</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {leadership.map((person) => (
              <div key={person.name} className="rounded-2xl bg-slate-800 p-6 text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-slate-700 mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gaming-500">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{person.name}</h3>
                <p className="text-gaming-400 text-sm mb-4">{person.title}</p>
                <p className="text-slate-300 text-sm">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards and Recognition */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Awards & Recognition</h2>
          <div className="rounded-2xl bg-slate-800 p-8">
            <div className="text-center">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="p-6 rounded-lg bg-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-2">TechCrunch Startup Battlefield</h3>
                  <p className="text-slate-300 text-sm">Finalist - 2024</p>
                </div>
                <div className="p-6 rounded-lg bg-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-2">Gaming Innovation Award</h3>
                  <p className="text-slate-300 text-sm">Winner - 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mx-auto mt-20 max-w-2xl rounded-2xl bg-gradient-to-r from-gaming-600 to-gaming-700 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Want to Feature Our Story?</h3>
          <p className="mt-4 text-gaming-100">
            We&apos;re always happy to share our journey and insights about the esports industry.
          </p>
          <div className="mt-8">
            <a
              href="mailto:press@bracketesports.com"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gaming-700 shadow-sm hover:bg-slate-100 transition-colors"
            >
              Contact Press Team
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
