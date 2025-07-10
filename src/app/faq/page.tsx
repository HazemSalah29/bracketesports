'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const faqs = [
  {
    question: "How do I link my gaming accounts?",
    answer: "Go to your Profile page and click on 'Gaming Accounts'. For Riot accounts (Valorant/League of Legends), simply enter your Riot ID and tag - we'll automatically verify your account through the official Riot API."
  },
  {
    question: "What games are supported?",
    answer: "Currently, we support Valorant and League of Legends with full Riot Games API integration. We're working on adding support for more games in the future."
  },
  {
    question: "How does the ranking system work?",
    answer: "Our ranking system is based on tournament performance and points earned. Points are awarded based on your placement in tournaments, with higher-tier tournaments offering more points."
  },
  {
    question: "Are tournaments free to enter?",
    answer: "Most of our tournaments are free to enter! We occasionally host premium tournaments with entry fees that contribute to larger prize pools."
  },
  {
    question: "How are prizes distributed?",
    answer: "Prizes are distributed within 30 days of tournament completion. We support various payment methods and will contact winners directly with distribution details."
  },
  {
    question: "Can I create my own tournaments?",
    answer: "Yes! Users can create custom tournaments. Go to the Tournaments page and click 'Create Tournament' to set up your own competition."
  },
  {
    question: "What if I encounter technical issues?",
    answer: "Contact our support team through the Contact page or email support@bracketesports.com. We provide 24/7 emergency support for critical issues."
  },
  {
    question: "Is my gaming data secure?",
    answer: "Absolutely! We use official APIs and never store sensitive account credentials. All data is encrypted and handled in compliance with privacy regulations."
  },
  {
    question: "How do I report a player for cheating?",
    answer: "Use the report function during matches or contact our support team with evidence. We take fair play seriously and investigate all reports thoroughly."
  },
  {
    question: "Can I change my linked gaming accounts?",
    answer: "You can unlink accounts from your profile, but each gaming account can only be linked to one Bracket Esports account to prevent abuse."
  }
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Find answers to common questions about Bracket Esports. Can&apos;t find what you&apos;re looking for? 
            Contact our support team.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-none">
          <dl className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-800 rounded-lg">
                <dt>
                  <button
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-start justify-between text-left p-6 text-white hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <span className="text-base font-semibold leading-7">{faq.question}</span>
                    <span className="ml-6 flex h-7 items-center">
                      <ChevronDownIcon
                        className={`h-6 w-6 transform transition-transform ${
                          openItems.includes(index) ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </dt>
                {openItems.includes(index) && (
                  <dd className="px-6 pb-6">
                    <p className="text-base leading-7 text-slate-300">{faq.answer}</p>
                  </dd>
                )}
              </div>
            ))}
          </dl>

          <div className="mt-16 bg-slate-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
            <p className="text-slate-300 mb-6">
              Our support team is here to help you with any questions or issues you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md bg-gaming-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gaming-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gaming-600"
              >
                Contact Support
              </a>
              <a
                href="https://discord.gg/bracketesports"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-slate-600 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
              >
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
