export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Terms of Service
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Last updated: July 9, 2025
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-none prose prose-slate prose-invert">
          <div className="text-slate-300 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Bracket Esports (&quot;the Platform&quot;), you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Platform Description</h2>
              <p>
                Bracket Esports is an esports tournament platform that allows users to:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Create accounts and link gaming profiles</li>
                <li>Participate in organized tournaments</li>
                <li>Track performance and rankings</li>
                <li>Connect with other players in the gaming community</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts and Responsibilities</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Account Creation</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You must provide accurate and complete information</li>
                  <li>You are responsible for maintaining account security</li>
                  <li>One account per person is permitted</li>
                  <li>You must be at least 13 years old to create an account</li>
                </ul>

                <h3 className="text-xl font-semibold text-white">Gaming Account Verification</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You may only link gaming accounts that you own</li>
                  <li>Account verification is performed through official game APIs</li>
                  <li>False information may result in account suspension</li>
                  <li>You consent to verification through Riot Games API for supported games</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Tournament Rules and Fair Play</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">General Rules</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All participants must compete fairly and honestly</li>
                  <li>Cheating, hacking, or exploiting game mechanics is strictly prohibited</li>
                  <li>Toxic behavior, harassment, or unsportsmanlike conduct is not tolerated</li>
                  <li>Tournament organizers&apos; decisions are final</li>
                </ul>

                <h3 className="text-xl font-semibold text-white">Penalties</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violations may result in disqualification from tournaments</li>
                  <li>Repeated violations may lead to permanent account suspension</li>
                  <li>Prize forfeiture may occur for rule violations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
              <p>
                The Platform and its original content, features, and functionality are owned by Bracket Esports and are 
                protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Game content belongs to respective game publishers (Riot Games, etc.)</li>
                <li>User-generated content remains the property of users</li>
                <li>By using the Platform, you grant us a license to use your content for platform operations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Prizes and Rewards</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white">Eligibility</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Prizes are awarded based on tournament performance</li>
                  <li>Participants must meet all tournament requirements</li>
                  <li>Tax obligations are the responsibility of prize winners</li>
                </ul>

                <h3 className="text-xl font-semibold text-white">Distribution</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Prizes will be distributed within 30 days of tournament completion</li>
                  <li>Prize distribution may be delayed for verification purposes</li>
                  <li>Unclaimed prizes may be forfeited after 90 days</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Third-Party Services</h2>
              <p>
                Our Platform integrates with third-party services including:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Riot Games API for account verification and match data</li>
                <li>Payment processors for prize distribution</li>
                <li>Analytics services for platform improvement</li>
              </ul>
              <p className="mt-4">
                Use of these services is subject to their respective terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Platform, 
                to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
              <p>
                Bracket Esports shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Platform immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                we will provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                <p>Email: legal@bracketesports.com</p>
                <p>Address: 123 Gaming Street, Esports City, EC 12345</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
