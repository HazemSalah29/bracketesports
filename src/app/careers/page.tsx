import { BriefcaseIcon, CodeBracketIcon, PaintBrushIcon, MegaphoneIcon } from '@heroicons/react/24/outline'

const jobOpenings = [
  {
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    icon: CodeBracketIcon,
    description: 'Build and maintain our tournament platform using React, Node.js, and modern web technologies.',
    requirements: [
      '5+ years of full-stack development experience',
      'Proficiency in React, TypeScript, and Node.js',
      'Experience with database design and optimization',
      'Knowledge of real-time systems and WebSocket implementation'
    ]
  },
  {
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    icon: PaintBrushIcon,
    description: 'Design intuitive and engaging user experiences for our gaming platform.',
    requirements: [
      '3+ years of UI/UX design experience',
      'Proficiency in Figma, Sketch, or similar design tools',
      'Experience designing for gaming or esports platforms',
      'Strong understanding of user-centered design principles'
    ]
  },
  {
    title: 'Community Manager',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    icon: MegaphoneIcon,
    description: 'Engage with our gaming community and manage social media presence.',
    requirements: [
      '2+ years of community management experience',
      'Deep understanding of gaming and esports culture',
      'Excellent written and verbal communication skills',
      'Experience with Discord, Twitter, and other social platforms'
    ]
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    icon: CodeBracketIcon,
    description: 'Maintain and scale our infrastructure to support millions of gaming sessions.',
    requirements: [
      '4+ years of DevOps/Infrastructure experience',
      'Experience with AWS, Docker, and Kubernetes',
      'Knowledge of CI/CD pipelines and monitoring tools',
      'Experience with high-availability systems'
    ]
  }
]

const benefits = [
  'Competitive salary and equity package',
  'Comprehensive health, dental, and vision insurance',
  'Flexible remote work options',
  'Unlimited PTO policy',
  'Professional development budget',
  'Latest gaming equipment and hardware',
  'Team gaming sessions and tournaments',
  'Conference and training opportunities'
]

const values = [
  {
    title: 'Passion for Gaming',
    description: 'We love what we do and are passionate about creating the best gaming experiences.'
  },
  {
    title: 'Innovation First',
    description: 'We constantly push boundaries and embrace new technologies to stay ahead.'
  },
  {
    title: 'Community Focus',
    description: 'Our community is at the heart of everything we build and every decision we make.'
  },
  {
    title: 'Work-Life Balance',
    description: 'We believe great work comes from happy, well-rested, and fulfilled team members.'
  }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Join Our Team
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Help us build the future of esports. Work with passionate gamers and innovative technology.
          </p>
        </div>

        {/* Company Values */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl bg-slate-800 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-slate-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Openings */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Open Positions</h2>
          <div className="space-y-8">
            {jobOpenings.map((job) => (
              <div key={job.title} className="rounded-2xl bg-slate-800 p-8">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-x-4">
                    <job.icon className="h-8 w-8 text-gaming-500" />
                    <div>
                      <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                      <div className="flex items-center gap-x-4 mt-2 text-sm text-slate-400">
                        <span>{job.department}</span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.type}</span>
                      </div>
                    </div>
                  </div>
                  <button className="rounded-md bg-gaming-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gaming-500 transition-colors">
                    Apply Now
                  </button>
                </div>
                
                <p className="mt-6 text-slate-300">{job.description}</p>
                
                <div className="mt-6">
                  <h4 className="font-semibold text-white mb-3">Requirements:</h4>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-x-2 text-slate-300">
                        <span className="text-gaming-500 mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Benefits & Perks</h2>
          <div className="rounded-2xl bg-slate-800 p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {benefits.map((benefit, index) => (
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

        {/* Application Process */}
        <div className="mx-auto mt-20 max-w-4xl">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How We Hire</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              { step: '1', title: 'Apply', desc: 'Submit your application and resume' },
              { step: '2', title: 'Screen', desc: 'Initial phone or video screening' },
              { step: '3', title: 'Interview', desc: 'Technical and culture fit interviews' },
              { step: '4', title: 'Offer', desc: 'Reference check and job offer' }
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

        {/* Call to Action */}
        <div className="mx-auto mt-20 max-w-2xl rounded-2xl bg-gradient-to-r from-gaming-600 to-gaming-700 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Don&apos;t see a perfect fit?</h3>
          <p className="mt-4 text-gaming-100">
            We&apos;re always looking for talented individuals who share our passion for gaming and technology.
          </p>
          <div className="mt-8">
            <a
              href="mailto:careers@bracketesports.com"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gaming-700 shadow-sm hover:bg-slate-100 transition-colors"
            >
              Send Us Your Resume
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
