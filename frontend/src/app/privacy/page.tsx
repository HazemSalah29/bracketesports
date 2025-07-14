export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Last updated: July 9, 2025
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-none prose prose-slate prose-invert">
          <div className="text-slate-300 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p>
                At Bracket Esports, we collect information you provide directly to us, such as when you create an account, 
                participate in tournaments, or contact us for support.
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Account information (username, email, gaming accounts)</li>
                <li>Tournament participation data and match results</li>
                <li>Communication preferences and support requests</li>
                <li>Gaming account verification data from Riot Games API</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>To create and manage your account</li>
                <li>To organize and run tournaments</li>
                <li>To verify gaming accounts through official APIs</li>
                <li>To provide customer support</li>
                <li>To send important updates and notifications</li>
                <li>To improve our platform and user experience</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Riot Games API Integration</h2>
              <p>
                Our platform integrates with Riot Games API to verify Valorant and League of Legends accounts:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>We verify account ownership through official Riot APIs</li>
                <li>We fetch match history and ranking data to display on your profile</li>
                <li>We do not store sensitive account credentials</li>
                <li>All data is retrieved in compliance with Riot Games API Terms of Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties except:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and the safety of our users</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Secure data transmission using HTTPS</li>
                <li>Encrypted password storage</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal data by authorized personnel</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Your Rights</h2>
              <p>
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Access to your personal data</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your account and associated data</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Keep you logged in</li>
                <li>Remember your preferences</li>
                <li>Analyze platform usage</li>
                <li>Improve our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any material changes 
                by posting the new policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-slate-800 rounded-lg">
                <p>Email: privacy@bracketesports.com</p>
                <p>Address: 123 Gaming Street, Esports City, EC 12345</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
