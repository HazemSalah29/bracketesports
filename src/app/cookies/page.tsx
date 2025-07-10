export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Cookie Policy
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            How we use cookies to improve your experience on Bracket Esports
          </p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">What Are Cookies?</h2>
              <p className="text-slate-300 leading-7">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and understanding how you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div className="rounded-lg bg-slate-800 p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Essential Cookies</h3>
                  <p className="text-slate-300 mb-3">
                    These cookies are necessary for the website to function properly. They enable core functionality like:
                  </p>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>User authentication and login sessions</li>
                    <li>Shopping cart functionality</li>
                    <li>Security features</li>
                    <li>Basic website operations</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-800 p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Performance Cookies</h3>
                  <p className="text-slate-300 mb-3">
                    These cookies help us understand how visitors interact with our website by collecting anonymous information:
                  </p>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Page visit statistics</li>
                    <li>Time spent on pages</li>
                    <li>Traffic sources</li>
                    <li>Error reporting</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-800 p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Functional Cookies</h3>
                  <p className="text-slate-300 mb-3">
                    These cookies enable enhanced functionality and personalization:
                  </p>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Language preferences</li>
                    <li>User interface customizations</li>
                    <li>Remember login details</li>
                    <li>Tournament preferences</li>
                  </ul>
                </div>

                <div className="rounded-lg bg-slate-800 p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Targeting/Advertising Cookies</h3>
                  <p className="text-slate-300 mb-3">
                    These cookies are used to deliver relevant advertisements:
                  </p>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Track visits across websites</li>
                    <li>Display relevant ads</li>
                    <li>Measure ad effectiveness</li>
                    <li>Partner advertising networks</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Third-Party Cookies</h2>
              <p className="text-slate-300 leading-7 mb-4">
                We may also use third-party services that set cookies on our website:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Google Analytics</h4>
                  <p className="text-slate-300 text-sm">For website analytics and performance monitoring</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Riot Games API</h4>
                  <p className="text-slate-300 text-sm">For game data integration and player verification</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Payment Processors</h4>
                  <p className="text-slate-300 text-sm">For secure payment processing and fraud prevention</p>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Social Media Platforms</h4>
                  <p className="text-slate-300 text-sm">For social sharing and login functionality</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-slate-300 leading-7 mb-4">
                You have several options for managing cookies:
              </p>
              <div className="space-y-4">
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Browser Settings</h3>
                  <p className="text-slate-300 mb-2">
                    Most web browsers allow you to control cookies through their settings:
                  </p>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete existing cookies</li>
                    <li>Receive notifications when cookies are set</li>
                  </ul>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Cookie Banner</h3>
                  <p className="text-slate-300">
                    When you first visit our website, you&apos;ll see a cookie banner where you can choose which types of cookies to accept.
                  </p>
                </div>
                <div className="bg-slate-800 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">Opt-Out Links</h3>
                  <p className="text-slate-300">
                    Some third-party services provide direct opt-out mechanisms. Check your account settings or visit their privacy pages.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Impact of Disabling Cookies</h2>
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-6">
                <p className="text-amber-200 leading-7">
                  <strong>Please note:</strong> Disabling certain cookies may affect the functionality of our website. 
                  Essential cookies cannot be disabled as they are necessary for the website to function properly. 
                  Disabling other cookies may result in:
                </p>
                <ul className="list-disc list-inside text-amber-200 mt-3 space-y-1">
                  <li>Loss of personalized settings</li>
                  <li>Reduced website performance</li>
                  <li>Limited access to certain features</li>
                  <li>Need to re-enter information repeatedly</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Updates to This Policy</h2>
              <p className="text-slate-300 leading-7">
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. 
                Any changes will be posted on this page with an updated effective date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-slate-300 leading-7 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="bg-slate-800 p-6 rounded-lg">
                <div className="space-y-2">
                  <p className="text-slate-300"><strong>Email:</strong> privacy@bracketesports.com</p>
                  <p className="text-slate-300"><strong>Address:</strong> 123 Gaming Street, San Francisco, CA 94102</p>
                  <p className="text-slate-300"><strong>Phone:</strong> +1 (555) 123-4567</p>
                </div>
              </div>
            </section>

            <div className="bg-slate-800 p-6 rounded-lg text-center">
              <p className="text-slate-400 text-sm">
                Last updated: January 10, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
