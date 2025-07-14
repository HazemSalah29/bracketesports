import { UserGroupIcon, TrophyIcon, GlobeAltIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const partnerTypes = [
  {
    title: 'Tournament Organizers',
    description: 'Partner with us to host official tournaments on our platform',
    icon: TrophyIcon,
    benefits: [
      'Access to our player base of 10,000+ active users',
      'Integrated tournament management tools',
      'Real-time match tracking and statistics',
      'Revenue sharing opportunities'
    ],
    cta: 'Become a TO Partner'
  },
  {
    title: 'Esports Teams',
    description: 'Collaborate with professional and amateur esports organizations',
    icon: UserGroupIcon,
    benefits: [
      'Team management and roster tools',
      'Scrim scheduling and practice matches',
      'Performance analytics and insights',
      'Sponsorship integration opportunities'
    ],
    cta: 'Join as Team Partner'
  },
  {
    title: 'Gaming Hardware',
    description: 'Partner with hardware manufacturers and gaming peripheral brands',
    icon: ChartBarIcon,
    benefits: [
      'Product showcasing in tournaments',
      'Sponsored prize pools and giveaways',
      'Influencer and pro player partnerships',
      'Performance data and user insights'
    ],
    cta: 'Explore Hardware Partnership'
  },
  {
    title: 'Content Creators',
    description: 'Work with streamers, YouTubers, and gaming content creators',
    icon: GlobeAltIcon,
    benefits: [
      'Custom tournament hosting capabilities',
      'Viewer engagement tools and features',
      'Revenue sharing from tournaments',
      'Cross-platform promotion opportunities'
    ],
    cta: 'Creator Partnership Program'
  }
]

const currentPartners = [
  {
    name: 'Riot Games',
    type: 'Game Developer',
    description: 'Official API integration for League of Legends and Valorant tournaments',
    logo: 'RG'
  },
  {
    name: 'Team Liquid',
    type: 'Esports Organization',
    description: 'Professional team partnership for tournament hosting and player development',
    logo: 'TL'
  },
  {
    name: 'HyperX',
    type: 'Gaming Hardware',
    description: 'Official peripheral sponsor for major tournaments',
    logo: 'HX'
  },
  {
    name: 'StreamLabs',
    type: 'Content Platform',
    description: 'Integration for content creator tournament streaming',
    logo: 'SL'
  }
]

const partnershipBenefits = [
  'Access to our growing player community',
  'Co-marketing opportunities and cross-promotion',
  'Revenue sharing from tournaments and events',
  'Custom integration and API access',
  'Dedicated partnership manager support',
  'Performance analytics and insights',
  'Early access to new features and platforms',
  'Joint content creation opportunities'
]

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Partner With Us
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Join forces with Bracket Esports to create amazing experiences for the gaming community.
          </p>
        </div>

        {/* Partnership Types */}
        <div className="mx-auto mt-20 max-w-6xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Partnership Opportunities</h2>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {partnerTypes.map((partner) => (
              <div key={partner.title} className="rounded-2xl bg-slate-800 p-8">
                <div className="flex items-center gap-x-3 mb-6">
                  <partner.icon className="h-8 w-8 text-gaming-500" />
                  <h3 className="text-xl font-semibold text-white">{partner.title}</h3>
                </div>
                <p className="text-slate-300 mb-6">{partner.description}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-3">Benefits:</h4>
                  <ul className="space-y-2">
                    {partner.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-x-2 text-slate-300">
                        <span className="text-gaming-500 mt-1">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className="w-full rounded-md bg-gaming-600 px-4 py-3 text-sm font-semibold text-white hover:bg-gaming-500 transition-colors">
                  {partner.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Current Partners */}
        <div className="mx-auto mt-20 max-w-6xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Current Partners</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {currentPartners.map((partner) => (
              <div key={partner.name} className="rounded-2xl bg-slate-800 p-6 text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-gaming-600 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-lg">{partner.logo}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{partner.name}</h3>
                <p className="text-gaming-400 text-sm mb-3">{partner.type}</p>
                <p className="text-slate-300 text-sm">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Benefits */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Partner With Us?</h2>
          <div className="rounded-2xl bg-slate-800 p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {partnershipBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-gaming-500" />
                  </div>
                  <p className="text-slate-300">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partnership Process */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Partnership Process</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              { step: '1', title: 'Initial Contact', desc: 'Reach out to discuss partnership opportunities' },
              { step: '2', title: 'Proposal Review', desc: 'We review your proposal and partnership goals' },
              { step: '3', title: 'Agreement', desc: 'Finalize partnership terms and agreements' },
              { step: '4', title: 'Launch', desc: 'Begin collaboration and joint initiatives' }
            ].map((phase) => (
              <div key={phase.step} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-gaming-600 flex items-center justify-center text-white font-bold text-lg mb-4">
                  {phase.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{phase.title}</h3>
                <p className="text-sm text-slate-400">{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Success Stories</h2>
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-800 p-8">
              <div className="flex items-start gap-x-4">
                <div className="h-12 w-12 rounded-full bg-gaming-600 flex items-center justify-center text-white font-bold">
                  TL
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Team Liquid Partnership</h3>
                  <p className="text-slate-300 mb-4">
                    &quot;Working with Bracket Esports has allowed us to engage with our community in new ways. 
                    The platform&apos;s tournament tools are incredibly robust and user-friendly.&quot;
                  </p>
                  <p className="text-gaming-400 text-sm">- Steve Arhancet, CEO, Team Liquid</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-2xl bg-slate-800 p-8">
              <div className="flex items-start gap-x-4">
                <div className="h-12 w-12 rounded-full bg-gaming-600 flex items-center justify-center text-white font-bold">
                  HX
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">HyperX Sponsorship Success</h3>
                  <p className="text-slate-300 mb-4">
                    &quot;Our partnership with Bracket Esports has increased brand visibility and engagement 
                    among competitive gamers by 300% in just six months.&quot;
                  </p>
                  <p className="text-gaming-400 text-sm">- Marketing Director, HyperX</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mx-auto mt-20 max-w-2xl rounded-2xl bg-gradient-to-r from-gaming-600 to-gaming-700 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Ready to Partner?</h3>
          <p className="mt-4 text-gaming-100">
            Let&apos;s discuss how we can work together to create amazing experiences for the gaming community.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <a
              href="mailto:partnerships@bracketesports.com"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gaming-700 shadow-sm hover:bg-slate-100 transition-colors"
            >
              Email Partnerships Team
            </a>
            <a
              href="/contact"
              className="rounded-md border border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white hover:text-gaming-700 transition-colors"
            >
              Contact Form
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
