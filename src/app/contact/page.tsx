'use client'

import { useState } from 'react'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Contact Us
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Have questions about tournaments, need technical support, or want to partner with us? 
            We&apos;d love to hear from you.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg gap-16 lg:max-w-none lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Get in Touch
            </h2>
            <p className="mt-6 text-base leading-7 text-slate-300">
              Our team is here to help you with any questions or concerns. Choose the best way to reach us.
            </p>
            
            <dl className="mt-10 space-y-4 text-base leading-7 text-slate-300">
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Email</span>
                  <EnvelopeIcon className="h-7 w-6 text-gaming-500" aria-hidden="true" />
                </dt>
                <dd>
                  <a className="hover:text-white" href="mailto:support@bracketesports.com">
                    support@bracketesports.com
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Phone</span>
                  <PhoneIcon className="h-7 w-6 text-gaming-500" aria-hidden="true" />
                </dt>
                <dd>
                  <a className="hover:text-white" href="tel:+1 (555) 123-4567">
                    +1 (555) 123-4567
                  </a>
                </dd>
              </div>
              <div className="flex gap-x-4">
                <dt className="flex-none">
                  <span className="sr-only">Address</span>
                  <MapPinIcon className="h-7 w-6 text-gaming-500" aria-hidden="true" />
                </dt>
                <dd>
                  123 Gaming Street<br />
                  Esports City, EC 12345<br />
                  United States
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <h3 className="text-lg font-semibold text-white">Support Hours</h3>
              <div className="mt-4 text-sm text-slate-300">
                <p>Monday - Friday: 9:00 AM - 8:00 PM EST</p>
                <p>Saturday - Sunday: 10:00 AM - 6:00 PM EST</p>
                <p className="mt-2 text-gaming-500">Emergency support available 24/7</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-20">
            <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-semibold leading-6 text-white">
                    First name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="firstName"
                      id="first-name"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 bg-slate-800 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-gaming-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-semibold leading-6 text-white">
                    Last name
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      name="lastName"
                      id="last-name"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 bg-slate-800 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-gaming-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-semibold leading-6 text-white">
                    Email
                  </label>
                  <div className="mt-2.5">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 bg-slate-800 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-gaming-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="subject" className="block text-sm font-semibold leading-6 text-white">
                    Subject
                  </label>
                  <div className="mt-2.5">
                    <select
                      name="subject"
                      id="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 bg-slate-800 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-slate-600 focus:ring-2 focus:ring-inset focus:ring-gaming-500 sm:text-sm sm:leading-6"
                    >
                      <option value="">Select a subject</option>
                      <option value="tournament">Tournament Support</option>
                      <option value="technical">Technical Issues</option>
                      <option value="account">Account Problems</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="block text-sm font-semibold leading-6 text-white">
                    Message
                  </label>
                  <div className="mt-2.5">
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 bg-slate-800 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-gaming-500 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-gaming-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-gaming-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gaming-600"
                >
                  Send message
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
